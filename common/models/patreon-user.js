'use strict'

const patreonAPI = require('patreon').patreon;
const jsonApiURL = require('patreon').jsonApiURL;
const JsonApiDataStore = require('jsonapi-datastore').JsonApiDataStore;
const request = require('request');
const TokenProvider = require('refresh-token');

const PATREON_CREATOR_ACCESS_TOKEN = process.env['PATREON_CREATOR_ACCESS_TOKEN'];

const getPledgesForUrl = async (nextUrl, accessToken, accountId) => {
  const client = patreonAPI(accessToken);

  let urlString = jsonApiURL(nextUrl, {
    fields: {
      pledge: [
        'amount_cents',
        'total_historical_amount_cents',
        'declined_since',
        'created_at',
        'pledge_cap_cents',
        'patron_pays_fees',
        'is_paused'
      ]
    }
  });
  urlString = urlString.replace('[', '%5B');
  urlString = urlString.replace(']', '%5D');
  console.log('URL: ' + urlString);
  let results = await client(urlString);
  let store = results['store'];
  nextUrl = results.rawJson['links']['next'];
  if (nextUrl) {
    nextUrl = nextUrl.replace('https://www.patreon.com/api/oauth2/api', '');
    console.log(nextUrl);
  }
  const pledges = store.findAll('pledge');
  let allPledges = [];
  for (let pledge of pledges) {
    let pledgeData = pledge.serialize().data;
    let patronData = pledge.patron.serialize().data;
    if (pledge) {
      let amountPledged = pledgeData.attributes['amount_cents'];
      if (amountPledged > 0 && pledgeData.attributes['is_paused'] === false) {
        let pledgeInfo = {
          id: pledgeData.id,
          amount: pledgeData.attributes['amount_cents'],
          createdAt: pledgeData.attributes['created_at'],
          patreonId: patronData.id,
          isPaused: pledgeData.attributes['is_paused'],
          userName: patronData.attributes['full_name'],
          isDeclined: pledgeData.attributes['declined_since'] ? false : true,
          userEmail: patronData.attributes['email'],
          historicalAmount: pledgeData.attributes['total_historical_amount_cents'],
          accountId: String(accountId)
        };
        allPledges.push(pledgeInfo);
      }
    }
  }
  return Promise.resolve({
    pledges: allPledges,
    next: nextUrl
  })
};

const getPledgesForCampaignId = async (campId, accessToken, accountId) => {
  let allPledges = [];
  let nextUrl = '/campaigns/' + campId + '/pledges?include=patron&page%5Bcount%5D=50&sort=created';
  while (nextUrl && nextUrl.length > 0) {
    let returnData = await getPledgesForUrl(nextUrl, accessToken, accountId);
    for (let pledgeInfo of returnData.pledges) {
      allPledges.push(pledgeInfo);
    }
    nextUrl = returnData['next'];
  }
  return Promise.resolve(allPledges);
};


const getPatreonUsersInfoAsync = async (accessToken, accountId) => {
  try {
    let allCamps = [];
    let allUsers = [];
    const patreonAPIClient = patreonAPI(String(accessToken));
    const url = jsonApiURL('/current_user/campaigns?include=rewards,creator');

    let results = await patreonAPIClient(url);
    let store = results['store'];
    // console.log(results.rawJson);

    let jsonData = results.rawJson;

    for (let camp of jsonData.data) {
      console.log(camp);
      let campInfo = {
        id: camp['id'],
        name: camp.attributes['creation_name'],
        pledgeCount: camp.attributes['patron_count'],
        pledgeSum: camp.attributes['pledge_sum']
      };
      console.log(campInfo);
      let pledges = await getPledgesForCampaignId(campInfo.id, accessToken, accountId);

      let pledgesObj = {};
      for (let pledge of pledges) {
        pledgesObj[pledge['patreonId']] = pledge;
      }

      for (let userId in pledgesObj) {
       let userObj = pledgesObj[userId];
       allUsers.push({
         accountId: accountId,
         patreonId: userObj['patreonId'],
         name: userObj['userName'],
         email: userObj['userEmail'],
         isDeclined: userObj['isDeclined'],
         pledgePaused: userObj['isPaused'],
         pledgeAmount: userObj['amount'],
         historicalPledgeAmount: userObj['historicalAmount'],
       });
      }
     // console.log('Pledge Count: ' + count);
      // console.log(pledges.length);
      allCamps.push(campInfo);
    }
    return allUsers;
  } catch (err) {
    return Promise.reject(err);
  }
};

module.exports = function(Patreonuser) {
  Patreonuser.refreshDataAsync = async () => {
      try {
        let devPrefs = await Patreonuser.app.models.DeveloperPreferences.find({
          where: {
            usePatreon: true
          }
        });

        for (let devPrefObj of devPrefs) {
          let devPref = devPrefObj;
          if (devPref.toJSON) devPref = devPref.toJSON();
          let creatorToken = devPref.patreonAccessToken;
          if (creatorToken && creatorToken.length > 0) {
            let users = await getPatreonUsersInfoAsync(creatorToken, devPref.accountId);
            let deletedCount = await Patreonuser.destroyAll({
              accountId: devPref.accountId
            });
            let usersData = await Patreonuser.create(users);
          }
        }
        //
        // let users = await getPatreonUsersInfoAsync();
        // let stuff = await Patreonuser.destroyAll({});
        //
        // let usersData = await Patreonuser.create(users);
        // console.log(usersData);

        return true;
      } catch (err) {
        return Promise.reject(err);
      }
  };


  Patreonuser.refreshData = async (cb) => {
    Patreonuser.refreshDataAsync().then((completed) => {
      cb(null, {'status': 'success'});
    }).catch((err) => {
      cb(null, {'status': 'error'});
    })
  };

  // Patreonuser.remoteMethod(
  //   'refreshData', {
  //     description: 'Refresh User Data',
  //     returns: {
  //       type: 'object', root: true
  //     },
  //     http: {path:'/refreshData', verb: 'get'}
  //   }
  // );

  Patreonuser.remoteMethod(
    'refreshData', {
      description: 'Refresh User Data',
      returns: {
        type: 'object', root: true
      },
      http: {path:'/refreshData', verb: 'get'}
    }
  );
};

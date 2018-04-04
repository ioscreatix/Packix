'use strict';

const disableAllMethods = require('../utils/disableAllMethods');

module.exports = function(Account) {
  const getAccountForId = async (userId) => {
    try {
      const userObj = await Account.findById(userId, {
        include: [
          { relation: 'devices' },
          { relation: 'packagePurchases',
            scope: {
              include: ['package'],
              where: {
                status: 'Completed'
              }
            }
          },
          { relation: 'identities' },
          { relation: 'packageGifts',
            scope: {
              include: ['package']
            }
          }
        ]
      });

      return Promise.resolve(userObj);
    } catch(err) {
      return Promise.reject(err);
    }
  };

  Account.computeProfileName = (accountObject) => {
    if (accountObject.identities && accountObject.identities.length > 0) {
      for (let identity of accountObject.identities) {
        if (identity.profile) {
          if (identity.provider === 'google') {
            return identity.profile.displayName;
          } else if (identity.provider === 'facebook') {
            return identity.profile.name.givenName + ' ' + identity.profile.name.familyName;
          }
        }
      }
    }
    return "";
  };

  Account.computeProfileEmail = (accountObject) => {
    if (accountObject.identities && accountObject.identities.length > 0) {
      for (let identity of accountObject.identities) {
        if (identity.profile) {
          if (identity.provider === 'google') {
            return identity.profile.emails[0]['value'];
          } else if (identity.provider === 'facebook') {
            return identity.profile.emails[0]['value'];
          }
        }
      }
    }
    return "";
  };

  Account.computeProfilePhoto = (accountObject) => {
    if (accountObject.identities && accountObject.identities.length > 0) {
      for (let identity of accountObject.identities) {
        if (identity.profile) {
          if (identity.provider === 'google') {
            return identity.profile.photos[0]['value'];
          } else if (identity.provider === 'facebook') {
            return identity.profile.photos[0]['value'];
          }
        }
      }
    }
    return "";
  };

  Account.computeLinkedPatreon = (accountObject) => {
    if (accountObject.identities && accountObject.identities.length > 0) {
      for (let identity of accountObject.identities) {
        if (identity.profile) {
          if (identity.provider === 'patreon') {
            return true;
          }
        }
      }
    }
    return false;
  };

  Account.computePatreonName = (accountObject) => {
    if (accountObject.identities && accountObject.identities.length > 0) {
      for (let identity of accountObject.identities) {
        if (identity.profile) {
          if (identity.provider === 'patreon') {
            return identity.profile.name;
          }
        }
      }
    }
    return "";
  };


  Account.updateAccountInfoWithId = function (accountId) {
    return new Promise(async (resolve, reject) => {
      try {
        let account = await Account.findById(accountId, {
          include: ['identities']
        });

        let accountJson = account.toJSON();

        if (account) {
          let updatedData = {};
          updatedData['profileName'] = Account.computeProfileName(accountJson);
          updatedData['profileEmail'] = Account.computeProfileEmail(accountJson);
          updatedData['profilePhoto'] = Account.computeProfilePhoto(accountJson);

          account = await account.updateAttributes(updatedData);
          return resolve(account);
        } else {
          return resolve(null);
        }
      } catch (err) {
        console.log(err);
        return reject(err);
      }
    });
  };

  Account.getMe = function(ctx, cb) {
   // // console.log(ctx);
   //  // console.log(ctx.getUser());
   //  console.log(ctx.req.accessToken);
    let userId = '';
    if (ctx.req && ctx.req.accessToken) userId = ctx.req.accessToken.userId;
    // console.log('User ID: ' + userId);
    // return cb(null, {userId: userId});
    if (userId) {
      getAccountForId(userId).then((userObj) => {
       // console.log(userObj);
        if (userObj) {
          userObj = userObj.toJSON();
          for (let identity of userObj.identities) {
           // delete identity['credentials'];
            //delete identity['profile']['_json'];
            delete identity['profile']['_raw'];
          }
          return cb(null, userObj);
        }
        else return cb(null, {});
      }).catch((err) => {
        console.log(err);
        return cb(null, {});
      })
    } else {
      cb(null, {});
    }
  };

  Account.remoteMethod(
    'getMe', {
      description: 'Gets currently logged in user',
      accepts: [
        {arg: 'ctx',type: 'object', http: {source: 'context'}}
      ],
      returns: {
        type: 'object', root: true
      },
      http: {path: '/me', verb: 'get'}
    }
  );

  disableAllMethods(Account, []);
};

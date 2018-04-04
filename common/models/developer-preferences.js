'use strict';

const disableAllMethods = require('../utils/disableAllMethods');

const unauthorizedErrorDict = {
  name: 'Unauthorized',
  status: 401,
  message: 'You are not authorized to perform this action'
};

module.exports = function(Developerpreferences) {
  Developerpreferences.updateSettings = function (settingsUpdate, req, cb) {
    // Developerpreferences.app.models.DeviceLinkNonce.destroyAll({}).then((result) => {
    //   console.log(result);
    //   Developerpreferences.app.models.Device.destroyAll({}).then((result1) => {
    //     console.log(result1);
    //   });
    // });
    let accountId = req.accessToken ? req.accessToken.userId : null;
    if (!accountId) return cb(unauthorizedErrorDict);
    Developerpreferences.findOne({
      where: {
        accountId: accountId
      }
    }, function(err, prefsObj) {
      if (err) return cb(err);
      if (!prefsObj) return cb(unauthorizedErrorDict);
      prefsObj.updateAttributes(settingsUpdate, function(err, prefsObjNew) {
        if (err) return cb(err);
        if (!prefsObjNew) return cb(unauthorizedErrorDict);
        return cb(null, prefsObjNew);
      });
    });
  };


  Developerpreferences.getSettings = function (req, cb) {
    console.log('Get Settings was Called');
    let accountId = req.accessToken ? req.accessToken.userId : null;
    console.log('Account ID for Developer Settings: ' + accountId);
    if (!accountId) return cb(unauthorizedErrorDict);
    Developerpreferences.findOne({
      where: {
        accountId: String(accountId)
      }
    }, function(err, prefsObj) {
      console.log('Found Results');
      console.log(err);
      console.log(prefsObj);
      if (err) return cb(err);
      if (!prefsObj) return cb(unauthorizedErrorDict);
      return cb(null, prefsObj);
    });
  };

  Developerpreferences.remoteMethod(
    'getSettings', {
      description: 'Gets the Current Repository Settings',
      accepts: [
        {arg: 'req', type: 'object', http: {source: 'req'}}
      ],
      returns: {type: 'any', root: true},
      http: {path: '/getSettings', verb: 'get'}
    }
  );

  Developerpreferences.remoteMethod(
    'updateSettings', {
      description: 'Update the Repository Settings',
      accepts: [
        {arg: 'settingsUpdate', type: 'object'},
        {arg: 'req', type: 'object', http: {source: 'req'}}
      ],
      returns: {type: 'any', root: true},
      http: {path: '/updateSettings', verb: 'post'}
    }
  );

  disableAllMethods(Developerpreferences, []);

};

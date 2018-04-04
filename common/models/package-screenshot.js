'use strict';

const disableAllMethods = require('../utils/disableAllMethods');

module.exports = function(Packagescreenshot) {
  const SCREENSHOTS_CONTAINER_NAME = process.env['SCREENSHOTS_CONTAINER_NAME'] || 'screenshots';

  let lastDeletedPackageId = "";

  Packagescreenshot.prototype.download = function(size, req, res, cb) {
    if (!size || size.length < 1) {
      size = 'full';
    }

    if (!this.sizes[size]) {
      size = 'full';
    }
    let fileId = this.sizes[size]['fileId'];
    let Container = Packagescreenshot.app.models.Container;

    Container.downloadInline(SCREENSHOTS_CONTAINER_NAME, fileId, res, cb);
  };


  Packagescreenshot.updateScreenshotsForPackageId = async (packageIdValue) => {
    try {
      let screenshots = await Packagescreenshot.find({
        where: {
          packageId: packageIdValue
        },
        fields: {
          id: true,
          sizes: true
        }
      });

      let packageObj = await Packagescreenshot.app.models.Package.findById(packageIdValue);
      packageObj = await packageObj.updateAttribute('screenshots', screenshots);
      return Promise.resolve();
    } catch (err) {
      console.log(err);
      return Promise.reject();
    }
  };

  Packagescreenshot.observe('before delete', function(ctx, next) {
    Packagescreenshot.findById(ctx.where.id, function(err, sObj) {
      ctx.hookState.packageId = sObj.packageId;
      lastDeletedPackageId = sObj.packageId;
      next();
    })
  });

  Packagescreenshot.observe('after delete', function(ctx, next) {
    Packagescreenshot.updateScreenshotsForPackageId(lastDeletedPackageId).then(() => {
      next();
    });
  });

  Packagescreenshot.remoteMethod(
    'download',
    {
      isStatic: false,
      accepts: [
        {arg: 'size', type: 'string'},
        {arg: 'req', type: 'object', http: {source: 'req'}},
        {arg: 'res', type: 'object', 'http': {source: 'res'}}
      ],
      http: {path: '/download.jpg', verb: 'get'},
      returns: {}
    }
  );

  disableAllMethods(Packagescreenshot, []);
};

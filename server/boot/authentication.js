module.exports = function enableAuthentication(app) {
  const dynamicOwnerResolver = require('../../common/utils/dynamicOwner');
  // enable authentication
  app.enableAuth({ datasource: 'db' });
  // app.middleware('session:before',


  // console.log(app.models.UserProfile.acls)

  console.log(app.models.UserIdentity.settings.acls);
  const Role = app.models.Role;
  Role.registerResolver('dynamicOwner', function(role, context, cb) {
    //console.log(context)
    console.log('Running Package Mine');
    dynamicOwnerResolver(context, cb);
    // dynamicOwner(context).then((result) => {
    //   return process.nextTick(() => cb(null, result));
    // }).catch((err) => {
    //   console.log(err);
    //   return process.nextTick(() => cb(null, false));
    // })
  });

};

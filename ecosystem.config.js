'use-strict';

let config = {
  apps: [
    {
      name: 'frontend_packix',
      script: './client/server.js',
      instances: '4',
      exec_mode: 'cluster',
      env_production: {
        'NODE_ENV': 'production'
      }
    }, {
      name: 'backend_packix',
      script: './server/server.js',
      instances: '4',
      exec_mode: 'cluster',
      env_production: {
        NODE_ENV: 'production'
      }
    }
  ]
};

let environmentVariables = require('./environment.json');

for(var app of config.apps) {
  app.env_production = environmentVariables[app.name];
}

module.exports = config;

var path = require('path');

var rootPath = __dirname + '/../../';

const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  development: {
    rootPath: rootPath,
    db: process.env.MONGOLAB_URI,
    port: process.env.PORT || 3000,
    googleAuth: {
      clientID: process.env.clientID,
      clientSecret: process.env.clientSecret,
      callbackURL: `http://${process.env.SITE_NAME}/login/auth/google/callback`
    }
  },
  test: {
    rootPath: rootPath,
    db: process.env.MONGOLAB_URI,
    port: process.env.PORT || 3000,
    googleAuth: {
      clientID: process.env.clientID,
      clientSecret: process.env.clientSecret,
      callbackURL: `http://${process.env.SITE_NAME}/login/auth/google/callback`
    }
  },
  production: {
    rootPath: rootPath,
    db: process.env.MONGOLAB_URI,
    port: process.env.PORT || 3000,
    googleAuth: {
      clientID: process.env.clientID,
      clientSecret: process.env.clientSecret,
      callbackURL: `http://${process.env.SITE_NAME}/login/auth/google/callback`
    }
  }


};
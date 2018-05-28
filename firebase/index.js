var admin = require('firebase-admin');

var serviceAccount = require('../teachla-sdk.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://teachlacodingplatform.firebaseio.com'
});

module.exports = admin.auth()
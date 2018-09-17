// var admin = require('firebase-admin');
const firebase = require("firebase");
// Required for side-effects
require("firebase/firestore");

// var serviceAccount = require('../teachla-sdk.json');
var config = require('../firebase-config.json');

firebase.initializeApp(config);

let db = firebase.firestore()

db.settings = ({
  timestampsInSnapshots: true
})

module.exports = db

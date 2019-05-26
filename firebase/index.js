const firebase = require("firebase");
// Required for side-effects
require("firebase/firestore");

var config = require("../firebase-config.js");

firebase.initializeApp(config);

let db = firebase.firestore();

const settings = {};

db.settings(settings);

module.exports = db;

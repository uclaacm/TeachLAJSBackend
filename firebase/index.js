const firebase = require("firebase");
// Required for side-effects
require("firebase/firestore");

var config;
config = require("../firebase-config-prod.json");

// if (process && process.env && process.env.FS_DB === "prod") {
//   config = require("../firebase-config-prod.json");
// } else {
//   config = require("../firebase-config.json");
// }

firebase.initializeApp(config);

let db = firebase.firestore();

const settings = {};

db.settings(settings);

module.exports = db;

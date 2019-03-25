const {
  SUPPORTED_LANGUAGES,
  DEFAULT_USER_DATA,
  createDefaultProgramDoc,
  languageToDisplayName,
} = require("../constants");
const winston = require("winston");

/**
 * initializeUserData
 *
 * @param {json} userInfo - represents the newly created user
 * @returns {json}
 *  @key {boolean} ok - true if no errors, false otherwise
 *  @key {json or string} data - json of user data initialized in database
 */

const firestore = require("../firebase");

const initializeUserData = async function(uid, options) {
  winston.info(`Starting async user init`);
  winston.info(`UID: ${uid} Options: ${JSON.stringify(options || {})}`);

  if (!uid) {
    winston.error(`No UID provided. Exiting`);
    return { ok: false, error: "No UID provided" };
  }

  try {
    //create document with base user data at /users/:uid
    winston.verbose("Initializing doc...");
    let userDoc = firestore.collection("/users").doc(uid.toString());

    await userDoc.set(DEFAULT_USER_DATA);

    winston.verbose("Creating programs...");
    //languages broken into code, editDate,
    let programCollection = userDoc.collection("programs");

    let promises = [];

    SUPPORTED_LANGUAGES.forEach(lang => {
      //push one document set promise into the array
      promises.push(
        programCollection
          //create the document with the correct name
          .doc(languageToDisplayName(lang))
          //set it to the default object
          .set(createDefaultProgramDoc(lang)),
      );
    });

    await Promise.all(promises);

    winston.info("Initialized user. Exiting");
    return {
      ok: true,
    };
  } catch (err) {
    winston.error(`Failed to initialize user data for ${uid}. Received error: ${err}`);
    return { ok: false, error: "Failed in catch: " + err };
  }
};

module.exports = initializeUserData;

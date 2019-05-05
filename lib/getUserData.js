const firestore = require("../firebase");
const initializeUserData = require("./initializeUserData.js");
const { DEFAULT_USER_DATA } = require("../constants");
const winston = require("winston");
/**
 * getUser
 *
 *  @param {json} uid - firebase user id key for database
 *  @returns {json}
 */
const getUserData = async function(uid, options) {
  winston.info(`Starting async user data get`);
  winston.info(`UID: ${uid} Options: ${JSON.stringify(options || {})}...`);

  if (!uid) {
    winston.error(`No UID provided. Exiting`);
    return { ok: false, error: "No UID provided" };
  }

  try {
    let result = {};

    winston.verbose(`Getting document from DB...`);

    let userDoc = await firestore
      .collection("/users")
      .doc(uid.toString())
      .get();

    if (userDoc.exists) {
      winston.verbose(`Adding basic user data to result...`);
      result = { ok: true, data: { userData: userDoc.data() } };
    } else {
      winston.verbose(`Document does not yet exist. Initializing user...`);
      let { ok, error } = await initializeUserData(uid);

      if (!ok) {
        winston.verbose(`Failed to init user, received error: ${error}`);
        return { ok: false, error: "User doesn't exist. Failed to create user." };
      }

      winston.verbose(`Adding user data from new initialized user...`);
      result = { ok: true, data: { userData: DEFAULT_USER_DATA } };
    }

    //only triggers if the request is asking for the programs
    if (options && options.programs) {
      winston.info(`OPTIONS: Including mostRecentProgram in result...`);
      const { mostRecentProgram, programs } = result.data.userData;
      let firestoreProgram = {};
      let programDoc = await firestore
        .collection("/programs")
        .doc(mostRecentProgram)
        .get();

      if (!programDoc.exists) {
        winston.warn(`No program documents found for the user ${uid}`);
        return result;
      }

      winston.verbose(`Found ${mostRecentProgram}. Adding to result`);
      result.data.program = programDoc.data();
    }

    winston.info("Retrieved user data. Exiting...");
    return result;
  } catch (err) {
    winston.error(`Fell to catch block for user ${uid}, error received: ${err}`);
    return { ok: false, error: "Sorry! Server error, try again later..." };
  }
};

module.exports = getUserData;

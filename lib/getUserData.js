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
        return { ok: false, error: error };
      }

      winston.verbose(`Adding user data from new initialized user...`);
      result = { ok: true, data: { userData: DEFAULT_USER_DATA } };
    }

    //only triggers if the request is asking for the programs
    if (options && options.programs) {
      winston.info(`OPTIONS: Including programs in result...`);
      let firestorePrograms = {};
      let programDocs = await firestore
        .collection("/users")
        .doc(uid.toString())
        .collection("programs")
        .get();

      if (programDocs.size === 0) {
        winston.warn(`No program documents found for the user ${uid}`);
      } else {
        winston.verbose(`Found ${programDocs.size} program docs`);
      }

      //for each program doc, add it to the programs object of the result
      await programDocs.forEach(async doc => {
        try {
          winston.verbose(`Adding doc ${doc.id} to result...`);
          if (doc.exists) {
            firestorePrograms[doc.id] = await doc.data();
          } else {
            winston.error(`For some reason doc ${doc.id} does not exist ${uid}...`);
          }
        } catch (err) {
          //if there's a failed read, set the result to false and add an error
          winston.error(`Failed to add document ${doc.id} for user ${uid}, received error: ${err}`);
          result.ok = false;
          result.err = err;
        }
      });
      result.data.programs = firestorePrograms;
    }

    winston.info("Retrieved user data. Exiting...");
    return result;
  } catch (err) {
    winston.error(`Fell to catch block for user ${uid}, error received: ${err}`);
    return { ok: false, error: "Sorry! Server error, try again later..." };
  }
};

module.exports = getUserData;

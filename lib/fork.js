const firestore = require("../firebase");
const winston = require("winston");

/**---------fork--------------
 * allows a user to create a copy of another user's sketch
 */

/**--------Parameters------------
 * uid: string, the UID of the user requesting the sketch copy
 * json:
 *  {
 *      ownerUID - string, the UID of the owner of the sketch,
 *      program - string, the name of the sketch being copied,
 *      copyName - string to name the program copy
 *  }
 */

const fork = async function(uid, json) {
  winston.info(`Starting async user data get`);
  winston.info(`UID: ${uid} json: ${JSON.stringify(json || {})}...`);

  if (!json) {
    winston.error(`No json provided. Exiting`);
    return { ok: false, error: "No json provided" };
  }

  if (!uid) {
    winston.error(`No destination UID provided. Exiting`);
    return { ok: false, error: "No destination UID provided" };
  }

  if (!json.ownerUID || !json.program || !json.copyName) {
    winston.error(`Not all json fields provided. Exiting`);
    return { ok: false, error: "Not all json fields provided" };
  }

  let programCheckRef = firestore
    .collection("/users")
    .doc(uid.toString())
    .collection("programs")
    .doc(json.copyName);

  let dupName = await programCheckRef.get();
  if (dupName.exists) {
    winston.error(`Document name provided already exists in user's programs. Exiting`);
    return { ok: false, error: "Document name provided already exists in user's programs" };
  }

  try {
    winston.verbose(`Getting document from DB...`);

    // get ref to program document
    let programDocRef = firestore
      .collection("/users")
      .doc(json.ownerUID.toString())
      .collection("programs")
      .doc(json.program.toString());

    // initialize language, code, and program name for copy
    let progLang = "";
    let progBody = "";
    let progName = json.copyName;

    // get program values
    try {
      let progRes = await programDocRef.get();
      if (progRes.exists) {
        winston.verbose(`Found program with name ${json.program}`);
        progLang = progRes.get("language");
        progBody = progRes.get("code");
      } else {
        winston.error(`No program document named ${program} found for the user ${ownerUID}`);
        return { ok: false, error: "No program document of the given name was found!" };
      }
    } catch (err) {
      winston.error("Error getting document:", err);
    }

    let userProgsDocRef = firestore
      .collection("/users")
      .doc(uid.toString())
      .collection("programs");

    userProgsDocRef.doc(progName).set({
      code: progBody,
      language: progLang,
    });
  } catch (err) {
    winston.error(`Fell to catch block for user ${uid}, error received: ${err}`);
    return { ok: false, error: "Sorry! Server error, try again later..." };
  }
  winston.info("Created sketch, exiting...");
  return;
};

module.exports = fork;

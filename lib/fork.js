const firestore = require("../firebase");
const winston = require("winston");

/**---------fork--------------
 * allows a user to create a copy of another user's sketch
 */

/**--------Parameters------------
 * uid: string representing the destination user for the sketch copy
 * json: object describing the UID of the owner of the sketch (ownerUID),
 *       the name of the program (program),
 *       and an optional string to name the program copy (copyName)
 */

const fork = async function(uid, options) {
  winston.info(`Starting async user data get`);
  winston.info(`UID: ${uid} Options: ${JSON.stringify(options || {})}...`);

  if (!uid) {
    winston.error(`No destination UID provided. Exiting`);
    return { ok: false, error: "No destination UID provided" };
  }

  if (!options.ownerUID) {
    winston.error(`No UID provided. Exiting`);
    return { ok: false, error: "No UID provided" };
  }

  try {
    winston.verbose(`Getting document from DB...`);

    // get ref to program document
    let programDocRef = await firestore
      .collection("/users")
      .doc(options.ownerUID.toString())
      .collection("programs")
      .doc(options.program.toString());

    // initialize language, code, and program name for copy
    let progLang = "";
    let progBody = "";
    const time = new Date();
    let progName = options.copyName || time.toString();

    // get program values
    programDocRef
      .get()
      .then(function(doc) {
        if (doc.exists) {
          winston.verbose(`Found program with name ${options.program}`);
          progLang = doc.getString("language");
          progBody = doc.getString("code");
        } else {
          winston.warn(`No program document named ${program} found for the user ${ownerUID}`);
        }
      })
      .catch(function(error) {
        winston.error("Error getting document:", error);
      });

    let userProgsDocRef = await firestore
      .collection("/users")
      .doc(uid.toString())
      .collection("programs");

    userProgsDocRef.doc(progName).set({
      code: progBody,
      language: progLang,
    });

    winston.info("Created sketch, exiting...");
    return;
  } catch (err) {
    winston.error(`Fell to catch block for user ${uid}, error received: ${err}`);
    return { ok: false, error: "Sorry! Server error, try again later..." };
  }
};

module.exports = fork;

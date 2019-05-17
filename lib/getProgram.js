const firestore = require("../firebase");
const winston = require("winston");

/**---------getProgram--------------
 * retrieves a program's data
 */

/**--------Parameters------------
 * sketchid: string, the id of the sketch being requested
 */

const getProgram = async function(sketchid) {
  if (!sketchid) {
    winston.error(`No sketch ID provided. Exiting`);
    return { ok: false, error: "No sketch ID provided." };
  }
  let result = {};
  try {
    winston.verbose(`Getting document from DB...`);

    // get ref to program document
    let programDocRef = firestore
      .collection("programs")
      .doc(sketchid.toString());

    // language and code
    let program = {};

    // get program values
    try {
      let progRes = await programDocRef.get();
      if (progRes.exists) {
        winston.verbose(`Found program with name ${sketchid}`);
        program = progRes.get();
        result = { ok: true, data: program };
      } else {
        winston.error(`No program document named ${sketchid} found.`);
        return { ok: false, error: "No program document of the given name was found!" };
      }
    } catch (err) {
      winston.error("Error getting document:", err);
      return { ok: false, error: "Error getting document" };
    }
  } catch (err) {
    winston.error(`Fell to catch block for user, error received: ${err}`);
    return { ok: false, error: "Sorry! Server error, try again later..." };
  }
  winston.info("Got sketch data, exiting...");
  return result;
};

module.exports = getProgram;
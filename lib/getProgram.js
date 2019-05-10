const firestore = require("../firebase");
const winston = require("winston");

/**---------getProgram--------------
 * retrieves a program's data
 */

/**--------Parameters------------
 * ownerid: string, the UID of the owner of the sketch
 * sketchid: string, the id of the sketch being requested
 */

const getProgram = async function(ownerid, sketchid, json) {
  if (!json) {
    winston.error(`No json provided. Exiting`);
    return { ok: false, error: "No json provided" };
  } // NECESSARY??? OR NO

  if (!ownerid || !sketchid) {
    winston.error(`Not all json fields provided. Exiting`);
    return { ok: false, error: "Not all json fields provided" };
  }
  let result = {};
  try {
    winston.verbose(`Getting document from DB...`);

    // get ref to program document
    let programDocRef = firestore
      .collection("/users")
      .doc(ownerid.toString())
      .collection("programs")
      .doc(sketchid.toString());

    // language and code
    let progLang = "";
    let progBody = "";
    // let progName = "";

    // get program values
    try {
      let progRes = await programDocRef.get();
      if (progRes.exists) {
        winston.verbose(`Found program with name ${sketchid}`);
        progLang = progRes.get("language");
        progBody = progRes.get("code");

        result = { ok: true, data: { code: progBody, language: progLang } };
        
      } else {
        winston.error(`No program document named ${sketchid} found for the user ${ownerid}`);
        return { ok: false, error: "No program document of the given name was found!" };
      }
    } catch (err) {
      winston.error("Error getting document:", err);
      return { ok: false, error: "Error getting document" };
    }
  } catch (err) {
    winston.error(`Fell to catch block for user ${uid}, error received: ${err}`);
    return { ok: false, error: "Sorry! Server error, try again later..." };
  }
  winston.info("Got sketch data, exiting...");
  return result;
};

module.exports = getProgram;
const firestore = require("../firebase");
const winston = require("winston");

/**---------updatePrograms--------------
 * merges the provided data with the users' document
 */

/**--------Parameters------------
 * uid: string representing which user we should be updating
 * json: object like so
 * {
 *   Python:{code:"fdasfa", language:"python"}
 *   Processing:{language:"javascript"}
 *   HTML: {code:"<div/>"}
 * }
 * each key is a program name with the value as a json
 * each json will be merged with the correspondingly named doc
 * i.e. Python would get tis code and language updated, Processing just the language
 * and HTML just the code
 */

const updatePrograms = async function(uid, json) {
  winston.info(`Starting async user programs update`);
  winston.info(`UID: ${uid}`);
  winston.verbose(`JSON: ${JSON.stringify(json || {})}`);

  if (!json) {
    winston.error("No JSON provided, Exiting");
    return { ok: false, error: "No json provided" };
  }
  if (!uid) {
    winston.error("No UID provided, Exiting");
    return { ok: false, error: "No uid provided" };
  }

  try {
    //create document with base user data at /users/:uid
    const collection = firestore
      .collection("/users")
      .doc(uid.toString())
      .collection("programs");

    const programs = Object.keys(json);

    if (!programs.length) {
      winston.error(`Provided JSON has no keys (user ${uid}). Exiting`);
      return { ok: false, error: "json provided has no keys" };
    }

    let promises = [];

    //function to be called on every program in the QuerySnapshot programs
    const updateProgram = async program => {
      let doc = {};
      try {
        doc = await firestore
          .collection("/users")
          .doc(uid.toString())
          .collection("programs")
          .doc(program)
          .get();
      } catch (err) {
        winston.error(
          `"${program}" program for ${uid} not found, failed to get doc. Received error: ${err}...`,
        );
      }

      if (doc.exists) {
        winston.verbose(`Updating '${program}'...`);
        winston.verbose(`Setting value to '${JSON.stringify(json[program] || {})}'`);
        return collection.doc(program).update(program, json[program]);
      } else {
        winston.error(`"${program}" program for ${uid} not found, ignoring update...`);
      }
    };

    winston.verbose(`Updating ${programs.length} programs:`);
    programs.forEach(async program => {
      promises.push(updateProgram(program));
    });

    await Promise.all(promises);

    //if we reach this point, none of the awaits failed, and the update is finished
    winston.info("Succesfully saved all programs. Exiting");
    return { ok: true };
  } catch (err) {
    winston.error(`Failed to update programs for ${uid}. Received error: ${err}`);
    return { ok: false, error: "Failed in catch: " + err };
  }
};

module.exports = updatePrograms;

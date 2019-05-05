const firestore = require("../firebase");
const winston = require("winston");

/**---------deleteProgram--------------
 * removes a program document from a user
 */

/**--------Parameters (inside of body)------------
 * uid: string representing which user we should be updating
 * name: name of the document to delete
 */

const deleteProgram = async function(body) {
  const { uid, name } = body;

  winston.info(`Starting async delete sketch`);
  winston.info(`UID: ${uid} Name: ${name}`);

  if (!body) {
    winston.error("No JSON provided, Exiting");
    return { ok: false, error: "No json provided" };
  }
  if (!uid) {
    winston.error("No UID provided, Exiting");
    return { ok: false, error: "No uid provided" };
  }
  if (!name) {
    winston.error("No name provided, Exiting");
    return { ok: false, error: "No program name provided" };
  }

  try {
    await firestore
      .collection("/programs")
      .doc(name)
      .delete();

    winston.info(`Deleted doc. Exiting`);
    return { ok: true };
  } catch (err) {
    winston.error(`Failed to create program for ${uid}. Received error: ${err}`);
    return { ok: false, error: "Failed to create program" };
  }
};

module.exports = deleteProgram;

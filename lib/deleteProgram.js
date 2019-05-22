const firestore = require("../firebase");
const winston = require("winston");
const arrayRemove = require("firebase").firestore.FieldValue.arrayRemove;
/**---------deleteProgram--------------
 * removes a program document from a user
 */

/**--------Parameters (inside of body)------------
 * uid: string representing which user we should be updating
 * name: name of the document to delete
 */

const deleteProgram = async function(body) {
  const { uid, docID } = body;

  winston.info(`Starting async delete sketch`);
  winston.info(`UID: ${uid} docID: ${docID}`);

  if (!body) {
    winston.error("No JSON provided, Exiting");
    return { ok: false, error: "No json provided" };
  }
  if (!docID) {
    winston.error("No docID provided, Exiting");
    return { ok: false, error: "No docID provided" };
  }

  try {
    winston.info(`Deleting program ID from user doc`);
    await firestore
      .collection("/users")
      .doc(uid)
      .update({
        programs: arrayRemove(docID),
      });
    winston.info(`Deleting program doc`);
    await firestore
      .collection("/programs")
      .doc(docID)
      .delete();

    winston.info(`Deleted doc. Exiting`);
    return { ok: true };
  } catch (err) {
    winston.error(`Failed to create program for ${uid}. Received error: ${err}`);
    return { ok: false, error: "Failed to create program" };
  }
};

module.exports = deleteProgram;

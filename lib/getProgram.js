const firestore = require("../firebase");
const winston = require("winston");

/**---------getProgram--------------
 * retrieves a program document
 */

/**--------Parameters (inside of body)------------
 * docID: key for document
 */
const getProgram = async function(docID) {
  winston.info(`Starting async get sketch`);
  winston.info(`docID: ${docID}`);

  if (!docID) {
    winston.error("No Document ID provided, exiting...");
    return {
      ok: false,
      error: "No docID provided",
    };
  }

  try {
    winston.info(`Getting sketch document...`);

    let doc = await firestore
      .collection("/programs")
      .doc(docID)
      .get();
    winston.info(`Got doc. Returning...`);
    return {
      ok: true,
      sketch: doc.data(),
    };
  } catch (err) {
    winston.error(`Failed to get program for ${docID}. Received error: ${err}`);
    return {
      ok: false,
      error: `Failed to get program, error: ${err}`,
    };
  }
};

module.exports = getProgram;

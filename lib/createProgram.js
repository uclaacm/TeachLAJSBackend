const firestore = require("../firebase");
const winston = require("winston");
const constants = require("../constants");
const arrayUnion = require("firebase").firestore.FieldValue.arrayUnion;

/**---------createProgram--------------
 * adds the program provided in the body
 */

/**--------Parameters (inside of body)------------
 * uid: string representing which user we should be updating
 * name: name of the new document
 * thumbnail: index of the thumbnail picture
 * language: language the program will use
 */

const createProgram = async function(body) {
  const { uid, name, thumbnail, language } = body;
  let { code } = body;

  winston.info(`Starting async create sketch`);
  winston.info(`UID: ${uid}`);
  winston.verbose(`Name: ${name} thumbnail: ${thumbnail} language: ${language} code: ${code}`);

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
    return { ok: false, error: "No name provided" };
  }
  if (
    thumbnail === "" ||
    thumbnail === undefined ||
    thumbnail >= constants.NUM_PROGRAM_THUMBNAIL_OPTIONS ||
    thumbnail < 0
  ) {
    winston.error("Bad thumbnail provided, Exiting");
    return { ok: false, error: "No thumbnail provided" };
  }
  if (!language) {
    winston.error("No language provided, Exiting");
    return { ok: false, error: "No language provided" };
  }

  if (!code) {
    code = constants.languageToDefaultCode(language);
  }

  const programData = {
    thumbnail,
    language,
    name,
    code,
    dateCreated: new Date(Date.now()).toUTCString(),
  };

  try {
    //create document with base user data at /users/:uid
    const userDoc = await firestore
      .collection("/users")
      .doc(uid)
      .get();

    if (!userDoc.exists) {
      winston.error(`Couldn't find user ${uid} in DB`);
      return { ok: false, error: `Couldn't find user` };
    }

    winston.verbose(`Found user '${uid}'. Creating new document`);

    //generate a unique document
    const newProgramDoc = await firestore.collection("/programs").add(programData);

    winston.verbose(`Generated document ${newProgramDoc.id}`);

    await firestore
      .collection("/users")
      .doc(uid)
      .update({
        programs: arrayUnion(newProgramDoc.id),
      });

    winston.info(`Added doc to user. Exiting`);
    return { ok: true, data: programData };
  } catch (err) {
    winston.error(`Failed to create program for ${uid}. Received error: ${err}`);
    return { ok: false, error: "Failed to create program" };
  }
};

module.exports = createProgram;

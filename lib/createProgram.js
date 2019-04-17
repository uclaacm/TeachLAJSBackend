const firestore = require("../firebase");
const winston = require("winston");
const constants = require("../constants");

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
  };

  try {
    //create document with base user data at /users/:uid
    const newDoc = firestore
      .collection("/users")
      .doc(uid.toString())
      .collection("programs")
      .doc(name);

    let doc = await newDoc.get();

    if (doc.exists) {
      winston.error(`"${name}" program for ${uid} already exists, failing...`);
      return { ok: false, error: "You already have a program with that name" };
    } else {
      winston.verbose(`Creating '${name}'...`);
      await newDoc.set(programData);
    }
    winston.info(`Created doc. Exiting`);
    return { ok: true, data: programData };
  } catch (err) {
    winston.error(`Failed to create program for ${uid}. Received error: ${err}`);
    return { ok: false, error: "Failed to create program" };
  }
};

module.exports = createProgram;

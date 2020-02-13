const firestore = require("../firebase");
const { adjectives, nouns } = require("../constants").RANDOM_WORDS;
const arrayUnion = require("firebase").firestore.FieldValue.arrayUnion;

const createClass = async function(body) {
  const { uid, name, thumbnail } = body;

  winston.info(`UID: ${uid}`);
  winston.verbose(`Name: ${name} thumbnail: ${thumbnail}`);

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
    thumbnail >= NUM_PROGRAM_THUMBNAIL_OPTIONS ||
    thumbnail < 0
  ) {
    winston.error("Bad thumbnail provided, Exiting");
    return { ok: false, error: "Bad thumbnail provided. Try another" };
  }

  const classData = {
    thumbnail,
    name,
    creator: uid,
    instructors: [uid],
    members: [],
    sketches: [],
  };

  try {
    let generatedId = "";

    const idExists = "";

    while (generatedId == "" || idExists.exists) {
      generatedId =
        adjectives[Math.floor(Math.random() * adjectives.length)] +
        adjectives[Math.floor(Math.random() * adjectives.length)] +
        nouns[Math.floor(Math.random() * nouns.length)];
      idExists = await firestore
        .collection("/classes")
        .doc(generatedId)
        .get();
    }

    //create document with base user data at /users/:uid
    const userDoc = await firestore
      .collection("/users")
      .doc(uid)
      .get();

    if (!userDoc.exists) {
      winston.error(`Couldn't find user ${uid} in DB`);
      return { ok: false, error: `Couldn't find user` };
    }

    winston.verbose(`Found user '${uid}'. Creating new class`);

    //generate a unique document
    const newClassDoc = await firestore
      .collection("/classes")
      .doc(generatedId)
      .set(classData);

    winston.verbose(`Generated document ${newClassDoc.id}`);

    await firestore
      .collection("/users")
      .doc(uid)
      .update({
        classes: arrayUnion(newClassDoc.id),
      });

    winston.info(`Added doc to user. Exiting`);
    return { ok: true, data: newClassDoc };
  } catch (err) {
    winston.error(`Failed to create class for ${uid}. Received error: ${err}`);
    return { ok: false, error: "Failed to create class" };
  }
};

module.exports = createClass;
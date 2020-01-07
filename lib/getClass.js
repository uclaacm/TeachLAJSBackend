const firestore = require("../firebase");
const { adjectives, nouns } = require("../constants").RANDOM_WORDS;

const getClass = async function(body) {
  const { uid, cid } = body;

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
  if (!cid) {
    winston.error("No name provided, Exiting");
    return { ok: false, error: "No name provided" };
  }

  const classData = {
    thumbnail,
    name,
    creator: uid,
    instructors: [uid],
    members: [],
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

    winston.verbose(`Found user '${uid}'. Finding the class`);

    //generate a unique document
    const classDocFull = await firestore
      .collection("/classes")
      .doc(generatedId)
      .get();

    if (!classDocFull.exists) {
    winston.error(`Couldn't find class ${cid} in DB`);
    return { ok: false, error: `Couldn't find class` };
    }

    const classDoc = classDocFull.data();

    winston.verbose(`Found ${classDoc.id}`);

    if(uid in classDoc.instructors || uid in classDoc.members){
        winston.info(`Found class, user exists in class. Exiting`);
        return { ok: true, data: classDoc };
    }

    winston.error(`Couldn't find user ${uid} in class`);
    return { ok: false, error: `Couldn't find user in class` };
  } catch (err) {
    winston.error(`Failed to create class for ${uid}. Received error: ${err}`);
    return { ok: false, error: "Failed to create class" };
  }
};

module.exports = getClass;
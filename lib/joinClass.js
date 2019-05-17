const firestore = require("../firebase");

const joinClass = async function(body) {
  const { uid, name } = body;

  winston.info(`UID: ${uid}`);
  winston.verbose(`Name: ${name}`);

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

    winston.verbose(`Found user '${uid}'. Trying to join class`);

    //generate a unique document
    const classDoc = await firestore
      .collection("/classes")
      .doc(name)
      .get();

    if (!classDoc.exists) {
      winston.error(`Couldn't find user ${name} in DB`);
      return { ok: false, error: `Couldn't find user` };
    }

    winston.verbose(`Found class ${classDoc.id}`);

    await firestore
      .collection("/classes")
      .doc(classDoc.id)
      .update({
        members: arrayUnion(uid),
      });

    await firestore
      .collection("/classes")
      .doc(uid)
      .update({
        classes: arrayUnion(classDoc.id),
      });

    winston.info(`Added user to class. Exiting`);
    return { ok: true, data: classData };
  } catch (err) {
    winston.error(`Failed to create collection for ${cid}. Received error: ${err}`);
    return { ok: false, error: "Failed to create collection" };
  }
};

module.exports = joinClass;

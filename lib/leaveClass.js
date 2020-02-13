const firestore = require("../firebase");
const arrayRemove = require("firebase").firestore.FieldValue.arrayRemove;

const leaveClass = async function(body) {
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

    const classDocFull = await firestore
      .collection("/classes")
      .doc(cid)
      .get();

    if (!classDocFull.exists) {
    winston.error(`Couldn't find class ${cid} in DB`);
    return { ok: false, error: `Couldn't find class` };
    }

    const classDoc = classDocFull.data();

    winston.verbose(`Found ${classDoc.id}`);

    if(uid in classDoc.instructors || uid in classDoc.members){
        winston.info(`Found class, user exists in class.`);
    } else {
        winston.error(`Couldn't find user ${uid} in class`);
        return { ok: false, error: `Couldn't find user in class` };
    }

    await firestore
      .collection("/classes")
      .doc(cid)
      .update({
        members: arrayRemove(uid),
      });

    await firestore
      .collection("/users")
      .doc(uid)
      .update({
        classes: arrayRemove(cid),
      });

    
    winston.info(`Removed user from class. Exiting`);
    return { ok: true, data: userDoc };
  } catch (err) {
    winston.error(`Failed to create collection for ${cid}. Received error: ${err}`);
    return { ok: false, error: "Failed to create collection" };
  }
};

module.exports = leaveClass;
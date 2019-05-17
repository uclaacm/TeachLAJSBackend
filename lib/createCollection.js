const firestore = require("../firebase");
const { adjectives, nouns } = require("../constants").RANDOM_WORDS;

const createCollection = async function(body) {
  const { cid, name } = body;

  winston.info(`CID: ${cid}`);
  winston.verbose(`Name: ${name}`);

  if (!body) {
    winston.error("No JSON provided, Exiting");
    return { ok: false, error: "No json provided" };
  }
  if (!cid) {
    winston.error("No CID provided, Exiting");
    return { ok: false, error: "No cid provided" };
  }
  if (!name) {
    winston.error("No name provided, Exiting");
    return { ok: false, error: "No name provided" };
  }

  const collectionData = {
    name,
    class: cid,
    programs: [],
  };

  try {
    //create document with base user data at /users/:uid
    const classDoc = await firestore
      .collection("/classes")
      .doc(cid)
      .get();

    if (!classDoc.exists) {
      winston.error(`Couldn't find class ${cid} in DB`);
      return { ok: false, error: `Couldn't find class` };
    }

    winston.verbose(`Found class '${cid}'. Creating new collection`);

    const collectionDoc = await firestore.collection("/collections").add(collectionData);

    await firestore
      .collection("/classes")
      .doc(cid)
      .update({
        collections: arrayUnion(collectionDoc.id),
      });

    winston.info(`Added collection to class. Exiting`);
    return { ok: true, data: collectionDoc };
  } catch (err) {
    winston.error(`Failed to create program for ${uid}. Received error: ${err}`);
    return { ok: false, error: "Failed to create program" };
  }
};

module.exports = createCollection;

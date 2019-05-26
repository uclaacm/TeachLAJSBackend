const { DEFAULT_USER_PROGRAMS, DEFAULT_USER_DATA } = require("../constants");
const winston = require("winston");
const arrayUnion = require("firebase").firestore.FieldValue.arrayUnion;

/**
 * initializeUserData
 *
 * @param {json} userInfo - represents the newly created user
 * @returns {json}
 *  @key {boolean} ok - true if no errors, false otherwise
 *  @key {json or string} data - json of user data initialized in database
 */

const firestore = require("../firebase");

const initializeUserData = async function(uid) {
  winston.info(`Starting async user init`);
  winston.info(`UID: ${uid}
  `);

  if (!uid) {
    winston.error(`No UID provided. Exiting`);
    return { ok: false, error: "No UID provided" };
  }

  try {
    //create document with base user data at /users/:uid
    winston.verbose("Initializing doc...");
    let userDoc = firestore.collection("/users").doc(uid.toString());

    let snap = await userDoc.get();

    if (snap.exists) {
      winston.error(`User already exists`);
      return { ok: false, error: "User already exists" };
    }

    winston.verbose("Setting User Data...");
    await userDoc.set(DEFAULT_USER_DATA);

    winston.verbose("Creating programs...");
    let programCollection = firestore.collection("/programs");

    let promises = [];
    let programIds = [];

    DEFAULT_USER_PROGRAMS.forEach(program => {
      winston.verbose(`Creating program ${program.name}...`);
      let progDoc = programCollection.doc();
      programIds.push(progDoc.id);
      //push one document set promise into the array
      promises.push(progDoc.set(program));
    });

    await Promise.all(promises);

    await userDoc.set({ mostRecentProgram: programIds[0] });

    let promises2 = [];
    programIds.forEach(doc => {
      promises2.push(
        firestore
          .collection("/users")
          .doc(uid)
          .update({
            programs: arrayUnion(doc),
          }),
      );
    });

    await Promise.all(promises2);

    winston.info("Initialized user. Exiting");
    return {
      ok: true,
      initData: Object.assign({}, DEFAULT_USER_DATA, {
        programs: programIds,
        mostRecentProgram: programIds[0],
      }),
    };
  } catch (err) {
    winston.error(`Failed to initialize user data for ${uid}. Received error: ${err}`);
    return { ok: false, error: "Failed in catch: " + err };
  }
};

module.exports = initializeUserData;

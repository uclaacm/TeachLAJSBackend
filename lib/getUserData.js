const firestore = require("../firebase");
const initializeUserData = require("./initializeUserData.js");
const { DEFAULT_USER_DATA } = require("../constants");
/**
 * getUser
 *
 *  @param {json} uid - firebase user id key for database
 *  @returns {json}
 */
const getUserData = async function(uid, { programs }) {
  console.log(`Getting user data for uid: ${uid}...`);
  if (!uid) {
    return { ok: false, error: "No UID provided" };
  }

  try {
    let result = {};

    //read document from firestore and return it
    let userDoc = await firestore
      .collection("/users")
      .doc(uid.toString())
      .get();
    if (userDoc.exists) {
      console.log(`Adding basic user data to result...`);
      result = { ok: true, data: { userData: userDoc.data() } };
    } else {
      console.log(`Document does not yet exist, initializing user...`);
      let initData = await initializeUserData(uid);
      console.log(`Adding user data from new initialized user...`);
      result = { ok: true, data: { userData: DEFAULT_USER_DATA } };
    }

    //if we want to include the programs in the get
    if (programs) {
      let firestorePrograms = {};
      console.log(`Including programs in result...`);
      let programDocs = await firestore
        .collection("/users")
        .doc(uid.toString())
        .collection("programs")
        .get();

      //for each program doc, add it to the programs object of the result
      await programDocs.forEach(async doc => {
        try {
          console.log(`Adding doc ${doc.id} to result...`);
          if (doc.exists) {
            firestorePrograms[doc.id] = await doc.data();
          } else {
            console.log(`For some reason doc ${doc.id} does not exist...`);
          }
        } catch (err) {
          //if there's a failed read, set the result to false and add an error
          console.log(`Failed to add document ${doc.id}, received error: ${err}`);
          result.ok = false;
          result.err = err;
        }
      });
      result.data.programs = firestorePrograms;
    }

    return result;
  } catch (err) {
    console.log(`Fell to catch block, error received: ${err}`);
    return { ok: false, error: "Sorry! Server error, try again later..." };
  }
};

module.exports = getUserData;

/**---------updateUserData--------------
 * merges the provided data with the users' document
 */

/**--------Parameters------------
 * uid: string representing which user we should be updating
 * json: object to merge with user at uid's document
 */

const firestore = require("../firebase");

const updateUserData = async function(uid, json) {
  if (!json) {
    return { ok: false, error: "No json provided" };
  }
  if (!uid) {
    return { ok: false, error: "No uid provided" };
  }

  try {
    //create document with base user data at /users/:uid
    let userDoc = firestore.collection("/users").doc(uid.toString());

    //update document with new info
    await userDoc.update(json);

    return { ok: true };
  } catch (err) {
    console.log(err);
    return { ok: false, error: "Failed in catch: " + err };
  }
};

module.exports = updateUserData;

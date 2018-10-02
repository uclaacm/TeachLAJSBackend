/**---------updatePrograms--------------
 * merges the provided data with the users' document
 */

/**--------Parameters------------
 * uid: string representing which user we should be updating
 * json: object like so
 * {
 *   Python:{code:"fdasfa", language:"python"}
 *   Processing:{language:"javascript"}
 *   HTML: {code:"<div/>"}
 * }
 * each key is a program name with the value as a json
 * each json will be merged with the correspondingly named doc
 * i.e. Python would get tis code and language updated, Processing just the language
 * and HTML just the code
 */

const firestore = require("../firebase");

const updatePrograms = async function(uid, json) {
  if (!json) {
    return { ok: false, error: "No json provided" };
  }
  if (!uid) {
    return { ok: false, error: "No uid provided" };
  }

  try {
    console.log("Updating programs for uid:" + uid);
    //create document with base user data at /users/:uid
    const collection = firestore
      .collection("/users")
      .doc(uid.toString())
      .collection("programs");

    const programs = Object.keys(json);
    if (!programs.length) {
      return { ok: false, error: "json provided has no keys" };
    }
    let promises = [];

    programs.forEach(async program => {
      //make an asynchronous function that returns either a promise that resolves when the doc is updated,
      //or logs something and returns nothing
      const funcToCall = async val => {
        let doc = {};
        try {
          doc = await firestore
            .collection("/users")
            .doc(uid.toString())
            .collection("programs")
            .doc(val)
            .get();
        } catch (err) {
          console.log(
            `"${val}" program for ${uid} not found, failed to get doc...`
          );
          console.log(err);
        }
        if (doc.exists) {
          console.log(`Updating "${val}" program...`);
          return collection.doc(val).update(json[val]);
        } else {
          console.log(
            `"${val}" program for ${uid} not found, ignoring update...`
          );
        }
      };
      promises.push(funcToCall(program));
    });

    console.log("Awaiting updates...");
    await Promise.all(promises);

    //if we reach this point, none of the awaits failed, and the update is finished
    console.log("Succesfully saved all programs");

    return { ok: true };
  } catch (err) {
    console.log("Failed to update programs");
    console.log(err);
    return { ok: false, error: "Failed in catch: " + err };
  }
};

module.exports = updatePrograms;

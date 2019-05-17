const winston = require("winston");
const firestore = require("../firebase");

/**---------updateUserData--------------
 * merges the provided data with the users' document
 */

/**--------Parameters------------
 * uid: string representing which user we should be updating
 * json: object to merge with user at uid's document
 */

const updateUserData = async function(uid, json) {
  winston.info(`Starting async user data update`);
  winston.info(`UID: ${uid} JSON: ${JSON.stringify(json || {})}...`);

  if (!json) {
    winston.error(`No JSON provided. Exiting`);
    return { ok: false, error: "No json provided" };
  }

  if (!uid) {
    winston.error(`No UID provided. Exiting`);
    return { ok: false, error: "No uid provided" };
  }

  try {
    //create document with base user data at /users/:uid
    let userDoc = firestore.collection("/users").doc(uid.toString());

    winston.verbose("Updating user doc...");
    await userDoc.update(json);

    winston.info("Updated user data. Exiting");
    return { ok: true };
  } catch (err) {
    winston.error(`Failed to update user data for ${uid}. Received error: ${err}`);
    return { ok: false, error: `Failed to update user data. Received error: ${err}` };
  }
};

module.exports = updateUserData;

const firebaseAuth = require("../firebase");
/**
 * createUser
 *
 * @param {json} userInfo - represents the newly created user
 * @returns {json}
 *  @key {boolean} ok - true if no errors, false otherwise
 *  @key {json or string} data - json with keys code and message if an error occured, sign-in token string otherwise
 */
const createUser = async function(userInfo) {
  // userInfo = {uid:"123", password:"123456", displayName:"Bob"}
  //check if any userInfo was passed
  if (!userInfo) {
    console.log("No user info provided...");
    return {
      ok: false,
      data: { code: "missing", message: "No user info provided..." },
    };
  }

  const { uid, password, displayName } = userInfo;

  if (!uid || !password || !displayName) {
    console.log("Missing required information in userInfo...");
    console.log(`Uid: ${uid} Password: ${password} displayName: ${displayName}`);
    return {
      ok: false,
      data: {
        code: "missing",
        message: "Missing required information in userInfo...",
      },
    };
  }

  try {
    let result = await firebaseAuth.createUser(userInfo);

    //result is a json with a code and a message key if an error occured while creating the user
    if (result.code) {
      console.log(`Failed to login user, code: ${result.code} message : ${result.message}`);
      return { ok: false, data: result.message };
    }

    let token = await firebaseAuth.createCustomToken(result.uid);

    return { ok: true, data: token };
  } catch (err) {
    console.log(`Failed to create user`);
    console.log(err);
    return {
      ok: false,
      data: {
        code: "catch-fail",
        message: err.message ? err.message : "Failed to create user",
      },
    };
  }

  return {
    ok: false,
    data: { code: "catch-fail", message: "Got past try-catch" },
  };
};

module.exports = createUser;

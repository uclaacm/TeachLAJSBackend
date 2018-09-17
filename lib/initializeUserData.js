const constants = require('../constants')
/**
 * initializeUserData
 * 
 * @param {json} userInfo - represents the newly created user
 * @returns {json}
 *  @key {boolean} ok - true if no errors, false otherwise
 *  @key {json or string} data - json of user data initialized in database
 */

const firestore = require('../firebase')
 
const initializeUserData = async function(uid){
  if(!uid){
    return { ok:false, error:"No UID provided" }
  }

  try{
    //create document with base user data at /users/:uid
    let userDoc = firestore.collection("/users").doc(uid.toString())
    
    await userDoc.set(constants.DEFAULT_USER_DATA)

    //languages broken into code, editDate, 
    let programCollection = userDoc.collection("programs")

    let promises = []
    let initialPrograms = {}

    constants.LANGUAGES_ARR.forEach((lang) => {
      promises.push(programCollection.doc(lang).set({
          code: constants.DEFAULT_PROGRAM_BY_LANGUAGE[lang],
        })
      )

      initialPrograms[lang] = {
        code:constants.DEFAULT_PROGRAM_BY_LANGUAGE[lang]
      }
    })

    let result = await Promise.all(promises)

    //if we reach this point, none of the awaits failed, and we now have the user set up in firestore


    return {ok:true, data:{
      ...constants.DEFAULT_USER_DATA,
      programs: initialPrograms,
    }}
  } catch(err){
    console.log(err)
    return {ok:false, error:"Failed in catch: " + err }
  }
}

module.exports = initializeUserData
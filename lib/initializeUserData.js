const {SUPPORTED_LANGUAGES, DEFAULT_USER_DATA, createDefaultProgramDoc, languageToDisplayName } = require('../constants')
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
  console.log("initializing data")
  
  if(!uid){
    return { ok:false, error:"No UID provided" }
  }

  try{
    //create document with base user data at /users/:uid
    let userDoc = firestore.collection("/users").doc(uid.toString())
    
    await userDoc.set(DEFAULT_USER_DATA)

    //languages broken into code, editDate, 
    let programCollection = userDoc.collection("programs")

    let promises = []
    let initialPrograms = {}


    SUPPORTED_LANGUAGES.forEach(lang => {
      //push one document set promise into the array
      promises.push(
        programCollection
          //create the document with the correct name
          .doc(languageToDisplayName(lang))
          //set it to the default object
          .set(createDefaultProgramDoc(lang))
      )
    })

    await Promise.all(promises)

    //if we reach this point, none of the awaits failed, and we now have the user set up in firestore
    return {
      ok:true,
    }
  } catch(err){
    console.log(err)
    return {ok:false, error:"Failed in catch: " + err }
  }
}

module.exports = initializeUserData
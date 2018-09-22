/**
 * updateUserData
 * 
 * @param {string} uid - uid of user to be updated with json
 * @param {json} json - represents the information to be merged with the user at uid
            {string} displayName        - name displayed in users profile
            {string} photoURL           - source url for the photo used in the profile
            {string} mostRecentLanguage - name of language last used by this user
            {json}   programs           - json of jsons where each key is the name of the language document 
 * @returns {json}
 *  @key {boolean} ok - true if no errors, false otherwise
 *  @key {json or string} data - json of user data updated in database
 */

const firestore = require('../firebase')
 
const updateUserData = async function(uid, json){
  if(!json){
    return { ok:false, error:"No json provided" }
  }
  if(!uid){
    return { ok:false, error:"No uid provided" }
  }

  try{
    //create document with base user data at /users/:uid
    let userDoc = firestore.collection("/users").doc(uid.toString())
    
    //save the programs key in the json object and delete it from the original
    //if it doesn't exist, this could should still not break
    let programs = json.programs
    delete json.programs

    //update document with new info
    await userDoc.set(json)

    let promises = []

    //update programs if they were included with the json
    if(programs){
      //for each language, update the corresponding doc
      Object.keys(programs).forEach(lang => {
        promises.push(userDoc.collection('programs').doc(lang).set(programs[lang]))
      })
    }

    let result = await Promise.all(promises)

    //if we reach this point, none of the awaits failed, and the update is finished

    return {ok:true}
  } catch(err){
    console.log(err)
    return {ok:false, error:"Failed in catch: " + err }
  }
}

module.exports = updateUserData
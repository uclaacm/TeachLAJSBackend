const firebaseAuth = require('../firebase')
/**
 * getUser
 * 
 *  @param {json} uid - firebase user id key for database
 *  @returns {json}
 */
const getUser = async function(uid, {includePrograms}){

  if(!uid){
    return {ok: false, error:"No UID provided"}
  }

  try{
    let result = {}

    //read document from firestore and return it
    let userDoc = await firestore.collection("/users").doc(uid.toString()).get()

    if(userDoc.exists && userDoc.data){
      result = {ok: true, data: userDoc.data}
    }

    //if we want to include the programs in the get
    if(includePrograms){
      let programDocs = firestore.collection("/users").doc(uid.toString()).collection("programs").docs()

      //for each program doc, add it to the programs object of the result
      await programDocs.forEach(async doc => {
        try{
          result.programs[doc.id] = await doc.get()
        } catch(err){
          //if there's a failed read, set the result to false and add an error
          result.ok = false
          result.err = err
        }
      })
    }

    return result
  } catch(err){
    return {ok: false, error:"Got past try-catch"}
  }
  
}

module.exports = getUser
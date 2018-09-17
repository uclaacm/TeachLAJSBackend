const express = require('express');
const bodyParser = require('body-parser')
const cors = require('cors')
const multer = require('multer'); // v1.0.5
const lib = require ('./lib')

const upload = multer(); // for parsing multipart/form-data

const app = express();
app.use(cors());
app.use(bodyParser.json())


app.get("/initializeUserData/:uid", upload.array(), async function (req, res) {
  console.log(`==========================/initializeUserData/${req.params.uid} start====================================`)
  console.time("inituserdata")
  if(!req.params.uid){
    return res.status(200).send({ ok: false, error: "No UID provided" });
  }
  let result = await lib.initializeUserData(req.params.uid)

  console.timeEnd("inituserdata")
  console.log(`==========================/initializeUserData/${req.params.uid} end====================================`)
    return res.status(200).send({
      ...result
    })
})

app.get("/getUser", upload.array(), async function (req, res) {
  console.log("==================================Get start====================================")
  console.time("getUser")
  if(!req.body){
    console.log("no body")
    return res.status(200).send({ ok: false, data: "No body found" });
  }
  let result = await lib.getUser()

  console.timeEnd("getUser")
  console.log("==================================Get end======================================\n")
    return res.status(200).send(result)

})

app.post("/updateUserData/:uid", upload.array(), async function (req, res) {
  console.log(`==========================/updateUserData/${req.params.uid} start====================================`)
  console.time("inituserdata")
  if(!req.params.uid){
    return res.status(200).send({ ok: false, error: "No UID provided" });
  }
  let result = await lib.updateUserData(req.params.uid)

  console.timeEnd("inituserdata")
  console.log(`==========================/updateUserData/${req.params.uid} end====================================`)
  return res.status(200).send({
    ...result
  })
})

app.get("/user/:uid", upload.array(), async function (req, res) {
  console.log(`==================================/users/${req.params.uid} start====================================`)
  console.time("usersget")
  if(!req.params.uid){
    return res.status(200).send({ ok: false, data: "No UID provided" });
  }
  let result = await lib.getUserData(req.params.uid, req.query)

  console.timeEnd("usersget")
  console.log(`==================================/users/${req.params.uid} end====================================\n`)
  
  return res.status(200).send(result)
})

  
// Start the server
const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});



const express = require('express');
const bodyParser = require('body-parser')
const cors = require('cors')
const multer = require('multer'); // v1.0.5
const lib = require ('./lib')

const upload = multer(); // for parsing multipart/form-data

const app = express();
app.use(cors());
app.use(bodyParser.json());


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

app.get("/getUserData/:uid", async function (req, res) {
  console.log(`==================================${req.path} start====================================`)
  console.time("getUser")
  console.log(req.query)
  let result = await lib.getUserData(req.params.uid, req.query)

  console.timeEnd("getUser")
  console.log("==================================Get end======================================\n")
    return res.status(200).send(result)

  console.timeEnd("createUser");
  console.log(
    "==================================Create end======================================\n",
  );
  return res.status(200).send(result);
});

app.post("/updateUserData/:uid", upload.array(), async function (req, res) {
  console.log(`==========================/updateUserData/${req.params.uid} start====================================`)
  console.time("updateuserdata")
  if(!req.params.uid){
    return res.status(200).send({ ok: false, error: "No UID provided" });
  }
  let result = await lib.updateUserData(req.params.uid)

  console.timeEnd("updateuserdata")
  console.log(`==========================/updateUserData/${req.params.uid} end====================================`)
  return res.status(200).send({
    ...result
  })
})

app.put("/updatePrograms/:uid", upload.array(), async function (req, res) {
  console.log(`==========================/updatePrograms/${req.params.uid} start====================================`)
  console.time("updateprograms")
  if(!req.body){
    return res.status(200).send({ ok: false, error: "No body provided" });
  }

  let result = await lib.updatePrograms(req.params.uid, req.body)

  console.timeEnd("updateprograms")
  console.log(`==========================/updatePrograms/${req.params.uid} end====================================`)
  return res.status(200).send({
    ...result
  })
})
  
// Start the server
const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log("Press Ctrl+C to quit.");
});

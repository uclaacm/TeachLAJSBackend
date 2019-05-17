const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const multer = require("multer"); // v1.0.5
const lib = require("./lib");
const winston = require("./config/winston.js");
const morganConfig = require("./config/morgan");
const upload = multer(); // for parsing multipart/form-data

const app = express();
app.use(cors());
app.use(bodyParser.json());
morganConfig(app);

app.get("/initializeUserData/:uid", upload.array(), async function(req, res) {
  let result = await lib.initializeUserData(req.params.uid);

  return res.status(200).send({
    ...result,
  });
});

app.get("/getUserData/:uid", async function(req, res) {
  let result = await lib.getUserData(req.params.uid, req.query);

  return res.status(200).send(result);
});

app.post("/updateUserData/:uid", upload.array(), async function(req, res) {
  let result = await lib.updateUserData(req.params.uid, req.body);

  return res.status(200).send({
    ...result,
  });
});

app.put("/updatePrograms/:uid", upload.array(), async function(req, res) {
  let result = await lib.updatePrograms(req.params.uid, req.body);

  return res.status(200).send({
    ...result,
  });
});

app.post("/createProgram", upload.array(), async function(req, res) {
  let result = await lib.createProgram(req.body || {});

  return res.status(200).send({
    ...result,
  });
});

app.post("/deleteProgram", upload.array(), async function(req, res) {
  let result = await lib.deleteProgram(req.body || {});

  return res.status(200).send({
    ...result,
  });
});

app.get("/getProgram/:sketchid", async function(req, res) {
  let result = await lib.getProgram(req.params.sketchid);

  return res.status(200).send({
    ...result,
  })
});

// Start the server
const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
  winston.info(`App listening on port ${PORT}`);
  winston.info("Press Ctrl+C to quit.");
});

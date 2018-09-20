const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const multer = require("multer"); // v1.0.5
const { createUser } = require("./lib");

const upload = multer(); // for parsing multipart/form-data

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post("/createUser", upload.array(), async function(req, res) {
  console.log("==================================Create start====================================");
  console.time("createUser");
  if (!req.body) {
    console.log("no body");
    return res.status(200).send({ ok: false, data: "No body found" });
  }
  let result = await createUser(req.body);

  console.timeEnd("createUser");
  console.log(
    "==================================Create end======================================\n",
  );
  return res.status(200).send(result);
});

// Start the server
const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log("Press Ctrl+C to quit.");
});

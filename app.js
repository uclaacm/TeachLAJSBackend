const express = require('express');
const bodyParser = require('body-parser')
const cors = require('cors')
const multer = require('multer'); // v1.0.5

const upload = multer(); // for parsing multipart/form-data

const app = express();
app.use(cors());
app.use(bodyParser.json())


app.post("/init", upload.array(), async function (req, res) {
  console.log("==================================Init start====================================")
  console.log("Init received")
  if(!req.body){
    console.log("no body")
    return res.status(200).send({ ok: false, error: "No body found" });
  }
//   let { error, output } = await init(DIR, req.body.name);
  let {error, output} = {error:false, output: "TEST"}

  console.log("==================================Init end======================================\n")
  if (!error) {
    return res.status(200).send({ok: true, name: req.body.name})
  } else {
    return res.status(200).send({ ok: false, error: output });
  }

})

  
// Start the server
const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});



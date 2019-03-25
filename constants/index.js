const winston = require("winston");

const PYTHON = "python";
const JAVASCRIPT = "javascript";
const JAVA = "java";
const CPP = "c++";
const PROCESSING = "processing";
const HTML = "html";

//converts default languages to the default name of their program (the id of the document)
const languageToDisplayName = lang => {
  switch (lang) {
    case PYTHON:
      return "Python";
    case JAVA:
      return "Java";
    case JAVASCRIPT:
      return "Javascript";
    case CPP:
      return "C++";
    case PROCESSING:
      return "Processing";
    case HTML:
      return "HTML";
    default:
      winston.error(
        "languageToDisplayName exception: program language received that's not accounted for: " +
          lang,
      );
      return "ERROR";
  }
};

//list of supported languages
const SUPPORTED_LANGUAGES = [PYTHON, PROCESSING, HTML];

//default values for user data
const DEFAULT_PROGRAM = languageToDisplayName(SUPPORTED_LANGUAGES[0]);

const DEFAULT_DISPLAY_NAME = "Joe Bruin";

//default structure of user data (the data underneath the user document in firestore)
const DEFAULT_USER_DATA = {
  displayName: DEFAULT_DISPLAY_NAME,
  mostRecentProgram: DEFAULT_PROGRAM,
  photoName: "",
};

//converts default languages to the default code provided with them
const languageToDefaultCode = lang => {
  switch (lang) {
    case PYTHON:
      return "import turtle\n\nt = turtle.Turtle()\n\nt.color('red')\nt.forward(75)\nt.left(90)\n\n\nt.color('blue')\nt.forward(75)\nt.left(90)\n";
    case JAVA:
      return 'System.out.println("Hello World!")';
    case CPP:
      return 'std::cout << "Hello World!" << std::endl';
    case JAVASCRIPT:
      return 'console.log("Hello World!")';
    case PROCESSING:
      return "function setup() {\n  createCanvas(400, 400);\n}\n\nfunction draw() {\n  background(220);\n  ellipse(mouseX, mouseY, 100, 100);\n}";
    case HTML:
      return "<html>\n  <head>\n  </head>\n  <body>\n    <div style='width: 100px; height: 100px; background-color: black'>\n    </div>\n  </body>\n</html>";
    default:
      winston.error(
        "languageToDefaultCode exception: program language received that's not accounted for: " +
          lang,
      );
      return "";
  }
};

const createDefaultProgramDoc = lang => {
  const programName = languageToDisplayName(lang);
  const programCode = languageToDefaultCode(lang);

  return {
    code: programCode,
    language: lang,
  };
};

//default program structure for each supported language
let DEFAULT_USER_PROGRAMS = {};

//for each supported language, add it to the default user program object
//each key in DEFAULT_USER_PROGRAMS is the name of the program,
//each program is an object like so:
/*
  {
    code: "some sort of string representing the code for the program",
    language: "the programming language the code is in"
  }
*/
SUPPORTED_LANGUAGES.forEach(lang => {
  const programName = languageToDisplayName(lang);

  DEFAULT_USER_PROGRAMS[programName] = createDefaultProgramDoc(lang);
});

module.exports = {
  //language constants
  PYTHON,
  JAVASCRIPT,
  JAVA,
  CPP,
  PROCESSING,
  HTML,
  //defaults
  DEFAULT_USER_DATA,
  DEFAULT_USER_PROGRAMS,
  DEFAULT_PROGRAM,
  //configs
  SUPPORTED_LANGUAGES,
  //helpers
  //TODO: move these to a helper.js file
  languageToDisplayName,
  createDefaultProgramDoc,
};

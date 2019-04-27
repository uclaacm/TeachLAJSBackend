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
  //DAY OF CODE HACK
  // mostRecentProgram: DEFAULT_PROGRAM,
  mostRecentProgram: "Day Of Code",
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

const dayOfCodePrograms = {
  "Day Of Code": {
    language: PYTHON,
    code: `print("How old are you (or how old will you be turning this year)?")\nage=20\t#change to your age\nbirth_date = 2019 - int(age)\nyear = int(birth_date) + 100\n`,
    thumbnail: 0,
  },
  "Ex 3": {
    language: PYTHON,
    code: `import turtle\nt = turtle.Turtle()\n\nt.color('blue')\nt.forward(100)\nt.left(90)\nt.forward(100)\nt.left(90)\nt.forward(100)\nt.left(90)\nt.forward(100)\nt.left(90)`,
    thumbnail: 1,
  },
  "Ex 5": {
    language: PYTHON,
    code: `import turtle\nt = turtle.Turtle()\n\nt.forward(100)\nt.left(45)\nt.forward(100)`,
    thumbnail: 2,
  },
  "Ex 6": {
    language: PYTHON,
    code: `import turtle\nt = turtle.Turtle()\nt.color('green')\nt.shape('turtle')\n\nt.forward(100)\nt.left(45)\nt.forward(100)`,
    thumbnail: 3,
  },
  "Challenge 1": {
    language: PYTHON,
    code: `import turtle\nt = turtle.Turtle()\n\nt.color('teal')\nt.shape('turtle')\nt.speed(30)\n\nfor i in range(50):\n\tt.forward((100))\n\tt.left(130)`,
    thumbnail: 4,
  },
  "Challenge 2": {
    language: PYTHON,
    code: `import turtle\nt = turtle.Turtle()\n\nfor i in range(50):\n\tt.forward(i*10)\n\tt.left(130)`,
    thumbnail: 5,
  },
  "Challenge 3": {
    language: PYTHON,
    code: `import turtle\nt = turtle.Turtle()\n\nt.color('teal')\nt.shape('turtle')\nt.speed(30)\n\nfor i in range(5):\n\tnfor j in range(30):\n\t\tt.forward((i*j)^2)\n\t\tt.left(60)`,
    thumbnail: 6,
  },
};

const createDefaultProgramDoc = (lang, index) => {
  const programCode = languageToDefaultCode(lang);

  return {
    code: programCode,
    language: lang,
    thumbnail: index || 0,
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
SUPPORTED_LANGUAGES.forEach((lang, index) => {
  const programName = languageToDisplayName(lang);

  DEFAULT_USER_PROGRAMS[programName] = createDefaultProgramDoc(lang, index);
});

const NUM_PROGRAM_THUMBNAIL_OPTIONS = 58;

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
  languageToDefaultCode,

  //fronted-dependencies
  NUM_PROGRAM_THUMBNAIL_OPTIONS,

  //DAY OF CODE HACK
  dayOfCodePrograms,
};

const PYTHON = "python";
const JAVASCRIPT = "javascript";
const JAVA = "java";
const CPP = "c++";
const PROCESSING = "processing";
const HTML = "html";

// const LANGUAGES = [PYTHON, JAVASCRIPT, JAVA, CPP, PROCESSING, HTML];
const LANGUAGES = [PYTHON, PROCESSING, HTML];

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

module.exports = {
  //language
  LANGUAGES,

  //helper functions
  languageToDisplayName,
  languageToDefaultCode,
};

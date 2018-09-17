

const PYTHON = "python"

const JAVASCRIPT = "javascript"

const JAVA = "java"

const CPP = "c++"

const PROCESSING = "processing"

const HTML = "html"

const DEFAULT_USER_DATA = {
  displayName:"",
  photoURL:"",
  mostRecentLanguage:PYTHON,
}

const LANGUAGES_ARR = [PYTHON, PROCESSING, JAVASCRIPT, CPP, HTML, JAVA]

let DEFAULT_PROGRAM_BY_LANGUAGE = {}
LANGUAGES_ARR.forEach(lang => {
  switch(lang){
    case PYTHON:
      DEFAULT_PROGRAM_BY_LANGUAGE[lang] = "import turtle\n\nt = turtle.Turtle()\n\nt.color('red')\nt.forward(75)\nt.left(90)\n\n\nt.color('blue')\nt.forward(75)\nt.left(90)\n"
      break
    case PROCESSING:
      DEFAULT_PROGRAM_BY_LANGUAGE[lang] =  "function setup() {\n  createCanvas(400, 400);\n}\n\nfunction draw() {\n  background(220);\n  ellipse(mouseX, mouseY, 100, 100);\n}"
      break
    case JAVASCRIPT:
      DEFAULT_PROGRAM_BY_LANGUAGE[lang] = 'console.log("Hello World!")'
      break
    case CPP:
      DEFAULT_PROGRAM_BY_LANGUAGE[lang] = 'std::cout << "Hello World!" << std::endl'
      break
    case HTML:
      DEFAULT_PROGRAM_BY_LANGUAGE[lang] = "<html>\n  <head>\n  </head>\n  <body>\n    <div style='width: 100px; height: 100px; background-color: black'>\n    </div>\n  </body>\n</html>"
      break
    case JAVA:
      DEFAULT_PROGRAM_BY_LANGUAGE[lang] = 'System.out.println("Hello World!")'
      break
    default:
      DEFAULT_PROGRAM_BY_LANGUAGE[lang] = ''
  }
})


module.exports = {
  PYTHON,
  JAVASCRIPT,
  JAVA,
  CPP,
  PROCESSING,
  HTML,
  DEFAULT_USER_DATA,
  LANGUAGES_ARR: [PYTHON, PROCESSING, JAVASCRIPT, CPP, HTML, JAVA],
  DEFAULT_PROGRAM_BY_LANGUAGE,
}
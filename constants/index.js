const { LANGUAGES, languageToDefaultCode, languageToDisplayName } = require("./helpers.js");

const NUM_PROGRAM_THUMBNAIL_OPTIONS = 58;

//default structure of user data (the data underneath the user document in firestore)
const DEFAULT_USER_DATA = {
  displayName: "Joe Bruin",
  mostRecentProgram: "Python",
  photoName: "",
  programs: [],
  classes: [],
};

let DEFAULT_USER_PROGRAMS = [];
LANGUAGES.forEach((lang, index) => {
  DEFAULT_USER_PROGRAMS.push({
    code: languageToDefaultCode(lang),
    language: lang,
    thumbnail: Math.max(index, NUM_PROGRAM_THUMBNAIL_OPTIONS),
    name: languageToDisplayName(lang),
    dateCreated: new Date(Date.now()).toUTCString(),
  });
});

module.exports = {
  //defaults
  DEFAULT_USER_DATA,
  DEFAULT_USER_PROGRAMS,

  //frontend-dependencies
  NUM_PROGRAM_THUMBNAIL_OPTIONS,
};

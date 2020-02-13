const { LANGUAGES, languageToDefaultCode, languageToDisplayName } = require("./helpers.js");

const NUM_PROGRAM_THUMBNAIL_OPTIONS = 58;

//default structure of user data (the data underneath the user document in firestore)
const DEFAULT_USER_DATA = {
  displayName: "J Bruin",
  // mostRecentProgram: some id,
  photoName: "",
  programs: [],
  classes: [],
};

const RANDOM_WORDS = {
  adjectives: ["Big", "Chunky", "Tiny", "Screaming", "Green", "Loud", "Extreme", "Funny", "Cool", "Interesting", "Silly"],
  nouns: ["Monkey", "Bison", "Hotdog"],
};

let DEFAULT_USER_PROGRAMS = [];
LANGUAGES.forEach((lang, index) => {
  DEFAULT_USER_PROGRAMS.push({
    code: languageToDefaultCode(lang),
    language: lang,
    thumbnail: Math.min(index, NUM_PROGRAM_THUMBNAIL_OPTIONS),
    name: languageToDisplayName(lang),
    dateCreated: new Date(Date.now()).toUTCString(),
  });
});

module.exports = {
  //defaults
  DEFAULT_USER_DATA,
  DEFAULT_USER_PROGRAMS,
  RANDOM_WORDS,

  //frontend-dependencies
  NUM_PROGRAM_THUMBNAIL_OPTIONS,
};

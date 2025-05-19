const mduParser = require("./mduParser");
const tapParser = require("./tapParser");
const napParser = require("./napParser");

function getParser(projectName) {
  switch (projectName.toLowerCase()) {
    case "mdu":
      return mduParser;
    case "tap":
      return tapParser;
    case "nap":
      return napParser;
    default:
      return null;
  }
}

module.exports = { getParser };

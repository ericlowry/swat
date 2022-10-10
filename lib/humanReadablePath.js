//
// humanReadablePath(filePath)
//
// Construct the shortest human readable path to a file
//
const path = require('path');

module.exports = filePath =>
  './' +
  path.relative(
    path.normalize(`${__dirname}/..`), // the root of the project
    filePath
  );

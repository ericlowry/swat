//
// findFiles(dir, baseNameMatch, callback)
// findFiles(dir, callback) // match all regular files
//
// executes callback() on any matching files it finds
//
// -> callback(filePath, baseName, relativePath)
//
const walkDir = require('./walkDir.js');

function findFiles(dir, matchOrCallback = /.*/, callback) {
  const baseNameMatch =
    typeof matchOrCallback === 'function' ? /.*/ : matchOrCallback;
  callback = typeof matchOrCallback === 'function' ? matchOrCallback : callback;
  walkDir(dir, (filePath, baseName, relative) => {
    if (baseName.match(baseNameMatch)) {
      callback(filePath, baseName, relative);
    }
  });
}

module.exports = findFiles;

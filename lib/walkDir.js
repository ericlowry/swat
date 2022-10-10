//
// walkDir(dir, callback)
//
//  Traverses a directory structure,
//  executing callback on each file it finds.
//
//  callback(filePath, baseName, relativePath) where
//    filePath is the full OS path     i.e. '/home/users/eric/.../junk.txt'
//    baseName is the base fileName    i.e. 'junk.txt'
//    relativePath is from dir to file i.e. './dir/.../junk.txt'
//

const fs = require('fs');
const path = require('path');

function walkDir(dir, callback, depth = 10) {
  dir = path.normalize(dir);
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory) {
      if (depth) walkDir(dirPath, callback, depth - 1);
    } else {
      const filePath = path.join(dir, f);
      const baseName = path.basename(filePath);
      const relative = './' + path.relative(dir, filePath);
      callback(filePath, baseName, relative);
    }
  });
}

module.exports = walkDir;

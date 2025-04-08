const fs = require("fs");
const path = require("path");
module.exports = function (dirname, extension, callback) {
  fs.readdir(dirname, (err, data) => {
    if (err) {
      callback(err);
    } else {
      const list = data.filter(
        (item) => path.extname(item).slice(1) === extension
      );
      callback(null, list);
    }
  });
};

var jsdoc = require('jsdoc3-parser');

module.exports = {
  parse: function(value, cb) {
    jsdoc(value, function(error, data) {
      cb(null, data)
    });
  },
  process: function(tree) {
    return tree;
  }
}
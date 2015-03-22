var jsdoc = require('jsdoc3-parser');

module.exports = {
  parse: function(value, cbk) {
    jsdoc(value, function(error, data) {
      cbk(null, data)
    });
  },
  process: function(tree) {
    return tree;
  }
}
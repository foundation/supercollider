var sassdoc = require('sassdoc');

module.exports = {
  parse: function(value, cb) {
    sassdoc.parse(value, {verbose: true}).then(function(data) {
      cb(null, data);
    });
  },
  process: function(tree) {
    var sass = {};

    for (var i in tree) {
      var obj = tree[i];
      var group = obj.context.type

      if (!sass[group]) sass[group] = [];
      sass[group].push(obj);
    }

    return sass;
  }
}
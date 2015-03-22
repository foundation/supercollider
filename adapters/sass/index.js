var sassdoc = require('sassdoc');

module.exports = {
  parse: function(value, cbk) {
    sassdoc.parse(value, {verbose: true}).then(function(data) {
      cbk(null, data);
    });
  },
  process: function(tree) {
    var sass = {
      variable: [],
      mixin: [],
      'function': []
    }

    for (var i in tree) {
      var obj = tree[i];
      sass[obj.context.type].push(obj);
    }

    return sass;
  }
}
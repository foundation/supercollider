var jsdoc = require('jsdoc3-parser');

module.exports = {
  parse: function(value, cb) {
    jsdoc(value, function(error, data) {
      cb(null, data)
    });
  },
  process: function(tree) {
    var js = {};

    for (var i in tree) {
      var obj = tree[i];
      var group = obj.kind;

      if (obj.undocumented === true || obj.access === 'private') continue;
      if (group === 'member' && obj.memberof.indexOf('defaults') < 0) continue;

      if (!js[group]) js[group] = [];
      js[group].push(obj)
    }

    return js;
  }
}
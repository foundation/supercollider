var jsdoc = require('jsdoc3-parser');

module.exports = {
  parse: function(value, cb) {
    jsdoc(value, function(error, data) {
      cb(null, data)
    });
  },
  process: function(tree) {
    var newTree = {
      'class': [],
      'function': [],
      'member': [],
      'event': []
    }

    for (var i in tree) {
      var item = tree[i];

      if (item.undocumented === true || item.access === 'private') continue;

      var group = item.kind;
      if (newTree[group]) {
        if (group === 'member' && item.memberof.indexOf('defaults') < 0) continue;
        newTree[group].push(item)
      }
    }

    return newTree;
  }
}
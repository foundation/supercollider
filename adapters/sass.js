var sassdoc = require('sassdoc');

module.exports = function(value, cb) {
  sassdoc.parse(value, {verbose: true}).then(function(data) {
    cb(null, processTree(data));
  });
}

function processTree(tree) {
  var sass = {};

  for (var i in tree) {
    var obj = tree[i];
    var group = obj.context.type

    if (!sass[group]) sass[group] = [];
    sass[group].push(obj);
  }

  return sass;
}

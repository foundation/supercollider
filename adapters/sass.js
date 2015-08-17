var sassdoc = require('sassdoc');

module.exports = function(value, config, cb) {
  sassdoc.parse(value, config).then(function(data) {
    cb(null, processTree(data));
  });
}

module.exports.config = {
  verbose: false
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

var escapeHTML = require('escape-html');
var jsdoc = require('jsdoc-api');

module.exports = function(value, config, cb) {
  jsdoc.explain({ files: value }).then(function(data) {
    cb(null, processTree(data));
  });
}

module.exports.search = function(items, link) {
  var results = [];
  var tree = [].concat(items.class || [], items.function || [], items.event || [], items.member || []);

  for (var i in tree) {
    var item = tree[i];
    var name = item.name;
    var type = item.kind;
    var description = escapeHTML(item.description.replace('\n', ''));
    var hash = '#js-' + type.replace('plugin ', '') + 's';

    if (type === 'class') {
      name = name + '()';
      hash = hash.slice(0, -1)
    }

    if (type === 'member') {
      type = 'plugin option'
    }

    if (type === 'function') {
      name = item.meta.code.name.replace('prototype.', '');
      hash = '#' + name.split('.')[1];
      name += '()';
    }

    results.push({
      type: 'js ' + type,
      name: name,
      description: description,
      link: link + hash
    });
  }

  return results;
}

function processTree(tree) {
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

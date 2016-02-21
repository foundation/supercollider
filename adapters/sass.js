var escapeHTML = require('escape-html');
var sassdoc = require('sassdoc');

module.exports = function(value, config, cb) {
  sassdoc.parse(value, config).then(function(data) {
    cb(null, processTree(data));
  });
}

module.exports.config = {
  verbose: false
}

module.exports.search = function(items, link) {
  var results = [];
  var tree = [].concat(items.variable || [], items.mixin || [], items.function || []);

  for (var i in tree) {
    var item = tree[i];
    var name = item.context.name;
    var type = item.context.type;
    var description = escapeHTML(item.description.replace(/(\n|`)/, ''));
    var hash = '#';

    if (type === 'variable') {
      name = '$' + name;
      hash += 'sass-variables';
    }

    if (type === 'mixin' || type === 'function') {
      hash += escape(name);
      name = name + '()';
    }

    results.push({
      name: name,
      type: 'sass ' + type,
      description: description,
      link: link + hash
    });
  }

  return results;
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

function escape(text) {
  if (typeof text === 'undefined') return '';
  return text.toLowerCase().replace(/[^\w]+/g, '-');
}

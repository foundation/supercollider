var path    = require('path');

var Super = function(options) {
  this.options = options;
  this.adapters = {};
}

Super.prototype = {
  parse: require('./lib/parse'),
  process: require('./lib/process'),
  build: require('./lib/build'),
  adapter: require('./lib/adapter')
}

var s = new Super();
s.adapter('sass', require(path.join(__dirname, 'adapters', 'sass')));
s.adapter('js', require(path.join(__dirname, 'adapters', 'js')));
s.tree = [];

module.exports = {
  init: require('./lib/init')(s),
  adapter: function() {
    s.adapter.apply(s, arguments);
  },
  tree: s.tree,
  Super: Super
}

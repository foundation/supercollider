var path    = require('path');

var Super = function(options) {
  this.options = options;
  this.adapters = {};
  this.tree = [];
}

Super.prototype = {
  parse: require('./lib/parse'),
  build: require('./lib/build'),
  adapter: require('./lib/adapter')
}

var s = new Super();
s.adapter('sass', require(path.join(__dirname, 'adapters', 'sass')));
s.adapter('js', require(path.join(__dirname, 'adapters', 'js')));

module.exports = {
  init: require('./lib/init')(s),
  adapter: function() {
    s.adapter.apply(s, arguments);
  },
  tree: s.tree,
  Super: Super
}

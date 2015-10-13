function Supercollider() {
  this.options = {};
  this.adapters = {};
  this.tree = [];
  this.template = null;
}

Supercollider.prototype.init = require('./lib/init');
Supercollider.prototype.parse = require('./lib/parse');
Supercollider.prototype.build = require('./lib/build');
Supercollider.prototype.adapter = require('./lib/adapter');
Supercollider.prototype.config = require('./lib/config');

module.exports = new Supercollider();

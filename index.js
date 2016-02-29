function Supercollider() {
  this.options = {};
  this.searchOptions = {
    extra: [],
    sort: [],
    pageTypes: {}
  };
  this.adapters = {};
  this.tree = [];
  this.template = null;
}

Supercollider.prototype.init = require('./lib/init');
Supercollider.prototype.parse = require('./lib/parse');
Supercollider.prototype.build = require('./lib/build');
Supercollider.prototype.adapter = require('./lib/adapter');
Supercollider.prototype.config = require('./lib/config');
Supercollider.prototype.buildSearch = require('./lib/buildSearch');
Supercollider.prototype.searchConfig = require('./lib/searchConfig');

module.exports = new Supercollider();
module.exports.Supercollider = Supercollider;

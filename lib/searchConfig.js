var extend = require('util')._extend;
var fs = require('fs');
var path = require('path');
var yml = require('js-yaml');

module.exports = function(opts) {
  // Allow extra data to be loaded
  if (opts.extra) {
    var fileContents = fs.readFileSync(opts.extra);
    switch (path.extname(opts.extra)) {
      case '.json':
        this.searchOptions.extra = JSON.parse(fileContents);
        break;
      case '.yml':
        this.searchOptions.extra = yml.safeLoad(fileContents);
        break;
    }
  }
  else {
    this.searchOptions.extra = [];
  }

  // Allow the order of types to be sorted
  this.searchOptions.sort = opts.sort || [];

  // Allow custom page types to be defined
  this.searchOptions.pageTypes = opts.pageTypes || {};

  return this;
}

var extend = require('extend');
var fs = require('fs');
var path = require('path');
var yml = require('js-yaml');

module.exports = function(opts) {
  extend(this.searchOptions, opts);

  // Load extra results from an external file
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

  return this;
}

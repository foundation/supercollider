var async       = require('async');
var extend      = require('util')._extend;
var format      = require('string-template');
var frontMatter = require('front-matter');
var fs          = require('fs');
var glob        = require('glob');
var marked      = require('marked');
var path        = require('path');

// Parses files according to the options passed to the constructor.
module.exports = function(file, cb) {
  var _this = this;
  var page = {};
  var pageData = frontMatter(file.contents.toString());

  // Global attributes
  page = pageData.attributes;
  page.__fm = extend({}, pageData.attributes);
  page.docs = '';
  page.fileName = path.relative(process.cwd(), file.path);
  page._adapterData = {};

  // Catch Markdown errors
  if (this.options.marked) {
    try {
      page.docs = marked(pageData.body, {renderer: _this.options.marked || new marked.Renderer()});
    }
    catch (e) {
      throw new Error('Marked error: ' + e.message);
    }
  }
  else {
    page.docs = pageData.body;
  }

  // Run each adapter's parser, if the page references it
  var parseTasks = {};
  for (var lib in this.adapters) {
    if (page[lib]) {
      // Placed inside an IIFE so the value of lib is correct for each function call
      (function(lib) {
        parseTasks[lib] = function(cb) {
          // Store the original value of the YML property so it can be accessed later if needed
          page._adapterData[lib] = page[lib];
          // Store the file on the adapter in case it needs it  
          page[lib]._file = file;

          // Then find the configuration for the adapter and run it
          var config = extend(_this.adapters[lib].config, _this.options.config[lib] || {});
          _this.adapters[lib](page[lib], config, cb);
        }
      })(lib);
    }
  }

  async.parallel(parseTasks, function(err, results) {
    for (var i in results) {
      page[i] = results[i];
    }

    _this.tree.push(page);
    cb(null, page);
  });
}

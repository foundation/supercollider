var async       = require('async');
var format      = require('string-template');
var frontMatter = require('front-matter');
var fs          = require('fs');
var glob        = require('glob');
var hljs        = require('highlight.js');
var marked      = require('marked');
var path        = require('path');

// Parses files according to the options passed to the constructor.
module.exports = function(file, cb) {
  var _this = this;
  var page = {};
  var pageData = frontMatter(file.contents.toString());

  // Global attributes
  page = pageData.attributes;
  page.docs = marked(pageData.body, {renderer: _this.options.marked || new marked.Renderer()});
  page.fileName = path.relative(process.cwd(), file.path);

  // Run each adapter's parser, if the page references it
  var parseTasks = {};
  for (var i in this.options.adapters) {
    var lib = this.options.adapters[i];
    if (page[lib]) {
      // Placed inside an IIFE so the value of lib is correct for each function call
      (function(lib) {
        parseTasks[lib] = function(cb) {
          _this.adapters[lib](page[lib], cb);
        }
      })(lib);
    }
  }

  async.parallel(parseTasks, function(err, results) {
    for (var i in results) {
      page[i] = results[i];
    }
    cb(null, page);
  });
}

var async       = require('async');
var format      = require('string-template');
var frontMatter = require('front-matter');
var fs          = require('fs');
var glob        = require('glob');
var hljs        = require('highlight.js');
var marked      = require('marked');
var path        = require('path');

// Parses files according to the options passed to the constructor.
module.exports = function(files, callback) {
  var tree = {};
  var iter = {};
  var fileTasks = [];
  var _this = this;
  var isFile = typeof files === 'object';

  if (isFile) {
    var key = path.relative(process.cwd(), files.path);
    iter[key] = files.contents;
  }
  else {
    files = glob.sync(files);
  }

  for (var file in iter) {
    fileTasks.push(function(cb) {
      var page = {};

      // Get the file and parse its properties
      if (isFile) {
        pageContents = iter[file];
      }
      else {
        pageContents = fs.readFileSync(iter[file]);
      }

      var pageData = frontMatter(pageContents.toString());
      
      // Global attributes
      page = pageData.attributes;
      page.docs = marked(pageData.body, {renderer: _this.options.marked || new marked.Renderer()});
      page.fileName = file;

      // Run the parse methods of each adapter, if the page references it
      var parserTasks = {}
      for (var i in _this.options.adapters) {
        var lib = _this.options.adapters[i];
        if (page[lib]) {
          // Placed inside an IIFE so the value of lib is correct for each function call
          (function(lib) {
            parserTasks[lib] = function(cbk) {
              _this.adapters[lib].parse(page[lib], cbk);
            }
          })(lib);
        }
      }

      async.parallel(parserTasks, function(err, results) {
        for (var i in results) {
          page[i] = results[i];
        }
        cb(null, page);
      });
    })
  }

  async.parallel(fileTasks, function(err, results) {
    callback(results);
  });
}

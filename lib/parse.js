var async       = require('async');
var frontMatter = require('front-matter');
var fs          = require('fs');
var glob        = require('glob');
var hljs        = require('highlight.js');
var marked      = require('marked');
var path        = require('path');

// Parses files according to the options passed to the constructor.
module.exports = function(files, callback) {
  var tree = {};
  var fileTasks = [];
  var files = glob.sync(files);
  var _this = this;

  for (var file in files) {
    fileTasks.push(function(cb) {
      var page = {};

      // Get the file and parse its properties
      var fileName = path.basename(files[file], '.md');
      var pageContents = fs.readFileSync(files[file]);
      var pageData = frontMatter(pageContents.toString());
      
      // Global attributes
      page.title = pageData.attributes.title;
      page.description = pageData.attributes.description || '';
      page.docs = marked(pageData.body, {
        highlight: function(code, lang) {
          return hljs.highlight(lang, code).value;
        }
      });
      page.fileName = fileName;

      // Run the parse methods of each adapter, if the page references it
      var parserTasks = {}
      for (var lib in _this._adapters) {
        if (pageData.attributes[lib]) {
          // Placed inside an IIFE so the value of lib is correct for each function call
          (function(lib) {
            parserTasks[lib] = function(cbk) {
              _this._adapters[lib].parse(pageData.attributes[lib], cbk);
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
var async       = require('async');
var frontMatter = require('front-matter');
var fs          = require('fs');
var glob        = require('glob');
var hljs        = require('highlight.js');
var marked      = require('marked');
var path        = require('path');
var format      = require('string-template');

var mdRenderer = new marked.Renderer();

mdRenderer.heading = function(text, level) {
  var escapedText = text.toLowerCase().replace(/[^\w]+/g, '-');

  return format('<h{0}><a name="{1}" class="docs-header" href="#{1}"><span class="docs-header-icon"></span>{2}</a></h{0}>', [level, escapedText, text]);
}

// Parses files according to the options passed to the constructor.
module.exports = function(files, callback) {
  var tree = {};
  var fileTasks = [];
  var _this = this;
  var isStream = typeof files === 'object';

  if (isStream) {
    var key = files.path;
    files = {key: files.contents}
  }
  else {
    files = glob.sync(files);
  }

  for (var file in files) {
    fileTasks.push(function(cb) {
      var page = {}, fileName;

      // Get the file and parse its properties
      if (isStream) {
        pageContents = files[file];
        fileName = path.basename(file, '.md');
      }
      else {
        pageContents = fs.readFileSync(files[file]);
        fileName = path.basename(files[file], '.md');
      }

      var pageData = frontMatter(pageContents.toString());
      
      // Global attributes
      page.title = pageData.attributes.title;
      page.description = pageData.attributes.description || '';
      page.docs = marked(pageData.body, {
        highlight: function(code, lang) {
          return hljs.highlight(lang, code).value;
        },
        renderer: mdRenderer
      });
      page.fileName = fileName;

      // Run the parse methods of each adapter, if the page references it
      var parserTasks = {}
      for (var i in _this.options.adapters) {
        var lib = _this.options.adapters[i];
        if (pageData.attributes[lib]) {
          // Placed inside an IIFE so the value of lib is correct for each function call
          (function(lib) {
            parserTasks[lib] = function(cbk) {
              _this.adapters[lib].parse(pageData.attributes[lib], cbk);
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

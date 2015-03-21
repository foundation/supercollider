var async       = require('async');
var frontMatter = require('front-matter');
var fs          = require('fs');
var glob        = require('glob');
var hljs        = require('highlight.js');
var jsdoc       = require('jsdoc3-parser');
var marked      = require('marked');
var path        = require('path');
var sassdoc     = require('sassdoc');

// Parses files according to the options passed to the constructor.
module.exports = function(files, callback) {
  var tree = {};
  var fileTasks = [];
  var files = glob.sync(files);

  for (var file in files) {
    fileTasks.push(function(cb) {
      var page = {};

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

      var parserTasks = {}

      // Language-specific
      if (pageData.attributes.sass) {
        parserTasks['sass'] = function(cbk) {
          sassdoc.parse(pageData.attributes.sass, {verbose: true}).then(function(data) {
            cbk(null, data);
          });
        };
      }

      if (pageData.attributes.js) {
        parserTasks['js'] = function(cbk) {
          jsdoc(pageData.attributes.js, function(error, data) {
            cbk(null, data)
          });
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
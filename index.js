// Creates a new instance of Supercollider, which will generate a single static site.
// options: an object of configuration settings:
//   - html: directory to scan for HTML
//   - sass: directory to scan for Sass
//   - js: directory to scan for JavaScript
//   - dest: directory to output the test JSON to
var Super = function(options) {
  this.options = options;
}

Super.prototype = {
  parse: require('./lib/parse'),
  process: require('./lib/process'),
  build: require('./lib/build'),

  newParse: function(files, callback) {
    var frontMatter = require('front-matter');
    var glob = require('glob');
    var fs = require('fs');
    var path = require('path');
    var sassdoc = require('sassdoc');
    var jsdoc   = require('jsdoc3-parser');
    var async = require('async');
    var hljs   = require('highlight.js');
    var marked = require('marked');

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
}

module.exports = function(files, options) {
  var s = new Super(options);
  s.newParse(files, function(results) {
    console.log(results);
  });
}

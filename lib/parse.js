var async       = require('async');
var extend      = require('util')._extend;
var format      = require('string-template');
var frontMatter = require('front-matter');
var fs          = require('fs');
var glob        = require('glob');
var globAll     = require('glob-all');
var marked      = require('marked');
var path        = require('path');

// Parses files according to the options passed to the constructor.
module.exports = function(file, opts, cb) {
  var _this = this;
  var page = {};
  var pageData = frontMatter(file.contents.toString());

  if(typeof(opts) === 'function') {
    cb = opts;
    opts = {};
  }
  // Global attributes
  page = pageData.attributes;
  page.__fm = extend({}, pageData.attributes);
  page.docs = '';
  page.fileName = path.relative(process.cwd(), file.path);
  page._adapterData = {};
  page.relatedFiles = [];

  // Catch Markdown errors
  if (this.options.marked) {
    try {
      page.docs = marked(pageData.body, { renderer: _this.options.marked });
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

          // Then find the configuration for the adapter and run it
          var config = extend(_this.adapters[lib].config, _this.options.config[lib] || {});
          _this.adapters[lib](page[lib], config, cb);
        }
        parseTasks[lib + '-files'] = function(cb) {
          addFiles(page.relatedFiles, page[lib], function(files) {
            page.relatedFiles = files;
            cb();
          })
        };
      })(lib);
    }
  }

  async.parallel(parseTasks, function(err, results) {
    for (var i in results) {
      page[i] = results[i];
    }

    // For complete builds, push all pages to the tree
    if (!opts.incremental) {
      _this.tree.push(page);
    }
    // For incremental builds, we have to figure out if the page already exists in the tree or not
    else {
      // Look for a page in the tree with a matching filename
      var key = findByKey(_this.tree, 'fileName', page.fileName);

      // If that page exists, we replace the existing page with the revised one
      if (key > -1) {
        _this.tree[key] = page;
      }
      // Otherwise, we add the new page to the end of the tree
      else {
        _this.tree.push(page);
      }
    }

    cb(null, page);
  });
}

function findByKey(array, key, value) {
  for (var i in array) {
    if (array[i][key] && array[i][key] === value) {
      return i;
    }
  }
  return -1;
}

function addFiles(files, fileGlobs, cb) {
  globAll(fileGlobs, function(err, newFiles) {
    cb(files.concat(newFiles));
  });
}

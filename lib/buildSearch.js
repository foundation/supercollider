var fs = require('fs');
var mkdirp = require('mkdirp');
var path = require('path');

/**
 * Generates a search file from the current tree of processed pages.
 * @param {string} outFile - Path to write to.
 * @param {function} cb - Callback to run when the search file is written to disk.
 */
module.exports = function(outFile, cb) {
  var tree = this.tree;
  var results = [];

  // Each item in the tree is a page
  for (var i in tree) {
    var item = tree[i];
    var link = path.relative('docs/pages', item.fileName).replace('md', this.options.extension || 'html');
    var type = 'page';

    // By default pages are classified as a "page"
    // If it has code associated with it, then it's a "component" instead.
    if (keysInObject(item, Object.keys(this.adapters))) {
      type = 'component';
    }
    if (item.library) {
      type = 'library';
    }

    // Add the page itself as a search result
    results.push({
      type: type,
      name: item.title,
      description: item.description,
      link: link,
      tags: item.tags || []
    });

    // Run search builders for each adapter
    for (var a in this.adapters) {
      if (this.adapters[a].search) {
        results = results.concat(this.adapters[a].search(item[a], link));
      }
    }
  }

  mkdirp(path.dirname(outFile), function(err) {
    if (err) throw err;
    fs.writeFile(outFile, JSON.stringify(results, null, '  '), cb);
  });
}

function keysInObject(obj, keys) {
  for (var i in keys) {
    if (i in obj) return true;
  }
  return false;
}

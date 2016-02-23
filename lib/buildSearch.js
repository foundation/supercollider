var fs = require('fs');
var mkdirp = require('mkdirp');
var path = require('path');

/**
 * Generates a search file from the current tree of processed pages.
 * @param {string} outFile - Path to write to.
 * @param {function} cb - Callback to run when the search file is written to disk.
 * @todo Make hashes for search result types configurable
 */
module.exports = function(outFile, cb) {
  var tree = this.tree;
  var results = [];

  results = results.concat(this.searchOptions.extra);

  // Each item in the tree is a page
  for (var i in tree) {
    var item = tree[i];
    var link = path.relative(this.options.pageRoot, item.fileName).replace('md', this.options.extension);
    var type = 'page';

    // By default pages are classified as a "page"
    // If it has code associated with it, then it's a "component" instead.
    if (keysInObject(item, Object.keys(this.adapters))) {
      type = 'component';
    }

    // Check for special page types
    for (var t in this.searchOptions.pageTypes) {
      var func = this.searchOptions.pageTypes[t];
      if (func(item)) {
        type = t;
      }
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
      if (this.adapters[a].search && item[a]) {
        results = results.concat(this.adapters[a].search(item[a], link));
      }
    }
  }

  // Re-order search results based on search config
  results = results.sort(function(a, b) {
    return this.searchOptions.sort.indexOf(a.type) - this.searchOptions.sort.indexOf(b.type);
  }.bind(this));

  // Write the finished results to disk
  mkdirp(path.dirname(outFile), function(err) {
    if (err) throw err;
    fs.writeFile(outFile, JSON.stringify(results, null, '  '), cb);
  });
}

/**
 * Determines if any key in an array exists on an object.
 * @param {object} obj - Object to check for keys.
 * @param {array} keys - Keys to check.
 * @returns {boolean} `true` if any key is found on the object, or `false` if not.
 */
function keysInObject(obj, keys) {
  for (var i in keys) {
    if (keys[i] in obj) return true;
  }
  return false;
}

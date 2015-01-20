var fs      = require('fs');
var sassdoc = require('sassdoc');
var exec    = require('child_process').exec;
var async   = require('async');
var marked  = require('marked');
var hljs    = require('highlight.js');

var Super = function(options) {
  var _this = this;

  async.parallel([
    function(callback) {
      sassdoc.parse(options.sass, {verbose: true}).then(function(data) {
        callback(null, data);
      });
    },
    function(callback) {
      exec('bundle exec ruby hologram.rb', function(error, stdout, stderr) {
        callback(error, JSON.parse(stdout));
      });
    }
  ], function(err, results) {
    _this.process(results);
  });
}
Super.prototype = {
  process: function(data) {
    var hologram = data[1][0];
    var sassdoc  = data[0];
    var tree = {};

    // Process Hologram components
    // The Hologram parser forms the "canonical" list of components
    for (var item in hologram) {
      var comp = hologram[item];
      var componentName = comp['blocks'][0]['name'];
      var html = marked(comp['md'], {
        highlight: function(code, lang) {
          return hljs.highlight(lang, code).value;
        }
      });

      tree[componentName] = {
        'html': html,
        'variable': [],
        'mixin': [],
        'function': []
      }
    }

    // Process SassDoc components
    // Everything SassDoc finds is bolted onto the Hologram stuff
    for (var i = 0; i < sassdoc.length; i++) {
      var item = sassdoc[i];
      var group = item['group'][0];
      var type  = item['context']['type'];

      if (typeof tree[group] === 'object') {
        // type will be "function", "mixin", or "variable"
        tree[group][type].push(item);
      }
      else {
        console.warn("Found a component missing HTML documentation: " + group);
      }
    }

    fs.writeFile('docs.json', JSON.stringify(tree));
  }
}

module.exports = function(options) {
  new Super(options);
}
var fs      = require('fs');
var sassdoc = require('sassdoc');
var exec    = require('child_process').exec;
var async   = require('async');
var marked  = require('marked');
var hljs    = require('highlight.js');
var jsdoc   = require('jsdoc3-parser');

var Super = function(options) {
  var _this = this;
  this.options = options;

  async.parallel([
    // Hologram
    function(callback) {
      exec('bundle exec ruby lib/hologram.rb ' + options.html, function(error, stdout, stderr) {
        callback(error, JSON.parse(stdout));
      });
    },
    // SassDoc
    function(callback) {
      sassdoc.parse(options.sass, {verbose: true}).then(function(data) {
        callback(null, data);
      });
    },
    // JSDoc
    function(callback) {
      jsdoc('js/button.js', function(error, ast) {
        callback(error, ast);
      });
    }
  ], function(err, results) {
    _this.process(results);
  });
}
Super.prototype = {
  process: function(data) {
    var hologram = data[0][0];
    var sassdoc  = data[1];
    var jsdoc    = data[2];
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
        'function': [],
        'javascript': []
      }
    }

    // Process SassDoc components
    // The @group tag is used to connect items to the main object
    for (var i = 0; i < sassdoc.length; i++) {
      var item = sassdoc[i];
      var group = item['group'][0];
      var type  = item['context']['type'];

      if (typeof tree[group] === 'object') {
        // Type will be "function", "mixin", or "variable"
        tree[group][type].push(item);
      }
      else {
        console.warn("Found a Sass component missing HTML documentation: " + group);
      }
    }

    // Process JSDoc components
    // The @component tag is used to connect items to the main object
    for (var item in jsdoc) {
      var comp = jsdoc[item];

      // Find the component name
      var group = (function() {
        for (var tag in comp['tags']) {
          if (comp['tags'][tag]['title'] === 'component') return comp['tags'][tag]['value'];
        }
        return null;
      })();

      if (group === null) {
        console.warn("Found a JavaScript doclet missing a component name: " + comp['kind'] + " " + comp['name']);
      }
      else {
        if (typeof tree[group] === 'object') {
          tree[group]['javascript'].push(comp);
        }
        else {
          console.warn("Found a JavaScript component missing HTML documentation: " + group);
        }
      }
    }

    fs.writeFile(this.options.dest, JSON.stringify(tree));
  }
}

module.exports = function(options) {
  new Super(options);
}
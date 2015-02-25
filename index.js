var async      = require('async');
var css        = require('css');
var exec       = require('child_process').exec;
var fs         = require('fs');
var glob       = require('glob');
var handlebars = require('./lib/handlebars');
var hljs       = require('highlight.js');
var jsdoc      = require('jsdoc3-parser');
var marked     = require('marked');
var path       = require('path');
var rimraf     = require('rimraf');
var sass       = require('node-sass');
var sassdoc    = require('sassdoc');

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
  build: require('./lib/build')
}

module.exports = function(options) {
  var s = new Super(options);
  s.parse(function(data) {
    var tree = s.process(data);
    s.build(tree);
  });
}

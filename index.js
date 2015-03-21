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

module.exports = function(files, options) {
  var s = new Super(options);
  s.parse(files, function(results) {
    var tree = s.process(results);
    s.build(tree);
  });
}

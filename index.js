var path    = require('path');
var through = require('through2');

var Super = function(options) {
  this.options = options;
  this.adapters = {};
}

Super.prototype = {
  parse: require('./lib/parse'),
  process: require('./lib/process'),
  build: require('./lib/build'),
  adapter: require('./lib/adapter')
}

var s = new Super();
s.adapter('sass', require(path.join(__dirname, 'adapters', 'sass')));
s.adapter('js', require(path.join(__dirname, 'adapters', 'js')));

module.exports = {
  init: function(files, options) {
    s.options = options;
    
    s.parse(files, function(data) {
      var tree = s.process(data);
      s.build(tree);
    });
  },
  stream: function(options) {
    s.options = options;

    return through.obj(function(file, encoding, done) {
      var _this = this;

      s.parse(file, function(data) {
        var tree = s.process(data);
        var ext = path.extname(file.path);

        // Change the file extension to .html
        file.path = file.path.replace(new RegExp(ext+'$'), '.html');
        // Replace the Markdown file's contents with the new HTML
        file.contents = new Buffer(s.build(tree));

        _this.push(file);
        return done();
      });
    });
  },
  adapter: function() {
    s.adapter.apply(s, arguments);
  },
  Super: Super
}

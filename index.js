var path    = require('path');
var through = require('through2-concurrent');
var vfs     = require('vinyl-fs');
var fs      = require('fs');
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
  init: function(options) {
    s.options = options;

    var parse = function() {
      return through.obj(function(file, enc, cb) {
        s.parse(file, function(data) {
          var tree = s.process(data);
          var ext = path.extname(file.path);

          file.path = file.path.replace(new RegExp(ext+'$'), '.html');
          file.contents = new Buffer(s.build(tree));

          if (options.dest) {
            var filePath = path.join(options.dest, path.basename(file.path));
            fs.writeFileSync(filePath, file.contents.toString());
          }
          else {
            cb(null, file);
          }
        });
      });
    }

    if (options.src) {
      vfs.src(options.src, {base: options.base}).pipe(parse());
    }
    else {
      return parse();
    }
  },
  adapter: function() {
    s.adapter.apply(s, arguments);
  },
  Super: Super
}

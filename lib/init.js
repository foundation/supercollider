var chalk   = require('chalk');
var format  = require('util').format;
var fs      = require('fs');
var log     = require('gulp-util').log;
var path    = require('path');
var through = require('through2');
var vfs     = require('vinyl-fs');

module.exports = function() {
  var _this = this;

  if (!this.options.config) this.options.config = {};

  if (this.options.dest && !fs.existsSync(this.options.dest)) {
    fs.mkdirSync(this.options.dest);
  }

  if (this.options.src) {
    var stream = vfs
      .src(this.options.src, { base: this.options.base })
      .pipe(transform());

    return stream;
  }
  else {
    return transform();
  }

  function transform() {
    return through.obj(function(file, enc, cb) {
      var time = process.hrtime();

      _this.parse(file, function(err, data) {
        // Change the extension of the incoming file to .html, and replace the Markdown contents with rendered HTML
        var ext = path.extname(file.path);
        var newExt = _this.options.extension || 'html';
        file.path = file.path.replace(new RegExp(ext+'$'), '.' + newExt);
        file.contents = new Buffer(_this.build(data));

        // Write new file to disk if necessary
        if (_this.options.dest) {
          var filePath = path.join(_this.options.dest, path.basename(file.path));
          fs.writeFileSync(filePath, file.contents.toString());
        }

        if (!_this.options.silent) {
          statusLog(path.basename(file.path), data, process.hrtime(time));
        }
        cb(null, file);
      });
    });
  }
}

function statusLog(file, data, time) {
  var msg = '';
  var diff = (process.hrtime(time)[1] / 1000000000).toFixed(2);
  var adapters = Object.keys(data._adapterData).join(', ');

  msg += format('Supercollider: processed %s in %s', chalk.cyan(file), chalk.magenta(diff + ' s'));

  if (adapters.length) {
    msg += format(' with %s', chalk.yellow(adapters));
  }

  log(msg);
}

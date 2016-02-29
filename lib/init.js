var chalk   = require('chalk');
var format  = require('util').format;
var fs      = require('fs');
var log     = require('gulp-util').log;
var mkdirp  = require('mkdirp').sync;
var path    = require('path');
var through = require('through2');
var vfs     = require('vinyl-fs');

module.exports = function(opts) {
  if (typeof opts === 'undefined') opts = {};

  // Reset the internal data tree
  if (!opts.incremental) {
    this.tree = [];
  }

  if (this.options.dest) {
    mkdirp(this.options.dest)
  }

  if (this.options.src) {
    var stream = vfs
      .src(this.options.src, { base: this.options.base })
      .pipe(transform.apply(this));

    return stream;
  }
  else {
    return transform.apply(this);
  }

  function transform() {
    return through.obj(function(file, enc, cb) {
      var time = process.hrtime();

      this.parse(file, opts, function(err, data) {
        // Change the extension of the incoming file to .html, and replace the Markdown contents with rendered HTML
        var ext = path.extname(file.path);
        var newExt = this.options.extension;

        file.path = file.path.replace(new RegExp(ext+'$'), '.' + newExt);
        file.contents = new Buffer(this.build(data));

        // Write new file to disk if necessary
        if (this.options.dest) {
          var filePath = path.join(this.options.dest, path.basename(file.path));
          fs.writeFileSync(filePath, file.contents.toString());
        }

        // Log page name, processing time, and adapters used to console
        if (!this.options.silent) {
          statusLog(path.basename(file.path), data, process.hrtime(time));
        }

        cb(null, file);
      }.bind(this));
    }.bind(this));
  };
}

/**
 * Logs the completion of a page being processed to the console.
 * @param {string} file - Name of the file.
 * @param {object} data - Data object associated with the file. The list of adapters is pulled from this.
 * @param {integer} time - Time it took to process the file.
 */
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

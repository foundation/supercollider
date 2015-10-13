var fs = require('fs');

module.exports = function(opts) {
  var fileData;
  this.options = opts;

  if (!opts.handlebars) this.options.handlebars = require('handlebars');

  if (opts.template) {
    try {
      fileData = fs.readFileSync(this.options.template);
    }
    catch (e) {
      throw new Error('Error loading Supercollider template file: ' + e.message);
    }

    this.template = this.options.handlebars.compile(fileData.toString(), {noEscape: true});
  }
  else {
    throw new Error('No path to a template was set in Supercollider.config().');
  }

  return this;
}

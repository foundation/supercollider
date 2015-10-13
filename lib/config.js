var fs = require('fs');

module.exports = function(opts) {
  this.options = opts;

  if (!opts.handlebars) this.options.handlebars = require('handlebars');

  if (opts.template) {
    var fileData = fs.readFileSync(this.options.template);
    this.template = this.options.handlebars.compile(fileData.toString(), {noEscape: true});
  }

  return this;
}

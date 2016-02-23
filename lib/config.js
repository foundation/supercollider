var extend = require('util')._extend;
var fs = require('fs');
var Renderer = require('marked').Renderer;

module.exports = function(opts) {
  var fileData;

  this.options = extend({
    config: {},
    data: {},
    extension: 'html',
    handlebars: require('handlebars'),
    marked: new Renderer(),
    pageRoot: process.cwd(),
    silent: false
  }, opts);

  // A template is required
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

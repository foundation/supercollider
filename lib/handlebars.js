var marked     = require('marked');
var handlebars = require('handlebars');

// Capitalizes the first letter of a string
handlebars.registerHelper('toUpper', function(str) {
  return str[0].toUpperCase() + str.slice(1);
});

// Formats a mixin using a SassDoc mixin object to look like this:
// @mixin mixinName($param, $param) { }
handlebars.registerHelper('writeMixin', function(mixin) {
  var name = mixin['context']['name'];
  var params = mixin['parameter'];

  var str = '@mixin ';
  str += name + '(';
  for (var i in params) {
    str += '$' + params[i]['name'] + ', ';
  }
  str = str.slice(0, -2);
  str += ') { }';

  return str;
});

// Converts a markdown string to HTML
handlebars.registerHelper('md', function(text) {
  return marked(text);
});

// Returns content inside the block if any parameters are truthy
// {{#ifany param1 param2 etc}}{{/ifany}}
handlebars.registerHelper('ifany', function() {
  arguments = Array.prototype.slice.call(arguments);
  var args = arguments.slice(0, -1);
  var context = arguments.slice(-1)[0];
  for (var item in args) {
    if (args[item].length > 0) return context.fn(this);
  }
});

module.exports = handlebars;
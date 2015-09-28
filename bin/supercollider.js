#!/usr/bin/env node

var program = require('commander');
var path = require('path');
var Super = require('../index');

program
  .version('0.2.0')
  .usage('[options]')
  .option('-s, --source <glob>', 'Glob of files to process')
  .option('-t, --template <file>', 'Handlebars template to use')
  .option('-a, --adapters <items>', 'Adapters to use', list)
  .option('-d, --dest <folder>', 'Folder to output HTML to')
  .option('-m, --marked <file>', 'Path to a Marked renderer instance', lib)
  .option('-h, --handlebars <file>', 'Path to a Handlebars instance', lib)
  .parse(process.argv);

var s = Super.init({
  src: program.source || false,
  template: program.template || false,
  adapters: program.adapters || false,
  dest: program.dest || false,
  marked: program.marked || false,
  handlebars: program.handlebars || false
});

s.on('finish', process.exit);

// Creates an array from a comma-separated list
function list(val) {
  return val.split(',');
}

// Returns a require'd library from a path
function lib(val) {
  var p = path.join(process.cwd(), val);
  return require(p);
}

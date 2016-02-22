var exec   = require('child_process').execFile;
var expect = require('chai').expect;
var extend = require('util')._extend;
var fs     = require('fs');
var rimraf = require('rimraf');
var vfs    = require('vinyl-fs');

var SOURCES = './test/fixtures/*.md';
var OUTPUT  = './test/_build';

var CONFIG = {
  template: './test/fixtures/template.html',
  config: {
    'sass': { verbose: false }
  },
  marked: require('./fixtures/marked'),
  handlebars: require('./fixtures/handlebars'),
  silent: true
}

describe('Supercollider', function() {
  afterEach(function(done) {
    rimraf(OUTPUT, done);
  });

  it('works as a standalone plugin', function(done) {
    var Super  = require('../index');
    var opts = extend({}, CONFIG);
    opts.src = SOURCES;
    opts.dest = OUTPUT;

    var s = Super
      .config(opts)
      .adapter('sass')
      .adapter('js')
      .init();

    s.on('finish', done);
  });

  it('works inside a stream of Vinyl files', function(done) {
    var Super = require('../index');
    var opts = extend({}, CONFIG);

    Super
      .config(opts)
      .adapter('sass')
      .adapter('js');

    var s = vfs.src(SOURCES)
      .pipe(Super.init(opts))
      .pipe(vfs.dest(OUTPUT));

    s.on('finish', done);
  });

  xit('works from the command line', function(done) {
    var args = [
      '--source', SOURCES,
      '--template', CONFIG.template,
      '--adapters', 'sass,js',
      '--dest', OUTPUT,
      '--marked', './test/fixtures/marked.js',
      '--handlebars', './test/fixtures/handlebars.js'
    ];

    exec('./bin/supercollider.js', args, done);
  });
});

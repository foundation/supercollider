var exec   = require('child_process').execFile;
var extend = require('util')._extend;
var mocha  = require('mocha');
var rimraf = require('rimraf');
var vfs    = require('vinyl-fs');

var SOURCES = './test/fixtures/*.md';
var OUTPUT  = './test/_build';

var CONFIG = {
  template: './test/fixtures/template.html',
  adapters: ['sass', 'js'],
  config: {
    'sass': { verbose: false }
  },
  marked: require('./fixtures/marked'),
  handlebars: require('./fixtures/handlebars')
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

    var s = Super.config(opts).init();

    s.on('finish', done);
  });

  it('works inside a stream of Vinyl files', function(done) {
    var Super = require('../index');
    var opts = extend({}, CONFIG);

    Super.config(opts);

    var s = vfs.src(SOURCES)
      .pipe(Super.init(opts))
      .pipe(vfs.dest(OUTPUT));

    s.on('finish', done);
  });

  it('works from the command line', function(done) {
    var args = [
      '--source', SOURCES,
      '--template', CONFIG.template,
      '--adapters', CONFIG.adapters.join(','),
      '--dest', OUTPUT,
      '--marked', './test/fixtures/marked.js',
      '--handlebars', './test/fixtures/handlebars.js'
    ];

    exec('./bin/supercollider.js', args, done);
  });
});

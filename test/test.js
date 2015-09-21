var extend = require('util')._extend;
var mocha  = require('mocha');
var rimraf = require('rimraf');
var Super  = require('../index');
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
    var opts = extend({}, CONFIG);
    opts.src = SOURCES;
    opts.dest = OUTPUT;

    var s = Super.init(opts);

    s.on('finish', done);
  });

  it('works inside a stream of Vinyl files', function(done) {
    var opts = extend({}, CONFIG);

    var s = vfs.src(SOURCES)
      .pipe(Super.init(opts))
      .pipe(vfs.dest(OUTPUT));

    s.on('finish', done);
  });
});

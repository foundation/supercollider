var exec   = require('child_process').execFile;
var expect = require('chai').expect;
var extend = require('util')._extend;
var fs     = require('fs');
var mocha  = require('mocha');
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

  it('works from the command line', function(done) {
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

describe('Search Builder', function() {
  var s, data;

  before(function(done) {
    var Super  = require('../index');
    var opts = extend({}, CONFIG);
    opts.src = SOURCES;
    opts.dest = OUTPUT;

    s = Super.config(opts).adapter('sass').adapter('js');
    s.init().on('finish', function() {
      s.buildSearch('test/_build/search.json', function() {
        fs.readFile('test/_build/search.json', function(err, contents) {
          if (err) throw err;
          data = JSON.parse(contents);
          done();
        });
      });
    });
  });

  it('generates search results for processed pages', function() {
    expect(data).to.be.an('array');
    expect(data[0]).to.have.all.keys(['type', 'name', 'description', 'link', 'tags']);
  });
})

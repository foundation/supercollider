var expect = require('chai').expect;
var fs = require('fs');
var rimraf = require('rimraf');
var Supercollider = require('..').Supercollider;
var vfs = require('vinyl-fs');
var watch = require('watchjs').watch;

describe('Supercollider.init()', function() {
  it('parses and builds a documentation page', function(done) {
    var s = new Supercollider();
    s.config({
      src: 'test/fixtures/*.md',
      dest: 'test/fixtures/_build',
      template: 'test/fixtures/template.html',
      silent: true
    });

    var stream = s.init();

    expect(stream).to.have.property('on');
    stream.on('finish', function() {
      expect(fs.existsSync('test/fixtures/_build/example.html')).to.be.ok;
      done();
    });
  });

  it('works within a stream of Vinyl files if src and dest are omitted', function(done) {
    var s = new Supercollider();
    s.config({
      template: 'test/fixtures/template.html',
      silent: true
    });

    vfs.src('test/fixtures/*.md')
      .pipe(s.init())
      .on('data', function(file) {
        expect(file.path).to.contain('.html');
        expect(file.contents.toString()).to.contain('<h2');
        done();
      });
  });

  it('resets the internal data tree on each build', function(done) {
    var s = new Supercollider();
    s.config({
      src: 'test/fixtures/*.md',
      template: 'test/fixtures/template.html',
      silent: true
    });

    s.init().on('finish', function() {
      expect(s.tree).to.have.length(1);

      s.init().on('finish', function() {
        expect(s.tree).to.have.length(1);
        done();
      });
    });
  });

  it('allows for incremental builds', function(done) {
    var s = new Supercollider();
    s.config({
      src: 'test/fixtures/*.md',
      template: 'test/fixtures/template.html',
      silent: true
    });

    s.init().on('finish', function() {
      expect(s.tree).to.have.length(1);

      s.init({ incremental: true }).on('finish', function() {
        expect(s.tree).to.have.length(1);
        done();
      });
    });
  })
});

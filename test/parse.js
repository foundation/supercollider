var expect = require('chai').expect;
var Supercollider = require('..').Supercollider;

var TEST_FILE = require('./fixtures/test_file');

describe('Supercollider.parse()', function() {
  it('converts Markdown into HTML', function() {
    var s = new Supercollider();
    s.config({
      template: 'test/fixtures/template.html'
    });

    s.parse(TEST_FILE, function(err, data) {
      expect(data).to.be.an('object');
      expect(data.docs).to.contain('<h2');
    });
  });

  it('does not touch Markdown if configured to ignore it', function() {
    var s = new Supercollider();
    s.config({
      template: 'test/fixtures/template.html',
      marked: null
    });

    s.parse(TEST_FILE, function(err, data) {
      expect(data).to.be.an('object');
      expect(data.docs).to.not.contain('<h2');
    });
  });

  it('loads data from adapters', function() {
    var s = new Supercollider();
    s.config({
      template: 'test/fixtures/template.html',
      marked: null
    }).adapter('sass').adapter('js');

    s.parse(TEST_FILE, function(err, data) {
      expect(data._adapterData).to.have.all.keys(['sass', 'js']);
      expect(data.sass).to.be.an('object');
      expect(data.js).to.be.an('object');
    });
  });

  it('catches Markdown errors', function() {
    var s = new Supercollider();
    s.config({
      template: 'test/fixtures/template.html',
      marked: require('./fixtures/marked-broken')
    });

    expect(function() {
      s.parse(TEST_FILE);
    }).to.throw(Error);
  });
});

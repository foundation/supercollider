var expect = require('chai').expect;
var Supercollider = require('..').Supercollider;

var TEST_FILE = require('./fixtures/test_file');

describe('Supercollider.build()', function() {
  it('builds an HTML file from the data of a page', function() {
    var s = new Supercollider();
    s.config({
      template: 'test/fixtures/template-simple.html'
    });

    var output = s.build({ var: 'kitty' });
    expect(output).to.be.a('string');
    expect(output).to.contain('kitty');
  });

  it('adds global data to the Handlebars instance', function() {
    var s = new Supercollider();
    s.config({
      template: 'test/fixtures/template-simple.html',
      data: { var: 'kitty' }
    });

    var output = s.build({});
    expect(output).to.contain('kitty');
  });

  it('catches Handlebars errors', function() {
    var s = new Supercollider();
    s.config({
      template: 'test/fixtures/template-broken.html'
    });

    expect(function() {
      s.build({})
    }).to.throw(Error);
  });

  it('allows Front Matter to be retained on the page', function(done) {
    var s = new Supercollider();
    s.config({
      template: 'test/fixtures/template.html',
      keepFm: true
    });

    s.parse(TEST_FILE, function(err, data) {
      var output = s.build(data);
      expect(output).to.contain('---');
      done();
    });
  });
});

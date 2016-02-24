var expect = require('chai').expect;
var Supercollider = require('..').Supercollider;

describe('Supercollider.config()', function() {
  it('sets configuration settings', function() {
    var s = new Supercollider();
    s = s.config({
      src: 'src',
      dest: 'dest',
      template: 'test/fixtures/template.html'
    }).adapter('sass').adapter('js');

    expect(s).to.be.an.instanceOf(Supercollider);
    expect(s.options.src).to.equal('src');
    expect(s.options.dest).to.equal('dest');
  });

  it('throws an error if no template is defined', function() {
    var s = new Supercollider();

    expect(function() {
      s.config({});
    }).to.throw(Error);
  });

  it('throws an error if the template cannot be loaded', function() {
    var s = new Supercollider();

    expect(function() {
      s.config({ template: 'test/kitten.html' });
    }).to.throw(Error);
  });
});

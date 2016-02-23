var expect = require('chai').expect;
var Supercollider = require('..').Supercollider;

describe('Supercollider.adapter()', function() {
  it('loads built-in adapters', function() {
    var s = new Supercollider();
    s = s.adapter('sass');

    expect(s).to.be.an.instanceOf(Supercollider);
    expect(s.adapters).to.have.key('sass');
    expect(s.adapters.sass.config).to.exist;
  });

  it('throws an error if you try to load a non-existant built-in adapter', function() {
    var s = new Supercollider();

    expect(function() {
      s.adapter('kitten');
    }).to.throw(Error);
  });

  it('loads custom adapters', function() {
    var s = new Supercollider();
    s = s.adapter('custom', function() {});

    expect(s.adapters).to.have.key('custom');
    expect(s.adapters.custom).to.be.a('function');
  });

  it('throws an error if you use a reserved keyword as an adapter name', function() {
    var s = new Supercollider();

    expect(function() {
      s.adapter('docs', function() {});
    }).to.throw(Error);
  });

  it('throws an error if you try to pass something other than a function as an adapter', function() {
    var s = new Supercollider();

    expect(function() {
      s.adapter('docs', 'kittens');
    }).to.throw(Error);
  });
});

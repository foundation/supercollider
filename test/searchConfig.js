var expect = require('chai').expect;
var Supercollider = require('..').Supercollider;

describe('Supercollider.searchConfig()', function() {
  it('sets empty settings', function() {
    var s = new Supercollider();
    s = s.searchConfig({})

    expect(s).to.be.an.instanceOf(Supercollider);
    expect(s.searchOptions).to.have.all.keys(['extra', 'sort', 'pageTypes']);
  });

  it('loads JSON data', function() {
    var s = new Supercollider();
    s.searchConfig({ extra: 'test/fixtures/search.json' });

    expect(s.searchOptions.extra).to.be.an('array');
    expect(s.searchOptions.extra).to.have.length(2);
  });

  it('loads YAML data', function() {
    var s = new Supercollider();
    s.searchConfig({ extra: 'test/fixtures/search.yml' });

    expect(s.searchOptions.extra).to.be.an('array');
    expect(s.searchOptions.extra).to.have.length(2);
  })
});

var expect = require('chai').expect;
var fs = require('fs');
var rimraf = require('rimraf');
var Supercollider = require('..').Supercollider;

describe('Supercollider.buildSearch()', function() {
  afterEach(function(done) {
    rimraf('test/fixtures/_build', done);
  });

  it('works even if searchConfig() was not called', function(done) {
    var s = new Supercollider().config({
      src: 'test/fixtures/*.md',
      template: 'test/fixtures/template.html',
      handlebars: require('./fixtures/handlebars'),
      silent: true
    });

    s.init().on('finish', function() {
      s.buildSearch('test/fixtures/_build/search.json', done);
    });
  });

  it('flags generic pages as "page"', function(done) {
    var s = new Supercollider().config({
      src: 'test/fixtures/*.md',
      template: 'test/fixtures/template.html',
      handlebars: require('./fixtures/handlebars'),
      silent: true
    }).searchConfig({});

    s.init().on('finish', function() {
      s.buildSearch('test/fixtures/_build/search.json', function() {
        var data = fs.readFileSync('./test/fixtures/_build/search.json').toString();
        page = JSON.parse(data)[0];

        expect(page.type).to.equal('page');
        done();
      });
    });
  });

  it('flags pages with code hooks as "component"', function(done) {
    var s = new Supercollider().config({
      src: 'test/fixtures/*.md',
      template: 'test/fixtures/template.html',
      handlebars: require('./fixtures/handlebars'),
      silent: true
    }).searchConfig({}).adapter('sass');

    s.init().on('finish', function() {
      s.buildSearch('test/fixtures/_build/search.json', function() {
        var data = fs.readFileSync('./test/fixtures/_build/search.json').toString();
        data = JSON.parse(data);

        for (var i in data) {
          if (data[i].name === 'Button')
            expect(data[i].type).to.equal('component')
        }

        done();
      });
    });
  });

  it('allows for custom page types', function(done) {
    var s = new Supercollider().config({
      src: 'test/fixtures/*.md',
      template: 'test/fixtures/template.html',
      handlebars: require('./fixtures/handlebars'),
      silent: true
    }).searchConfig({
      pageTypes: {
        custom: function(item) {
          expect(item).to.be.an('object');
          return true;
        }
      }
    });

    s.init().on('finish', function() {
      s.buildSearch('test/fixtures/_build/search.json', function() {
        var data = fs.readFileSync('./test/fixtures/_build/search.json').toString();
        page = JSON.parse(data)[0];

        expect(page.type).to.equal('custom');
        done();
      });
    });
  });

  it('creates a JSON file of search results', function(done) {
    var s = new Supercollider().config({
      src: 'test/fixtures/*.md',
      template: 'test/fixtures/template.html',
      handlebars: require('./fixtures/handlebars'),
      silent: true
    }).searchConfig({}).adapter('sass').adapter('js');

    s.init().on('finish', function() {
      s.buildSearch('test/fixtures/_build/search.json', function() {
        var data = fs.readFileSync('./test/fixtures/_build/search.json').toString();
        data = JSON.parse(data);

        expect(data).to.be.an('array');
        expect(data).to.have.length(17);
        done();
      });
    });
  });

  it('allows extra external results to be added', function(done) {
    var s = new Supercollider().config({
      src: 'test/fixtures/*.md',
      template: 'test/fixtures/template.html',
      handlebars: require('./fixtures/handlebars'),
      silent: true
    }).searchConfig({
      extra: 'test/fixtures/search.yml'
    }).adapter('sass').adapter('js');

    s.init().on('finish', function() {
      s.buildSearch('test/fixtures/_build/search.json', function() {
        var data = fs.readFileSync('./test/fixtures/_build/search.json').toString();
        data = JSON.parse(data);

        expect(data).to.be.an('array');
        expect(data).to.have.length(17 + 2); // 2 extra results in the YML file
        done();
      });
    });
  });
});

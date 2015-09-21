var mocha  = require('mocha');
var rimraf = require('rimraf');
var Super  = require('../index');
var vfs    = require('vinyl-fs');

describe('Supercollider', function() {
  it('works as a standalone plugin', function(done) {
    var s = Super.init({
      src: 'test/fixtures/*.md',
      dest: './test/_build',
      template: './test/fixtures/template.html',
      adapters: ['sass', 'js'],
      config: {
        'sass': { verbose: false }
      },
      marked: require('./fixtures/marked'),
      handlebars: require('./fixtures/handlebars')
    });

    s.on('finish', done);
  });

  it('works inside a stream of Vinyl files', function(done) {
    var s = vfs.src('./test/fixtures/*.md')
      .pipe(Super.init({
        template: './test/fixtures/template.html',
        adapters: ['sass', 'js'],
        config: {
          'sass': { verbose: false }
        },
        marked: require('./fixtures/marked'),
        handlebars: require('./fixtures/handlebars')
      }))
      .pipe(vfs.dest('./fixtures/_build'));

    s.on('finish', done);
  });
});

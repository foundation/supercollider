var gulp  = require('gulp');
var Super = require('./index');

gulp.task('default', function() {
  Super.init('test/pages/*.md', {
    templates: './test/templates',
    adapters: ['sass', 'js'],
    dest: './_build'
  });
});

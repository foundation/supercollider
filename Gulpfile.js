var gulp  = require('gulp');
var Super = require('./index');

Super.use('sass');
Super.use('js');

gulp.task('default', function() {
  Super.init('test/pages/*.md', {
    templates: './test/templates',
    dest: './_build'
  });
});

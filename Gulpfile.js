var gulp  = require('gulp');
var Super = require('./index');

gulp.task('default', function() {
  Super.init('test/pages/*.md', {
    template: './test/template.html',
    adapters: ['sass', 'js'],
    dest: './_build'
  });
});

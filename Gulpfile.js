var gulp  = require('gulp');
var Super = require('./super');

gulp.task('default', function() {
  Super({
    html: './scss',
    sass: './scss',
    js: './js/**/*.js',
    destJSON: 'docs.json',
    dest: './build'
  });
});
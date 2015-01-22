var gulp  = require('gulp');
var Super = require('./index');

gulp.task('default', function() {
  Super({
    html: './test/scss',
    sass: './test/scss',
    js: './test/js/**/*.js',
    destJSON: null,
    dest: './build'
  });
});
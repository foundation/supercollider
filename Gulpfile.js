var gulp  = require('gulp');
var Super = require('./index');

gulp.task('stream', function() {
  gulp.src('./test/pages/*.md')
    .pipe(Super.init({
      template: './test/template.html',
      adapters: ['sass', 'js']
    }))
    .pipe(gulp.dest('./_build'));
});

gulp.task('default', function() {
  Super.init({
    src: 'test/pages/*.md',
    base: 'test/pages',
    template: './test/template.html',
    adapters: ['sass', 'js'],
    dest: './_build'
  });
});

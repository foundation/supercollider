var gulp  = require('gulp');
var Super = require('./index');

gulp.task('stream', function() {
  gulp.src('./test/*.md')
    .pipe(Super.init({
      template: './test/template.html',
      adapters: ['sass', 'js']
    }))
    .pipe(gulp.dest('./_build'));
});

gulp.task('default', function() {
  Super.init({
    src: 'test/*.md',
    template: './test/template.html',
    adapters: ['sass', 'js'],
    dest: './_build',
    handlebars: require('./lib/handlebars')
  });
});

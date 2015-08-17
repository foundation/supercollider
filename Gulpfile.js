var gulp  = require('gulp');
var Super = require('./index');

gulp.task('stream', function() {
  gulp.src('./test/*.md')
    .pipe(Super.init({
      template: './test/template.html',
      adapters: ['sass', 'js'],
      config: {
        'sass': { verbose: true }
      },
      marked: require('./test/marked'),
      handlebars: require('./test/handlebars')
    }))
    .pipe(gulp.dest('./_build'));
});

gulp.task('default', function() {
  Super.init({
    src: 'test/*.md',
    dest: './_build',
    template: './test/template.html',
    adapters: ['sass', 'js'],
    config: {
      'sass': { verbose: true }
    },
    marked: require('./test/marked'),
    handlebars: require('./test/handlebars')
  });
});

const gulp = require('gulp');
const mocha = require('gulp-mocha');

gulp.task('test:unit', function() {
  return gulp.src('test/unit', {read: false})
             .pipe(mocha({require: 'esm', reporter: 'dot'}));
});

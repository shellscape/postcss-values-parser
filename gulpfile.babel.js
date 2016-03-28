import gulp from 'gulp';

gulp.task('lint', () => {
  let eslint = require('gulp-eslint');
  return gulp.src(['*.js', 'lib/*.es6', 'test/*.es6'])
          .pipe(eslint())
          .pipe(eslint.format())
          .pipe(eslint.failAfterError());
});

gulp.task('test', ['lint'], () => {
  require('babel-core/register')({ extensions: ['.es6'] });

  let mocha = require('gulp-mocha');

  return gulp.src([
    'test/*.es6',
    '!test/parser.es6',
    '!test/tokenize.es6'
  ], { read: false }).pipe(mocha());
});

gulp.task('clean', ['test'], () => {
  let del = require('del');
  return del(['dist/']);
});

gulp.task('build', ['clean'], () => {
  let babel = require('gulp-babel');
  return gulp.src('lib/*.es6')
          .pipe(babel())
          .pipe(gulp.dest('dist/'));
});

gulp.task('default', ['test']);

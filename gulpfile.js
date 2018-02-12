'use strict';

const eslint = require('gulp-eslint');
const gulp = require('gulp');
const mocha = require('gulp-mocha');

gulp.task('lint', () => {
  let glob = [
    '*.js',
    'lib/*.js',
    'test/*.js'
  ];

  return gulp.src(glob)
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('test', ['lint'], () => {
  let glob = [
    'test/*.js',
    '!test/parser.js',
    '!test/tokenize.js'
  ];

  return gulp.src(glob, { read: false })
    .pipe(mocha());
});

gulp.task('default', ['test']);

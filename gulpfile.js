var browserify = require('browserify');
var gulp = require('gulp');
var source = require("vinyl-source-stream");
var reactify = require('reactify');
var watchify = require('watchify');

var bundler = watchify(browserify('./scripts/main.js', watchify.args));
bundler.transform(reactify);

gulp.task('js', bundle);
bundler.on('update', bundle);

function bundle() {
  console.log('Bundling...');
  return bundler.bundle()
    .pipe(source('main.js'))
    .pipe(gulp.dest('./public/scripts'));
}

var browserify = require('browserify');
var gulp = require('gulp');
var source = require("vinyl-source-stream");
var reactify = require('reactify');
var watchify = require('watchify');
var streamify = require('gulp-streamify');
var uglify = require('gulp-uglify');

// Bundle once
gulp.task('build', function() {
    return bundleWith(getBundler());
});

// Watch for file changes then bundle
gulp.task('watch', function() {
    var watchedBundler = watchify(getBundler());
    watchedBundler.on('update', function() {
        return bundleWith(watchedBundler);
    });
    return bundleWith(watchedBundler);
});

// Returns an unwatched bundler
function getBundler() {
    var bundler = browserify('./scripts/main.js', watchify.args);
    bundler.transform(reactify);
    return bundler;
}

// Bundles files with the provided bundler
function bundleWith(bundler) {
  console.log('Bundling...');
  return bundler.bundle()
    .pipe(source('main.js'))
    .pipe(streamify(uglify()))
    .pipe(gulp.dest('./public/scripts'));
}

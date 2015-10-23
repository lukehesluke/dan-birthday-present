var fs = require('fs');
var gulp = require('gulp');
var browserify = require('browserify');
var babelify = require('babelify');

var PATHS = {
    js: {
        src: './src/contentScript.js',
        dist: './dist/dan-birthday-present/contentScript.js'
    }
};

var buildJs = function() {
    (browserify({debug: true})
        .transform(babelify)
        .require(PATHS.js.src, {entry: true})
        .bundle()
        .on('error', function(err) { console.log('Error:', err.message); })
        .pipe(fs.createWriteStream(PATHS.js.dist))
    );
};

var build = function() {
    buildJs();
}

var watch = function() {
    build();
    gulp.watch(PATHS.js.src, ['build']);
};

gulp.task('build', build);
gulp.task('watch', watch);
gulp.task('default', ['watch']);

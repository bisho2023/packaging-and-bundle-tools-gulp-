const gulp = require("gulp");
const {src} = require("gulp")
const {dest} = require("gulp")
const {watch} = require("gulp")
const {parallel} = require("gulp")
const {series} = require("gulp")


var globs={
  h:"project/*.html", c:"project/css/**/*.css", i:'project/pics/*', j:'project/js/**/*.js'
}
const imagemin = require('gulp-imagemin');


function imageMinify() {
    return gulp.src(globs.i).pipe(imagemin()).pipe(gulp.dest('dist/images'));
}

const htmlmin = require('gulp-htmlmin');

function minifyHTML() {
    return src(globs.h).pipe(htmlmin({ collapseWhitespace: true, removeComments: true })).pipe(gulp.dest('dist'))
}


const concat = require('gulp-concat');
const terser = require('gulp-terser');

function javaScriptMinify() {

    return src(globs.j,{sourcemaps:true}) 

        .pipe(concat('all.min.js')).pipe(terser()).pipe(dest('dist/assets/js',{sourcemaps:'.'}))
}


var cleanCss = require('gulp-clean-css');
function cssMinify() {
    return src(globs.c)
        .pipe(concat('style.min.css')).pipe(cleanCss()).pipe(dest('dist/assets/css'))
}

var browserSync = require('browser-sync');
function serve (cb){
  browserSync({
    server: {
      baseDir: 'dist/'
    }
  });
  cb()
}

function reloadTask(done) {
  browserSync.reload()
  done()
}

function watchTask() {
    watch(globs.h,series(minifyHTML, reloadTask))
    watch(globs.j,series(javaScriptMinify, reloadTask))
    watch(globs.c, series(cssMinify,reloadTask));
    watch(globs.i, series(imageMinify,reloadTask));
}
exports.default = series( parallel(imageMinify, javaScriptMinify, cssMinify, minifyHTML), serve , watchTask)





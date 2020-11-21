// var gulp = require('gulp');
// var sass = require('gulp-sass');
// var sourcemaps = require('gulp-sourcemaps');

// gulp.task('sass', function() {
//   return gulp.src('assets/scss/**/*.scss') // Gets all files ending with .scss in app/scss
//     .pipe(sourcemaps.init())
//     .pipe(sass())
//     .pipe(sourcemaps.write())
//     .pipe(gulp.dest('assets/css'))
// });

// gulp.task('watch', ['sass'], function (){
//   gulp.watch('assets/scss/**/*.scss', ['sass']); 
// });

// Yay for Gulp 4 breaking everything!

const gulp = require('gulp');
const sass = require('gulp-sass');
const browserSync = require('browser-sync').create();

//compile scss into css
function style() {
    return gulp.src('assets/scss/**/*.scss')
    .pipe(sass().on('error',sass.logError))
    .pipe(gulp.dest('assets/css'))
    .pipe(browserSync.stream());
}

function watch() {

  browserSync.init({
      // server: {
      //    baseDir: "./",
      //    index: "/index.html"
      // }
      proxy: "http://localhost:8081"
  });

  gulp.watch('assets/scss/**/*.scss', style)
  gulp.watch('./*.html').on('change',browserSync.reload);
  // gulp.watch('./js/**/*.js').on('change', browserSync.reload);
}

exports.style = style;
exports.watch = watch;
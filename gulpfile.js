var gulp = require('gulp');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');

gulp.task('sass', function() {
  return gulp.src('assets/scss/**/*.scss') // Gets all files ending with .scss in app/scss
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('assets/css'))
});

gulp.task('watch', ['sass'], function (){
  gulp.watch('assets/scss/**/*.scss', ['sass']); 
});
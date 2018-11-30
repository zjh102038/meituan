var gulp = require('gulp')
var sass = require('gulp-sass')
gulp.task('devSass', function() {
    return gulp.src('./scss/index.scss')
        .pipe(sass())
        .pipe(gulp.dest('./css'))
})
gulp.task('watch', function() {
    return gulp.watch('./scss/index.scss', gulp.series('devSass'))
})
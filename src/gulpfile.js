var gulp = require('gulp')

var sass = require('gulp-sass')
var minCss = require('gulp-clean-css')
var uglify = require('gulp-uglify')
    //编译scss
gulp.task('devSass', function() {
        return gulp.src('./scss/index.scss')
            .pipe(sass())
            .pipe(minCss())
            .pipe(gulp.dest('./css'))
    })
    //监听
gulp.task('watch', function() {
        return gulp.watch('./scss/index.scss', gulp.series('devSass'))
    })
    //起服务
gulp.task('server', function() {
        return gulp.src('src')
            .pipe(server({
                port: 5555,
                middleware: function(req, res, next) {

                }
            }))
    })
    //开发环境
gulp.task('dev', gulp.series('devSass', 'watch'))
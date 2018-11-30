var gulp = require('gulp');

var sass = require('gulp-sass');

var autoprefixer = require('gulp-autoprefixer');

var minCss = require('gulp-clean-css');

var concat = require('gulp-concat');

var uglify = require('gulp-uglify');

var server = require('gulp-webserver');

var babel = require('gulp-babel');

var htmlmin = require('gulp-htmlmin');

var url = require('url');

var fs = require('fs');

var path = require('path');

var list = require('./mock/list.json');

// gulp.task('scss',function(){
//     // return gulp.src('./src/**/*.html')
//     // return gulp.src('./src/images/*.{jpg,png}')
//     // ./build/js/**/*.js
//     return gulp.src(['./src/js/**/*.js','!./src/js/libs/*.js'],{base:'./src'})
//     .pipe(gulp.dest('./build'))
// })

//开发编译scss
gulp.task('devScss',function(){
    return gulp.src('./src/scss/*.scss')
    .pipe(sass())
    .pipe(autoprefixer({browsers: ['last 2 versions']}))
    // .pipe(concat('all.css'))
    .pipe(minCss())
    .pipe(gulp.dest('./src/css'))
})



//监听
gulp.task('watch',function(){
    return gulp.watch('./src/scss/*.scss',gulp.series('devScss'))
})

//起服务
gulp.task('server',function(){
    return gulp.src('build')
    .pipe(server({
        port:9090,  //配置端口
        // open:true   //自动打开浏览器
        // livereload:true  //自动刷新浏览器
        host:'169.254.204.130',  //配置ip
        // fallback:'demo.html'//指定默认打开的文件
        middleware:function(req,res,next){ //拦截前端请求
            //ajax请求  文件
            var pathname = url.parse(req.url).pathname;


           if(pathname === '/api/list'){
                res.end(JSON.stringify({code:1,data:list}))
           }else{
                pathname = pathname === '/' ? 'index.html' : pathname;

                console.log(pathname);

                res.end(fs.readFileSync(path.join(__dirname,'build',pathname)));
           }
            
            
        }
    }))
})

//开发环境
gulp.task('dev',gulp.series('devScss','server','watch'))

//压缩js  build
gulp.task('bUglify',function(){
    return gulp.src(['./src/js/**/*.js','!./src/js/libs/*.js'])
    .pipe(babel({
        presets: ['@babel/env']
    }))
    .pipe(uglify())
    .pipe(gulp.dest('./build/js'))
})

//copy js
gulp.task('copyLibs',function(){
    return gulp.src('./src/js/libs/*.js')
    .pipe(gulp.dest('./build/js/libs'))
})

//线上 css
gulp.task('bCss',function(){
    return gulp.src('./src/css/*.css')
    .pipe(gulp.dest('./build/css'))
})

//html

gulp.task('bHtml',function(){
    return gulp.src('./src/**/*.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('./build'))
})

//线上环境

gulp.task('build',gulp.parallel('bUglify','copyLibs','bCss','bHtml'))
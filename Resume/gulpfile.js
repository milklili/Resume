//gulpfile.js 示例文件
//导入你所需要用的工具包 require，导入之前要先下载对应的插件，插件下载后会生成node_modules，这些插件都放在了里面
var gulp = require('gulp');
    uglify = require('gulp-uglify');// js 压缩
    filter = require('gulp-filter'), // 过滤筛选指定文件
    cached = require('gulp-cached'), // 缓存当前任务中的文件，只让已修改的文件通过管道
    rename = require('gulp-rename'), // 重命名
    imagemin = require('gulp-imagemin');// 图片优化
    cssnano = require('gulp-clean-css');// CSS 压缩
    browserSync = require('browser-sync'), // 保存自动刷新
    livereload=require('gulp-livereload');// 自动刷新页面

// css （拷贝 *.min.css，常规 CSS 则输出压缩与未压缩两个版本）
gulp.task('css', function() {
  return gulp.src('css/**/*.css')
    .pipe(gulp.dest('dist/css')) // 把管道里的所有文件输出到 dist/css 目录
    .pipe(filter(['**/*', '!**/*.min.css'])) // 筛选出管道中的非 *.min.css 文件
    .pipe(gulp.dest('dist/css')) // 把处理过的 css 输出到 dist/css 目录
    .pipe(rename({suffix: '.min'}))
    .pipe(cssnano())
    .pipe(gulp.dest('dist/css'))
});

// styleReload （结合 watch 任务，无刷新CSS注入）
gulp.task('styleReload', ['css'], function() {
  return gulp.src(['dist/css/**/*.css'])
    .pipe(cached('style'))
    .pipe(browserSync.reload({stream: true})); // 使用无刷新 browserSync 注入 CSS
});


// image
gulp.task('image', function() {
  return gulp.src('img/*.{jpg,jpeg,png,gif}')
    .pipe(cached('image'))
    .pipe(imagemin({optimizationLevel: 3, progressive: true, interlaced: true, multipass: true}))
    // 取值范围：0-7（优化等级）,是否无损压缩jpg图片，是否隔行扫描gif进行渲染，是否多次优化svg直到完全优化
    .pipe(gulp.dest('dist/img'))
});

// build，关连执行全部编译任务
gulp.task('build', ['css', 'image'], function () {
  
});
 
// default 默认任务
gulp.task('default', ['build']);

//watch 监听文件,开启本地服务器并监听
gulp.task('watch',function(){

    browserSync.init({
        server: {
        baseDir: 'dist' // 在 dist 目录下启动本地服务器环境，自动启动默认浏览器
        }
    });

    
    // 监控 CSS 文件，有变动则执行CSS注入
    gulp.watch('css/**/*.css', ['styleReload']);
    // 监控图片文件，有变动则执行 image 任务
    gulp.watch('img/*', ['image']);
    // 监控 dist 目录下除 css 目录以外的变动（如js，图片等），则自动刷新页面
    gulp.watch(['dist/**/*', '!dist/css/**/*']).on('change', browserSync.reload);
});
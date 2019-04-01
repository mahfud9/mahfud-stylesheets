var gulp = require('gulp');
var gulpMinifyCss = require('gulp-minify-css');
var gulpConcat = require('gulp-concat');
var gulpUglify = require('gulp-uglify');
var gulpHtmlmin = require('gulp-htmlmin');
var gulpConnect = require('gulp-connect');
var clean = require('gulp-clean');
var gulpSequence = require('gulp-sequence');
var sass = require('gulp-sass');
var image = require('gulp-image');
const autoprefixer = require('gulp-autoprefixer');

//autoprefixer
gulp.task('default', () =>
    gulp.src('src/app.css')
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('dist'))
);
//end autoprefixer

//images
gulp.task('img', function () {
 gulp.src('./src/img/*')
   .pipe(image())
   .pipe(gulp.dest('./dist/img'));
});
//end images

//main.css
gulp.task('sass', function () {
gulp.src('./src/scss/*.scss')
.pipe(sass().on('error', sass.logError))
.pipe(gulpConcat('main.css'))
.pipe(gulp.dest('./src/css/'));
});

gulp.task('minify-css', function() {
 gulp.src('./src/css/*.css')
   .pipe(gulpMinifyCss({
     compatibility: 'ie8'
   }))
   .pipe(gulpConcat('main.css'))
   .pipe(gulp.dest('./dist/css'));
});
//end main.css


//main.js
gulp.task('minify-js', function() {
 gulp
   .src([
     './src/js/*.js'
   ])
   .pipe(gulpConcat('main.js'))
   .pipe(gulpUglify())
   .pipe(gulp.dest('./dist/js'));
});
//end main.js

//slick
gulp.task('minify-slickcss', function() {
 gulp.src('./src/slick/*.css')
   .pipe(gulpMinifyCss({
     compatibility: 'ie8'
   }))
   .pipe(gulp.dest('./dist/slick'));
});

gulp.task('minify-slickjs', function() {
 gulp
   .src([
     './src/slick/*.js'
   ])
   .pipe(gulpUglify())
   .pipe(gulp.dest('./dist/slick'));
});
//end slick

//index.html
gulp.task('minify-html', function() {
 gulp.src('src/index.html')
   .pipe(gulpHtmlmin({
     collapseWhitespace: true
   }))
   .pipe(gulp.dest('dist'));
});
//end index.html



gulp.task('server', function() {
 gulpConnect.server({
   root: 'src',
   livereload: true
 });
});

gulp.task('watch', function() {
 gulp.watch('./src/js/*.js', ['minify-js']);
 gulp.watch('./src/css/*.css', ['minify-css']);
 gulp.watch('./src/*.html', ['minify-html']);
 gulp.watch('./src/scss/*.scss', ['sass']);
});



gulp.task('default', ['watch', 'server']);

gulp.task('clean', function() {
 return gulp.src('dist', {
   read: false
 })
   .pipe(clean());
});

gulp.task('build', gulpSequence('clean','img', 'sass', 'minify-css', 'minify-js', 'minify-slickcss', 'minify-slickjs', 'minify-html'));
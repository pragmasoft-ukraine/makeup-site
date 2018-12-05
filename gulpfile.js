/* Needed gulp config */

var gulp = require('gulp');  
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var notify = require('gulp-notify');
var minifycss = require('gulp-minify-css');
var concat = require('gulp-concat');
var plumber = require('gulp-plumber');
var clean = require('gulp-clean');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');

/* Setup scss path */
var paths = {
    scss: './sass/*.scss'
};

/* HTML task */
gulp.task('html', function () {
    gulp.src('src/*.html')
        .pipe(gulp.dest('build'));
});

/* Images task */
gulp.task('images', () =>
    gulp.src('src/img/*')
        .pipe(gulp.dest('build/img'))
);

/* Fonts task */
gulp.task('fonts', () =>
    gulp.src('src/fonts/**')
        .pipe(gulp.dest('build/fonts'))
);

/* Scripts task */
gulp.task('scripts', function() {
  return gulp.src([
    /* Add your JS files here, they will be combined in this order */
    'node_modules/jquery/dist/jquery.min.js',
    'node_modules/jquery.easing/jquery.easing.min.js',
    'node_modules/jquery.stellar/jquery.stellar.js',
    'node_modules/bootstrap/dist/js/bootstrap.min.js',
    'node_modules/waypoints/lib/jquery.waypoints.min.js',
    'node_modules/magnific-popup/dist/jquery.magnific-popup.min.js',
    ])
    .pipe(concat('scripts.js'))
    .pipe(gulp.dest('build/js'))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest('build/js'));
});

gulp.task('minify-custom', function() {
  return gulp.src([
    /* Add your JS files here, they will be combined in this order */
    'src/js/custom.js'
    ])
    .pipe(gulp.dest('build/js'))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest('build/js'));
});

/* Sass task */
gulp.task('sass', function () {  
    gulp.src('src/scss/style.scss')
    .pipe(plumber())
    .pipe(sass({
      errLogToConsole: true,

      //outputStyle: 'compressed',
      // outputStyle: 'compact',
      // outputStyle: 'nested',
      outputStyle: 'expanded',
      precision: 10
    }))

    .pipe(sourcemaps.init())
    .pipe(autoprefixer({
        browsers: ['last 2 versions'],
        cascade: false
    }))
    .pipe(gulp.dest('build/css'))

    .pipe(rename({suffix: '.min'}))
    .pipe(minifycss())
    .pipe(gulp.dest('build/css'))
    /* Reload the browser CSS after every change */
    .pipe(browserSync.stream());
});

gulp.task('merge-styles', function () {

    return gulp.src([
        'src/css/vendor/animate.css',
        // 'node_modules/animate.css/animate.min.css',
        'node_modules/bootstrap/dist/css/bootstrap.min.css',
        'node_modules/magnific-popup/dist/magnific-popup.css',
        'node_modules/icomoon/style.css',
        ])
        // .pipe(sourcemaps.init())
        // .pipe(autoprefixer({
        //     browsers: ['last 2 versions'],
        //     cascade: false
        // }))
        .pipe(concat('styles-merged.css'))
        .pipe(gulp.dest('build/css'))
        // .pipe(rename({suffix: '.min'}))
        // .pipe(minifycss())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('build/css'))
        .pipe(reload({stream:true}));
});

/* Prepare Browser-sync for localhost */
gulp.task('browser-sync', function() {
    browserSync.init(['build/css/*.css', 'build/js/*.js', "build/*.html"], {

        server: {
            baseDir: 'build'
        }

    });
});

gulp.task('build', ['html', 'fonts', 'images', 'sass', 'merge-styles', 'scripts', 'minify-custom']);

/* Watch scss, js and html files, doing different things with each. */
gulp.task('default', ['build', 'browser-sync'], function () {
    /* Watch scss, run the sass task on change. */
    gulp.watch(['src/scss/*.scss', 'src/scss/**/*.scss'], ['sass']);
    /* Watch app.js file, run the scripts task on change. */
    gulp.watch(['src/js/custom.js'], ['minify-custom']);
    /* Watch .html files, run the html task on change. */
    gulp.watch(['src/*.html'], ['html']);
});

/* Clean task */
gulp.task('clean', function () {
    return gulp.src('build', {read: false})
        .pipe(clean());
});
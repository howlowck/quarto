var gulp = require('gulp'),
    sass = require('gulp-ruby-sass'),
    minify = require('gulp-minify-css'),
    util = require('gulp-util'),
    livereload = require('gulp-livereload'),
    browserify = require('gulp-browserify'),
    autoprefixer = require('gulp-autoprefixer'),
    notify = require('gulp-notify'),
    rename = require('gulp-rename'),
    lr = require('tiny-lr'),
    server = lr();

function extractSassError($string) {
    patt = /(line \d+).*\/(\w+\.scss)/;
    match = patt.exec($string);
    return {file: match[2], line: match[1]};
}

gulp.task('sass', function () {
    gulp.src('public/css/*.scss')
        .pipe(sass())
        .on('error', notify.onError(function (error) {
            util.beep();
            util.log('error', util.colors.red(error.message));
            var info = extractSassError(error.message);
            return info.file + ' on ' + info.line;
        }))
        .pipe(autoprefixer("last 4 versions"))
        .pipe(gulp.dest('./public/css/build'))
        .pipe(minify())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('./public/css/build'))
        .pipe(livereload(server));
});

gulp.task('browserify', function () {
    gulp.src('./public/js/*.js')
        .pipe(browserify({
            shim: {
                jquery: {
                    path: './public/assets/jquery/jquery.min.js',
                    exports: '$'
                },
                underscore: {
                    path: './public/assets/underscore/underscore-min.js',
                    exports: '_'
                },
                backbone: {
                    path: './public/assets/backbone/backbone-min.js',
                    exports: 'Backbone',
                    depends: {
                        jquery: '$',
                        underscore: '_'
                    }
                }
            }
        }))
        .pipe(gulp.dest('./public/js/build'))
        .pipe(livereload(server));
});

gulp.task('default', function () {
    gulp.run('sass');
    gulp.run('browserify');

    server.listen(35729, function (error) {
        gulp.watch('./public/css/**/*.scss', function (evt) {
            gulp.run('sass');
        });

        gulp.watch(['./public/js/**/*.js', '!./public/js/build/**/*'], function () {
            gulp.run('browserify');
        });

        gulp.watch(['./app/**/*', '!./app/storage/**/*'], function (evt) {
            gulp.run(function () {
                gulp.src(evt.path)
                    .pipe(livereload(server));
            });
        })
    });
});

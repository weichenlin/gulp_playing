var gulp = require('gulp');
var ejs = require("gulp-ejs");

gulp.task('ejs_only', function() {
    return gulp.src(['ejs_only/*.txt'])
        .pipe(ejs({
            'data_1': "I have a pen",
            'data_2': "I have a bird"
        }))
        .pipe(gulp.dest('ejs_only/output'));
});


var data = require('gulp-data');

gulp.task('ejs_data', function() {
    return gulp.src(['ejs_data/*.txt'])
        .pipe(data(function(file) {
            if (file.path.endsWith("ejs_data/data_1.txt")) {
                return {'data': "I have a pen"}
            } else if (file.path.endsWith("ejs_data/data_2.txt")) {
                return {'data': "I have a bird"};
            }
        }))
        .pipe(ejs())
        .pipe(gulp.dest('ejs_data/output'));
});


var frontMatter = require('gulp-front-matter');

gulp.task('ejs_fm', function() {
    return gulp.src(['ejs_fm/*.txt'])
        .pipe(frontMatter({
            property: 'data',
            remove: false
        }))
        .pipe(ejs())
        .pipe(gulp.dest('ejs_fm/output'));
});

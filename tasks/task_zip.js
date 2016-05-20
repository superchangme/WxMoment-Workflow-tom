var zip = require('gulp-zip');
var util = require('./lib/util');

module.exports = function (gulp, config) {

    gulp.task('zip', ['build_dist2'], function (cb) {
        gulp.src('./dist/**/*')
            .pipe(zip(config.projectName + '.zip'))
            .pipe(gulp.dest('./'))
            .on('end', function () {
                util.load_plugin('zip');
                cb();
            });
    });
};

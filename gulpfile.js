var gulp = require('gulp');
var minifyHtml = require('gulp-minify-html');
var cleanCss = require('gulp-clean-css');
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin');
var gulpif = require('gulp-if');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var minimist = require('minimist');
var path = require('path');
var tap = require('gulp-tap');
var notify = require('gulp-notify');
var rev = require('gulp-rev');
var revCollector = require('gulp-rev-collector');
var clean = require('gulp-clean');
var sequence = require('gulp-sequence');
var changed = require('gulp-changed');

var srcPath = "src";
var buildPath = "static";
var templatebuildPath = "template";
var revPath = "rev";
var jsRevPath = revPath + "/js";
var cssRevPath = revPath + "/css";
var allRevPath = revPath + '/**/*.json';
var imageSrcPath = srcPath + "/images/**/*.*";
var imageBuildPath = buildPath + "/images";
var jsSrcPath = srcPath + "/js/**/*.*";
var jsBuildPath = buildPath + "/js";
var cssSrcPath = srcPath + "/css/**/*.*";
var cssBuildPath = buildPath + "/css";
var viewSrcPath = srcPath + "/views/**/*.*";
var fontsSrcPath = srcPath + "/fonts/**/*.*";
var fontsBuildPath = buildPath + "/fonts";
var profilesPath = srcPath + "/profiles";
var profileJSName = '';
var knownOptions = {string: 'profiles', default: {profiles: process.env.NODE_ENV || 'dev'}};
var profiles = minimist(process.argv.slice(2), knownOptions).profiles;
var COMPRESS_PROFILES = ['uat', 'prod'];
var ONLINE_PROFILES = ['test', 'uat', 'prod'];

function isCompress() {
    return (COMPRESS_PROFILES.indexOf(profiles) > -1) && ['**/*.js','**/*.css','**/*.ejs','**/*.json'];
}

function isReplace() {
    return ONLINE_PROFILES.indexOf(profiles) > -1;
}

gulp.task('clean', function () {
    return gulp.src([buildPath, revPath,templatebuildPath], {read: false})
        .pipe(clean({force: true}))
        .pipe(notify({
            message: "clean <%= file.path %> directory success",
            notifier: function (options) {}
        }));
});

gulp.task('image', function () {
    return gulp.src(imageSrcPath)
        .pipe(changed(imageBuildPath))
        .pipe(gulpif(isCompress(), imagemin()))
        .pipe(gulp.dest(imageBuildPath))
        .pipe(gulpif(isCompress(), notify({
            message: "compress <%= file.path %> success",
            notifier: function (options) {}
        })));
});

gulp.task('jshint', function () {
    return gulp.src(jsSrcPath)
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(notify({
            message: "check <%= file.path %> success",
            notifier: function (options) {}
        }));
});

gulp.task('js', function () {
    return gulp.src(jsSrcPath)
        .pipe(changed(jsBuildPath))
        .pipe(gulpif(isCompress(), rev()))
        .pipe(gulpif(isCompress(), uglify()))
        .pipe(gulp.dest(jsBuildPath))
        .pipe(gulpif(isCompress(), notify({
            message: "compress <%= file.path %> success",
            notifier: function (options) {}
        })))
        .pipe(gulpif(isCompress(), rev.manifest()))
        .pipe(gulpif(isCompress(), gulp.dest(jsRevPath)));
});

gulp.task('css', function () {
    return gulp.src(cssSrcPath)
        .pipe(changed(cssBuildPath))
        .pipe(gulpif(isCompress(), rev()))
        .pipe(gulpif(isCompress(), cleanCss()))
        .pipe(gulp.dest(cssBuildPath))
        .pipe(gulpif(isCompress(), notify({
            message: "compress <%= file.path %> success",
            notifier: function (options) {}
        })))
        .pipe(gulpif(isCompress(), rev.manifest()))
        .pipe(gulpif(isCompress(), gulp.dest(cssRevPath)));
});
gulp.task('fonts', function () {
    return gulp.src(fontsSrcPath)
        .pipe(gulp.dest(fontsBuildPath))
        .pipe(gulpif(isCompress(), notify({
            message: "compress <%= file.path %> success",
            notifier: function (options) {}
        })));
});

gulp.task('view', function () {
    return gulp.src([allRevPath, viewSrcPath])
        .pipe(gulpif(isCompress(), revCollector({replaceReved: true})))
        .pipe(gulp.dest(templatebuildPath))
        .pipe(gulpif(isCompress(), notify({
            message: "compress <%= file.path %> success",
            notifier: function (options) {}
        })));
});

gulp.task('profiles-replace', function () {
    return gulp.src(jsBuildPath + '/profiles*.js')
        .pipe(gulpif(isReplace(), clean({force: true})))
        .pipe(gulpif(isReplace(), tap(function (file) {
            profileJSName = path.basename(file.path);
        })))
        .pipe(gulpif(isReplace(), notify({
            message: "delete <%= file.path %> success",
            notifier: function (options) {}
        })));
});

gulp.task('profiles', ['profiles-replace'], function () {
    return gulp.src(profilesPath + '/' + profiles + '/profiles.js')
        .pipe(gulpif(isCompress(), uglify()))
        .pipe(gulpif(isCompress(), rename(profileJSName)))
        .pipe(gulpif(isReplace(), notify({
            message: "replace <%= file.path %> success",
            notifier: function (options) {}
        })))
        .pipe(gulp.dest(jsBuildPath))
        .pipe(gulpif(isCompress(), notify({
            message: "compress <%= file.path %> success",
            notifier: function (options) {}
        })));
});

gulp.task('watch',function () {
    gulp.watch(jsSrcPath,['js']);
    gulp.watch(cssSrcPath,['css']);
    gulp.watch(imageSrcPath,['image']);
    gulp.watch(viewSrcPath,['view']);
});

gulp.task('default', sequence('clean', ['js', 'image', 'css','fonts'],'view'));

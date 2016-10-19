// load modules
var gulp = require('gulp');
var concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var scss = require('gulp-sass');
var rename = require('gulp-rename');
var webpack = require('webpack-stream');

var vendors = [
	'./vendor/jquery/jquery-3.1.1.min.js',
	'./vendor/masonry/masonry.pkgd.min.js',
	'./vendor/fastclick/fastclick.min.js'
];


// build vendor files
gulp.task('vendor', function(){
	gulp.src(vendors)
		.pipe(concat('vendor.js', { newLine: '\n\n' }))
		.pipe(gulp.dest('./assets/dist/js'));
});


// build scss
gulp.task('scss', function(){
	gulp.src('./assets/src/scss/app.scss')
		.pipe(sourcemaps.init())
		.pipe(scss({
			//outputStyle : 'compact'
			outputStyle: 'compressed'
		}).on('error', scss.logError))
		.pipe(sourcemaps.write('maps'))
		.pipe(gulp.dest('./assets/dist/css'));
});
gulp.task('scss:watch', function(){
	gulp.watch('./assets/src/scss/*.scss', ['scss']);
});


// build app
gulp.task('js', function() {
	return gulp.src('./assets/src/js/App.js')
		.pipe(
			webpack(
				require('./webpack.config.js')
			)
		)
		.pipe(gulp.dest('./assets/dist/js/'));
});
// load modules
const gulp = require('gulp');
const concat = require('gulp-concat');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');
const scss = require('gulp-sass');
const rename = require('gulp-rename');
const webpack = require('webpack-stream');
const imagemin = require('gulp-imagemin');

const vendors = [
	'./vendor/jquery/jquery-3.1.1.min.js',
	'./vendor/masonry/masonry.pkgd.min.js',
	'./vendor/fastclick/fastclick.min.js'
];


// build vendor files
gulp.task('vendor', () => {
	gulp.src(vendors)
		.pipe(concat('vendor.js', { newLine: '\n\n' }))
		.pipe(gulp.dest('./assets/dist/js'));
});


// build scss
gulp.task('scss', () => {
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
gulp.task('js', () => {
	return gulp.src('./assets/src/js/App.js')
		.pipe(
			webpack( require('./webpack.config.js') )
		)
		.pipe(gulp.dest('./assets/dist/js/'));
});


// minify images
gulp.task('minify-images', () => {
	gulp.src('assets/src/img/*')
		.pipe(imagemin())
		.pipe(gulp.dest('assets/dist/img'));
});

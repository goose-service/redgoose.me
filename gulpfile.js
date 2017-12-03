const gulp = require('gulp');
const rollup = require('rollup');
const uglify = require('rollup-plugin-uglify');
const babel = require('rollup-plugin-babel');
const shell = require('shelljs');
const scss = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');


// make vendors
async function makeVendors()
{
	try
	{
		// remove vendors
		shell.rm('-rf', 'dist');
		shell.mkdir('-p', 'dist');
		shell.mkdir('-p', 'dist/vendors');
		// copy jquery
		shell.cp('-R', 'node_modules/jquery/dist/jquery.min.js', 'dist/vendors/');
		shell.cp('-R', 'node_modules/masonry-layout/dist/masonry.pkgd.min.js', 'dist/vendors/');
		console.log('Complete make vendors');
	}
	catch(e)
	{
		console.error(e);
	}
	return null;
}

// build javascript
async function build_js(minify=false)
{
	try {
		// javascript
		const bundle = await rollup.rollup({
			input: 'src/js/redgoose.js',
			plugins: [
				babel(),
				minify && uglify()
			],
			external: ['jQuery', 'Masonry'],
		});
		bundle.write({
			file: 'dist/redgoose.js',
			format: 'umd',
			name: 'Redgoose',
			sourcemap: !minify,
			globals: { jQuery: '$', Masonry: 'Masonry' },
		});
	}
	catch(e)
	{
		console.error(e);
		return new Error(e);
	}
}

// build css
async function build_css(minify=false)
{
	try {
		// scss
		gulp.src(`src/scss/redgoose.scss`)
			.pipe(sourcemaps.init())
			.pipe(scss({
				outputStyle: minify ? 'compressed' : 'compact'
			}).on('error', scss.logError))
			.pipe(sourcemaps.write(''))
			.pipe(gulp.dest('dist'));
	}
	catch(e)
	{
		console.error(e);
		return new Error(e);
	}
}


// watch
gulp.task('watch-js', function() {
	gulp.watch('./src/js/**/*.js', async function(e) {
		await build_js(false);
		console.warn(new Date());
		console.log(`${e.type} - ${e.path}`);
	});
});
gulp.task('watch-css', function() {
	gulp.watch('./src/scss/**/*.scss', async function(e) {
		await build_css(false);
		console.warn(new Date());
		console.log(`${e.type} - ${e.path}`);
	});
});


// build
gulp.task('build', async function() {
	await makeVendors();
	await build_js(true);
	await build_css(true);
	console.log('Complete build');
});


// make vendors
gulp.task('make-vendors', makeVendors);
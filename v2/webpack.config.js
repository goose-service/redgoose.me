module.exports = {
	watch: true,
	devtool: 'eval',
	resolve: {
		modulesDirectories: ['assets/src/js'],
		extensions: ['', '.js']
	},
	output: {
		filename: 'app.js'
	},
	externals: {
		'jquery': '$',
		'Masonry': 'Masonry',
		'FastClick': 'FastClick'
	},
	module: {
		loaders: [
			{
				test: /\.(js)$/,
				loader: 'babel-loader',
				exclude: /node_modules/,
				query: {
					presets: ['babel-preset-es2015']
				}
			}
		]
	}
};
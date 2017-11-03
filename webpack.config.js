const path = require('path')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')

const extractStyles = new ExtractTextPlugin('style.css')

module.exports = (env = {}) => ({
	devtool: env.prod ? 'source-map' : 'eval-source-map', // Generate sourcemap (more comprehensive, slower map for prod)
	entry: './src/script.js',
	module: {
		rules: [{
			test: /\.html$/, // Hypertext
			exclude: /node_modules/,
			use: [
				{
					loader: 'file-loader',
					query: {
						publicPath: './build',
						name: '[name].[ext]',
					},
				},
				'extract-loader',
				'html-loader'
			],
		}, {
			test: /\.js$/, // Scripts
			exclude: /node_modules/,
			loader: 'babel-loader',
			query: { presets: ['es2015'] },
		}, {
			test: /\.scss$/, // Styles
			exclude: /node_modules/,
			use: extractStyles.extract({
				fallback: 'style-loader',
				use: [{
					loader: 'css-loader', // Translate CSS into CommonJS
					options: { sourceMap: true },
				}, {
					loader: 'postcss-loader', // PostCSS processing
					options: {
						plugins: loader => [
							require('postcss-import')(), // Collapse imports
							require('postcss-cssnext')() // Handle future CSS syntax, autoprefixing
						],
						sourceMap: true,
					},
				}, {
					loader: 'sass-loader', // Compile SCSS to CSS
					options: { sourceMap: true },
				}],
			}),
		}, {
			test: /\.(png|svg|jpe?g|gif)$/,
			exclude: /node_modules/,
			use: [{
				loader: 'file-loader',
				options: {
					'name': '[name].[ext]',
				},
			}, {
				loader: 'image-webpack-loader',
				query: {
					quality: 90,
					mozjpeg: {
						progressive: true,
					},
					optipng: {
						optimizationLevel: 3,
					},
					gifsicle: {
						interlaced: false,
					},
					pngquant: {
						quality: '65-90',
						speed: 4,
					},
				},
			}],
		}],
	},
	target: 'web',
	output: {
		filename: 'script.js',
		path: path.resolve(__dirname, 'build'),
	},
	plugins: [
		new webpack.NoEmitOnErrorsPlugin(),
		new CleanWebpackPlugin(['build'], {
			'verbose': false,
		}),
		extractStyles
	],
})
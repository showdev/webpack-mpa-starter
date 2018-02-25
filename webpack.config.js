const path = require('path')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin')

const resolve = pathName => path.resolve(process.cwd(), pathName)

const paths = {
  dist: resolve('dist'),
}
module.exports = {
  entry: './src/index.js',
  output: {
    filename: '[name].js',
    path: paths.dist,
  },
  devServer: {
    open: true,
    overlay: true,
    contentBase: paths.dist,
    port: 3000,
  },
  module: {
    rules: [
      {
        test: /\.(html)$/,
        include: resolve('src/partials'),
        use: {
          loader: 'html-loader',
          options: {
            minimize: false,
            interpolate: true,
          },
        },
      },
      {
        test: /\.(html)$/,
        include: [resolve('src/index.html'), resolve('src/views')],
        use: [
          {
            loader: 'file-loader',
            options: { name: '[name].[ext]', output: paths.dist },
          },
          'extract-loader',
          {
            loader: 'html-loader',
            options: {
              minimize: false,
              interpolate: true,
            },
          },
        ],
      },
      /* Handle styles */

      {
        test: /\.(s*)css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader', 'sass-loader'],
        }),
      },
      /* Handle images */
      {
        test: /\.(gif|png|jpe?g|svg)$/i,
        use: [
          'file-loader',
          {
            loader: 'image-webpack-loader',
            options: {
              bypassOnDebug: true,
              mozjpeg: {
                progressive: true,
                quality: 65,
              },
            },
          },
        ],
      },
    ],
  },

  plugins: [
    new CleanWebpackPlugin(path.dist, { verbose: false }),
    new ExtractTextPlugin({ filename: 'app.bundle.css' }),
    new HtmlWebpackHarddiskPlugin(),
  ],
}

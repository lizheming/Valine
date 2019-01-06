const path = require('path');
const webpack = require('webpack');
const ROOT_PATH = path.resolve(__dirname);
const APP_PATH = path.resolve(ROOT_PATH, 'src');
let BUILD_PATH = path.resolve(ROOT_PATH, 'dist');


module.exports = {
  entry: {
    Valine: ['./src/style.scss', './src/index.js']
  },
  output: {
    path: BUILD_PATH,
    filename: '[name].react.min.js',
    library: 'Valine',
    libraryTarget: 'umd'
  },
  resolve: {
    alias: {
      'react': 'preact-compat',
      'react-dom': 'preact-compat'
    },
    extensions: ['.js', '.json', '.jsx', '.css', '.scss']
  },
  devtool: 'cheap-module-source-map',
  devServer: {
    hot: true,
    port: 8088,
    inline: true,
    host: '127.0.0.1',
    publicPath: '/dist/',
    compress: true,
    stats: 'errors-only', //只在发生错误时输出
    overlay: { //当有编译错误或者警告的时候显示一个全屏overlay
      errors: true,
      warnings: true,
    }
  },
  module: {
    rules: [{
      test: /\.jsx?$/,
      use: {
        loader: 'babel-loader',
        options: {
          cacheDirectory: true,
          compact: true
        }
      },
      exclude: /node_modules/
    }, {
      test: /\.scss$/,
      use: [
        'style-loader',
        'css-loader',
        'postcss-loader',
        'sass-loader'
      ]
    }, {
      test: /\.css$/,
      use: [
        'style-loader',
        'css-loader',
        'postcss-loader'
      ]
    }, {
      test: /\.(png|jpg|gif|svg)$/,
      use: ['url-loader?limit=1024*10']
      //loader: 'url-loader?limit=40000'
    }]
  },
  plugins: [
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        // 内嵌定义了但是只用到一次的变量
        collapse_vars: true,
        // 提取出出现多次但是没有定义成变量去引用的静态值
        reduce_vars: true,
        drop_console: true
      },
      sourceMap: false,
      uglifyOptions: {
        output: {
          // 删除所有的注释
          comments: false,
          beautify: false
        },
        safari10: true
      }
    })
  ]
}
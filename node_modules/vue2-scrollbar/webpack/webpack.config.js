
require('es6-promise').polyfill();

module.exports = {

  entry: __dirname + '/../src/js/main.js',

  output: {
    path: __dirname + '/../build',
    publicPath: '/build/',
    filename: 'build.js',
    chunkFilename: '[name]-[hash].js'
  },

  devServer: {
    hot: true,
    port: 8000,
    // historyApiFallback: true,
    // contentBase: "app/public/",
    publicPath: '/build/',
    stats: "errors-only"
  },

  module: {
    loaders: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
      },
      {
        test: /\.css$/,
        use: ['style-loader','css-loader']
      }
    ]
  }

};

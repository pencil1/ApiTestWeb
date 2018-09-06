var webpack = require('webpack');
var packagejson = require('./package.json');
var PROD = process.argv.indexOf('-p') >= 0;

console.log('building package version ' + packagejson.version)
module.exports = {
  entry: {
    'amap': __dirname + '/src/amap.js',
  },
  output: {
    libraryTarget: 'umd',
    library: ['echarts', '[name]'],
    path: __dirname + '/dist',
    filename: PROD ? 'echarts-[name].min.js' : 'echarts-[name].js'
  },
  externals: {
    'echarts': 'echarts'
  },
  devtool: PROD ? '#source-map' : '#eval-source-map',
  plugins: [
    new webpack.DefinePlugin({
      'process.env.VERSION': JSON.stringify(packagejson.version)
    })
  ]
};

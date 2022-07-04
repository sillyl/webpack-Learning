const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
  // entry: "./src/mian.js", //只有一个入口文件，单入口
  entry: { // 多入口
    app: './src/app.js',
    main: "./src/main.js"
  },
  output: {// 多输出
    path: path.resolve(__dirname, 'dist'),
    filename: "[name].js" //webpack 命名方式，[name]以文件名自己命名
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'public/index.html')
    })
  ],
  mode: "production"

}
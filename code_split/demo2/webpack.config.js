const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
  // entry: "./src/mian.js", //只有一个入口文件，单入口
  entry: { // 多入口（需要打包出去的文件成为chunk）
    app: './src/app.js',
    main: "./src/main.js"
  },
  output: {// 多输出（打包输出到成为bundle）
    path: path.resolve(__dirname, 'dist'),
    filename: "[name].js" //webpack 命名方式，[name]以文件名自己命名
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'public/index.html')
    })
  ],
  mode: "production",
  optimization: { //压缩代码 优化
    // 代码分割配置
    splitChunks: {
      chunks: "all", // 对所有模块都进行分割
      // 以下是默认值
      // minSize: 20000, // 20kb分割代码最小的大小
      // minRemainingSize: 0, // 类似于minSize，最后确保提取的文件大小不能为0
      // minChunks: 1, // 至少被引用的次数，满足条件才会代码分割
      // maxAsyncRequests: 30, // 按需加载时并行加载的文件的最大数量 //文件越多请求数量越大，设置30防止请求数量过大
      // maxInitialRequests: 30, // 入口js文件最大并行请求数量
      // enforceSizeThreshold: 50000, // 超过50kb一定会单独打包（此时会忽略minRemainingSize、maxAsyncRequests、maxInitialRequests）

      // 以上是公共配置
      //下面的配置会覆盖上卖弄相同的配置

      // cacheGroups: { // 组，哪些模块要打包到一个组
      //   defaultVendors: { // 组名 defaultVendors优先级高于
      //     test: /[\\/]node_modules[\\/]/, // 需要打包到一起的模块default的配置
      //     priority: -10, // 权重（越大越高）
      //     reuseExistingChunk: true, // 如果当前 chunk 包含已从主 bundle 中拆分出的模块，则它将被重用，而不是生成新的模块
      //   },
      //   default: { // 其他没有写的配置会使用上面的默认值
      //     minChunks: 2, // 这里的minChunks权重更大
      //     priority: -20,
      //     reuseExistingChunk: true,
      //   },
      // },
      // 修改配置
      cacheGroups: {
        // 组，哪些模块要打包到一个组
        // defaultVendors: { // 组名
        //   test: /[\\/]node_modules[\\/]/, // 需要打包到一起的模块
        //   priority: -10, // 权重（越大越高）
        //   reuseExistingChunk: true, // 如果当前 chunk 包含已从主 bundle 中拆分出的模块，则它将被重用，而不是生成新的模块
        // },
        default: {
          // 其他没有写的配置会使用上面的默认值
          minSize: 0, // 我们定义的文件体积太小了，所以要改打包的最小文件体积（默认20kb才会被打包，所以这里改成0大小就去打包）
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
      },
    },
  },
}
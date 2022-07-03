const path = require("path"); //node.js模块,用来处理路径问题‘
const ESLintPlugin = require('eslint-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
//就像 optimize-css-assets-webpack-plugin 一样，但在 source maps 和 assets 中使用查询字符串会更加准确，支持缓存和并发模式下运行。
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const terserWebpackPlugin = require("terser-webpack-plugin"); // 内置插件
// nodejs核心模块，直接使用
const os = require("os");
// cpu核数
const threads = os.cpus().length;
// 获取处理样式的Loaders
const getStyleLoaders = (preProcessor) => {
  return [
    MiniCssExtractPlugin.loader, //将css提取单独文件
    // style-loader将js 中 css 通过创建style标签添加html文件中生效
    "css-loader", //将css资源编译common.js 的模块到js中
    {
      loader: "postcss-loader",
      options: {
        postcssOptions: {
          plugins: [
            "postcss-preset-env", // 能解决大多数样式兼容性问题
          ],
        },
      },
    },
    preProcessor,
  ].filter(Boolean);
};

module.exports = {
  //入口
  entry: "./src/main.js", //相对路径
  output: {
    //文件输出路径
    //_dirname node.js变量,代表当前文件的文件目录
    path: path.resolve(__dirname, "../dist"), //绝对路径 path所有文件打包输出目录
    //文件名 入口文件(js文件)打包输出文件名
    // filename: "main.js",
    filename: "static/js/main.js",
    // 在打包前 将path 目录整个清空，重新打包；
    // 使用开发服务clean配置会失效
    clean: true //代替webpack4 引入的包：clean-webpack-plugin， 自动清空上次打包结果，每次自动更新打包内容
  },

  //加载器
  module: {
    rules: [
      // loader配置
      {
        oneOf: [
          {
            test: /\.css$/, //test检测xx文件，检测.css结尾的文件
            use: getStyleLoaders(), //use执行顺序是从右向左（从下向上）
          },
          {
            test: /\.less$/,
            // loader:MiniCssExtractPlugin.loader, //loader使用一个，use可以加载多个loader
            use: getStyleLoaders('less-loader'),//将less资源编译css文件
          },
          {
            test: /\.s[ac]ss$/,
            use: getStyleLoaders('sass-loader'),//将sass资源编译css文件
          },
          {
            test: /\.styl$/,
            use: getStyleLoaders('stylus-loader'),//将stylus资源编译css文件
          },
          {
            test: /\.(png|jpe?g|gif|webp|svg)$/,
            type: "asset",//相当于webpack4的url-loader, 会将原文件转base64输出
            parser: {
              dataUrlCondition: {
                maxSize: 10 * 1024 // 小于10kb的图片会被base64处理,优点：减少请求数量，缺点：体积会变大一些
              }
            },
            generator: { //输出图片文件路径 名称； ext文件扩展名（png/jpg等，query携带其他参数比如写background-url（‘xxx?query’）
              //[hash:10] hash值去前10位（防止图片文件名过长）
              filename: 'static/images/[hash:10][ext][query]'
            }
          },
          { //woff|woff2|ttf|eot|svg 其他文件配置
            test: /\.(ttf|woff2?｜mp3|mp4|avi)$/,
            type: "asset/resource",//相当于webpack4的file-loader 只会对原文件进行输出，不会对原文件转base64
            generator: { //输出图标（icon）文件路径
              //[hash:10] hash值去前10位（防止图片文件名过长）
              filename: 'static/media/[hash:10][ext][query]'
            }
          },
          {
            test: /\.(js|mjs|jsx|ts|tsx)$/,
            exclude: /(node_modules|bower_components)/, // 排除文件
            use: [
              {
                loader: "thread-loader", // 开启多进程
                options: {
                  worker: threads // 进程数量
                }
              },
              {
                loader: 'babel-loader',
                options: { // options里的内容可以在外层新建个文件 babel.config.js文件 使用module.exports={presets: ['@babel/preset-env']}
                  presets: ['@babel/preset-env'], // 智能预设，能够编译ES6语法
                  cacheDirectory: true, // 开启cache缓存
                  cacheCompression: false, // 关闭缓存文件压缩
                }
              }
            ]
          }
        ]
      }
    ]
  },

  //插件
  plugins: [
    // plugin配置
    new ESLintPlugin({
      context: path.resolve(__dirname, '../src'), // 指定检查文件的根目录
      // exclude: "node_modules", // 默认值
      cache: true, // 开启缓存
      cacheLocation: path.resolve(__dirname, "../node_modules/.cache/eslintCache"), // 缓存目录
      threads, //开启多进程和进程数量
    }),
    // new HtmlWebpackPlugin(), 单独这么写到会在dist下面生成一个index.html的文件，但是其他引入不会展示出来
    new HtmlWebpackPlugin({
      // template作用： 以public/index.html为模版，创建新的index.html文件
      // 新的文件特点： 1.结构和原来一致； 2.会自动引入打包资源 <script defer src="static/js/main.js"></script></head>
      template: path.resolve(__dirname, "../public/index.html")
    }),
    new MiniCssExtractPlugin(
      { filename: "static/css/main.css" }
    ),// 没有指定目录会生成在dist文件下 dist/main.csss
    // new CssMinimizerPlugin(),
    // // 当生产模式会默认开启TerserPlugin，但是我们需要进行其他配置，就要重新写了
    // new terserWebpackPlugin({
    //   parallel: threads  // 开启多进程
    // })
  ],

  // 压缩操作 和上面的 1，2功能相同
  //1.new CssMinimizerPlugin(),
  //2.new terserWebpackPlugin({
  //   parallel: threads  // 开启多进程
  // })
  optimization: {
    minimize: true,
    minimizer: [
      // css压缩也可以写到optimization.minimizer里面，效果一样的
      new CssMinimizerPlugin(),
      // 当生产模式会默认开启TerserPlugin，但是我们需要进行其他配置，就要重新写了
      new terserWebpackPlugin({
        parallel: threads // 开启多进程
      })
    ],
  },
  //生产环境不需要devServer

  //模式
  mode: "production",
  devtool: "source-map",
}
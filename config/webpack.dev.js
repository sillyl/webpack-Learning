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

module.exports = {
  //入口
  entry: "./src/main.js", //相对路径
  output: {
    //文件输出路径
    // //_dirname node.js变量,代表当前文件的文件目录
    // path: path.resolve(__dirname, "../dist"), //绝对路径 path所有文件打包输出目录
    path: undefined, //开发模式下没有输出，不需要制定输出路径，在内存编译
    //文件名 入口文件(js文件)打包输出文件名
    // filename: "main.js",
    filename: "static/js/main.js", // 将 js 文件输出到 static/js 目录中
    // 在打包前 将path 目录整个清空，重新打包；
    // 使用开发服务clean配置会失效
    // clean: true, // 开发模式没有输出，不需要清空输出结果
  },

  //加载器
  module: {
    rules: [
      // loader配置
      {
        oneOf: [ //oneOf 每个文件只能被一个loader配置处理，不会继续匹配后买呢loader
          {
            test: /\.css$/, //test检测xx文件，检测.css结尾的文件
            use: [
              MiniCssExtractPlugin.loader, // 提取css成单独文件
              //style-loader 将js 中 css 通过创建style标签添加html文件中生效(动态创建style标签)
              "css-loader", //将css资源编译common.js 的模块到js中,
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
            ], //use执行顺序是从右向左（从下向上）
          },
          {
            test: /\.less$/,
            // loader: MiniCssExtractPlugin.loader, //loader使用一个，use可以加载多个loader
            use: [
              // compiles Less to CSS
              MiniCssExtractPlugin.loader,
              'css-loader',
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
              'less-loader',//将less资源编译css文件
            ],
          },
          {
            test: /\.s[ac]ss$/,
            use: [
              MiniCssExtractPlugin.loader,
              'css-loader',
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
              'sass-loader',//将sass资源编译css文件
            ],
          },
          {
            test: /\.styl$/,
            use: [
              MiniCssExtractPlugin.loader,
              'css-loader',
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
              'stylus-loader',//将stylus资源编译css文件
            ],
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
            // include: path.resolve(__dirname, "./src"), // exclude和include只用一个即可，尝试两者并用，不冲突的情况 未报错
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
                  plugins: ["@babel/plugin-transform-runtime"], // 减少代码体积
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
      context: path.resolve(__dirname, '../src'), // 指定检查文件的根目录 (因为讲webpack配置移动到config文件下 绝对位置需要回退一层路径，相对路径不需要改变)
      exclude: "node_modules", // 默认值
      threads, //开启多进程和进程数量
    }),
    // new HtmlWebpackPlugin(), 单独这么写到会在dist下面生成一个index.html的文件，但是其他引入不会展示出来
    new HtmlWebpackPlugin({
      // template作用： 以public/index.html为模版，创建新的index.html文件
      // 新的文件特点： 1.结构和原来一致； 2.会自动引入打包资源 <script defer src="static/js/main.js"></script></head>
      template: path.resolve(__dirname, "../public/index.html")
    }),
    new MiniCssExtractPlugin(),
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

  // 开发服务器 不会输出任何资源，在内存中编译打包（直白的讲不会修改dist，也就是执行npx webpack生成的dist文件）
  devServer: { // 运行指令 npx webpack serve
    host: "localhost", // 启动服务器域名
    port: "3000", // 启动服务器端口号
    open: true, // 是否自动打开浏览器
    //热替换只能用于开发模式
    hot: true //关闭HMR(默认值true) HotModuleReplacement（HMR/热模块替换）：在程序运行中，替换、添加或删除模块，而无需重新加载整个页面。
  },

  //模式
  mode: "development",
  devtool: "cheap-module-source-map",

}
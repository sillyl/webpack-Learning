const path = require("path"); //node.js模块,用来处理路径问题‘
module.exports = {
  //入口
  entry: "./src/main.js", //相对路径
  output: {
    //文件输出路径
    //_dirname node.js变量,代表当前文件的文件目录
    path: path.resolve(__dirname, "dist"), //绝对路径 path所有文件打包输出目录
    //文件名 入口文件(js文件)打包输出文件名
    // filename: "main.js",
    filename: "static/js/main.js",
  },

  //加载器
  module: {
    rules: [
      // loader配置
      {
        test: /\.css$/, //test检测xx文件，检测.css结尾的文件
        use: [
          "style-loader",//将js 中 css 通过创建style标签添加html文件中生效
          "css-loader" //将css资源编译common.js 的模块到js中
        ], //use执行顺序是从右向左（从下向上）
      },
      {
        test: /\.less$/,
        // loader:'style-loader', //loader使用一个，use可以加载多个loader
        use: [
          // compiles Less to CSS
          'style-loader',
          'css-loader',
          'less-loader',//将less资源编译css文件
        ],
      },
      {
        test: /\.s[ac]ss$/,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader',//将sass资源编译css文件
        ],
      },
      {
        test: /\.styl$/,
        use: [
          'style-loader',
          'css-loader',
          'stylus-loader',//将stylus资源编译css文件
        ],
      },
      {
        test: /\.(png|jpe?g|gif|webp|svg)$/,
        type: "asset",//相当于webpack4的url-loader
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024 // 小于10kb的图片会被base64处理,优点：减少请求数量，缺点：体积会变大一些
          }
        },
        generator: { //输出图片文件路径 名称； ext文件扩展名（png/jpg等，query携带其他参数比如写background-url（‘xxx?query’）
          filename: 'static/images/[hash][ext][query]'
        }
      },
    ]
  },

  //插件
  plugins: [
    // plugin配置
  ],

  //模式
  mode: "development"

}
// webpack打包必须在入口文件引入；
import './css/iconfont.css';
import './css/index.css';
import count from './js/count';
import sum from "./js/sum";
import './less/index.less';
import './sass/index.scss';
import './sass/index1.scss';
import './stylus/index.styl';

console.log(count(2, 2));
console.log(sum(1, 2, 3, 4, 5, 6));


// webpack.config.js 配置hot 对css（style-loaders）等进行热更新，但是js还是全局刷新
// 需要对js文件引入到热更新，改变count.js文件局部刷新
//实际开发中使用react-hot-loader帮助自动识别热替换
if (module.hot) {
    //判断是否支持热模块替换功能
    module.hot.accept("./js/count")
}
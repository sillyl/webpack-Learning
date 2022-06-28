// webpack打包必须在入口文件引入；
import './css/iconfont.css';
import './css/index.css';
import count from './js/count';
import sum from "./js/sum";
import './less/index.less';
import './sass/index.scss';
import './sass/index1.scss';
import './stylus/index.styl';

console.log(count(2, 1));
console.log(sum(1, 2, 3, 4, 5, 6));
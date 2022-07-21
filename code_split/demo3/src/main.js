import { sum } from "./math";
// import count from './count';

console.log('hello main', sum(5, 6, 7, 8));

document.getElementById("btn").onclick = function () {
  // import 的动态导入， 会将动态导入文件代码进行分割（拆分成单独模板)， 在需要使用的时候自动加载(
  import('./count')
    .then((res) => {
      console.log('模块加载成功', res.default(3, 1));
    })
    .catch((err) => {
      console.log('模块加载失败', err);
    });
  // console.log(count(3, 1)); //直接把结果打包了
}
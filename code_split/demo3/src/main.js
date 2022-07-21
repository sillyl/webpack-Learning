import { sum } from "./math";
import count from './count';

console.log('hello main', sum(5, 6, 7, 8));

document.getElementById("btn").onclick = function () {
  console.log(count(3, 1)); //直接把结果打包了
}
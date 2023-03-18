var argv = require("minimist")(process.argv.slice(2));

const now = new Date();
const month = argv.m || now.getMonth() + 1; // 月は0起点
const year = argv.y || now.getFullYear();

const last_day = new Date(year, month, 0).getDate();

console.log(`     ${month}月 ${year}`);
console.log("日 月 火 水 木 金 土");
for (let day = 1; day <= last_day; day++) {
  let date = new Date(year, month - 1, day);
  console.log(date.getDate());
}

var argv = require("minimist")(process.argv.slice(2));

const now = new Date();
const month = argv.m || now.getMonth() + 1; // 月は0起点
const year = argv.y || now.getFullYear();

const first_date = new Date(year, month - 1, 1);
const last_day = new Date(year, month, 0).getDate();

console.log(`     ${month}月 ${year}`);
console.log("日 月 火 水 木 金 土");
process.stdout.write("   ".repeat(first_date.getDay()));
for (let day = 1; day <= last_day; day++) {
  let date = new Date(year, month - 1, day);
  process.stdout.write(String(date.getDate()).padStart(2, " ") + " ");
  if (date.getDay() === 6) console.log("");
}

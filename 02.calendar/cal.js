import minimist from "minimist";

const argv = minimist(process.argv.slice(2));

const now = new Date();
const month = argv.m ?? now.getMonth() + 1;
const year = argv.y ?? now.getFullYear();

if (!Number.isInteger(month) || month < 1 || 12 < month) {
  throw "月には1から12までの数字を指定してください";
}

if (!Number.isInteger(year) || year < 1970 || 2100 < year) {
  throw "年には1970から2100までの数字を指定してください";
}
const first_date = new Date(year, month - 1, 1);
const last_date = new Date(year, month, 0);

console.log(`     ${month}月 ${year}`);
console.log("日 月 火 水 木 金 土");
process.stdout.write("   ".repeat(first_date.getDay()));
for (let day = 1; day <= last_date.getDate(); day++) {
  let date = new Date(year, month - 1, day);
  process.stdout.write(String(date.getDate()).padStart(2, " ") + " ");
  if (date.getDay() === 6) console.log("");
}

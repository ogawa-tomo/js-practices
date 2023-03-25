import minimist from "minimist";

const main = () => {
  const argv = minimist(process.argv.slice(2));

  const now = new Date();
  const month = argv.m ?? now.getMonth() + 1;
  const year = argv.y ?? now.getFullYear();

  if (!Number.isInteger(month) || month < 1 || 12 < month) {
    console.log("月には1から12までの数字を指定してください");
    return;
  }

  if (!Number.isInteger(year) || year < 1970 || 2100 < year) {
    console.log("年には1970から2100までの数字を指定してください");
    return;
  }
  const firstDate = new Date(year, month - 1, 1);
  const lastDate = new Date(year, month, 0);

  console.log(`     ${month}月 ${year}`);
  console.log("日 月 火 水 木 金 土");
  process.stdout.write("   ".repeat(firstDate.getDay()));
  for (let day = 1; day <= lastDate.getDate(); day++) {
    let date = new Date(year, month - 1, day);
    process.stdout.write(String(date.getDate()).padStart(2, " ") + " ");
    if (date.getDay() === 6) console.log("");
  }
};

main();

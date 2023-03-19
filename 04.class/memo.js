// process.stdin.resume();
// process.stdin.setEncoding("utf8");

const main = async () => {
  const lines = await getStdinLines();
  console.log(lines);
};

const getStdinLines = () => {
  return new Promise((resolve) => {
    let lines = [];
    let reader = require("readline").createInterface({
      input: process.stdin,
    });
    reader.on("line", (line) => {
      lines.push(line);
    });
    reader.on("close", () => {
      resolve(lines);
    });
  });
};

main();

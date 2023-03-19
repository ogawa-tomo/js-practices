// process.stdin.resume();
// process.stdin.setEncoding("utf8");

let lines = [];
let reader = require("readline").createInterface({
  input: process.stdin,
});
reader.on("line", (line) => {
  lines.push(line);
});
reader.on("close", () => {
  console.log(lines);
});

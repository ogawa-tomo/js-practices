const fs = require("fs");
const path = require("path");
const { Select } = require("enquirer");

// process.stdin.resume();
// process.stdin.setEncoding("utf8");

const main = async () => {
  const argv = require("minimist")(process.argv.slice(2));
  if (argv.l) {
    const files = getFiles();
    files.forEach((file) => {
      console.log(file.replace(".txt", ""));
    });
  } else if (argv.r) {
    const files = getFiles();
    const memos = files.map((file) => {
      return file.replace(".txt", "");
    });
    const prompt = new Select({
      name: "memos",
      message: "Choose a memo you want to see:",
      choices: memos,
    });
    const memo = await prompt.run();
    const text = fs.readFileSync(`${memo}.txt`, "utf8");
    console.log(text);
  } else if (argv.d) {
    const files = getFiles();
    const memos = files.map((file) => {
      return file.replace(".txt", "");
    });
    const prompt = new Select({
      name: "memos",
      message: "Choose a memo you want to see:",
      choices: memos,
    });
    const memo = await prompt.run();
    fs.unlink(`${memo}.txt`, (err) => {
      if (err) throw err;
    });
  } else {
    const lines = await getStdinLines();
    fs.writeFileSync(`${lines[0]}.txt`, lines.join("\n"));
  }
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

const getFiles = () => {
  const files = fs.readdirSync(".").filter((fd) => {
    return (
      fs.statSync(path.join(".", fd)).isFile() && path.extname(fd) === ".txt"
    );
  });
  return files;
};

main();

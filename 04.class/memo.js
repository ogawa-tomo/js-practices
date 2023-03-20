const fs = require("fs");
const path = require("path");
const { Select } = require("enquirer");

// process.stdin.resume();
// process.stdin.setEncoding("utf8");

const main = async () => {
  const argv = require("minimist")(process.argv.slice(2));
  if (argv.l) {
    const memos = Memo.all();
    memos.forEach((memo) => {
      console.log(memo);
    });
  } else if (argv.r) {
    const memos = Memo.all();
    const prompt = new Select({
      name: "memos",
      message: "Choose a memo you want to see:",
      choices: memos,
    });
    const memo = await prompt.run();
    const text = fs.readFileSync(`${memo}.txt`, "utf8");
    console.log(text);
  } else if (argv.d) {
    const memos = Memo.all();
    const prompt = new Select({
      name: "memos",
      message: "Choose a memo you want to delete:",
      choices: memos,
    });
    const memo = await prompt.run();
    fs.unlink(`${memo}.txt`, (err) => {
      if (err) throw err;
    });
  } else {
    const lines = await getStdinLines();
    fs.writeFileSync(`${lines[0]}.txt`, lines.join("\n"));
    Memo.create(lines[0], lines.join("\n"));
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

class Memo {
  static create(title, content) {
    fs.writeFileSync(`${title}.txt`, content);
  }
  static all() {
    const files = fs.readdirSync(".").filter((fd) => {
      return (
        fs.statSync(path.join(".", fd)).isFile() && path.extname(fd) === ".txt"
      );
    });
    const memos = files.map((file) => {
      return file.replace(".txt", "");
    });
    return memos;
  }
}

main();

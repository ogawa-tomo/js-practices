const fs = require("fs");
const path = require("path");
const { Select } = require("enquirer");

const main = async () => {
  const argv = require("minimist")(process.argv.slice(2));
  if (argv.l) {
    const memos = Memo.all();
    memos.forEach((memo) => {
      console.log(memo.title);
    });
  } else if (argv.r) {
    const memo = await selectMemoFromPrompt("Choose a memo you want to see:");
    if (!(typeof memo === "undefined")) console.log(memo.content);
  } else if (argv.d) {
    const memo = await selectMemoFromPrompt(
      "Choose a memo you want to delete:"
    );
    if (!(typeof memo === "undefined")) memo.destroy();
  } else {
    const lines = await getStdinLines();
    Memo.create(lines[0], lines.join("\n"));
  }
};

const selectMemoFromPrompt = async (message) => {
  const memos = Memo.all();
  if (memos.length === 0) {
    console.log("メモがありません。");
    return;
  }
  const prompt = new Select({
    name: "memos",
    message: message,
    choices: memos.map((memo) => memo.title),
  });
  const memo_title = await prompt.run();
  return Memo.find_by_title(memo_title);
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
  constructor(title, content) {
    this._title = title;
    this._content = content;
  }
  static create(title, content) {
    fs.writeFileSync(`${title}.txt`, content);
  }
  get title() {
    return this._title;
  }
  get content() {
    return this._content;
  }
  static all() {
    const files = fs.readdirSync(".").filter((fd) => {
      return (
        fs.statSync(path.join(".", fd)).isFile() && path.extname(fd) === ".txt"
      );
    });
    const memos = files.map((file) => {
      const title = file.slice(0, -4);
      const content = fs.readFileSync(file, "utf8");
      return new this(title, content);
    });
    return memos;
  }
  static find_by_title(title) {
    return new this(title, fs.readFileSync(`${title}.txt`, "utf8"));
  }
  destroy() {
    fs.unlink(`${this.title}.txt`, (err) => {
      if (err) throw err;
    });
  }
}

main();

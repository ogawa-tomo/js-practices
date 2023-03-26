const fs = require("fs");
const path = require("path");
const { Select } = require("enquirer");

const main = async () => {
  const argv = require("minimist")(process.argv.slice(2));
  if (argv.l) {
    const memos = Memo.all();
    memos.forEach((memo) => {
      console.log(memo.first_line);
    });
  } else if (argv.r) {
    const memo = await selectMemoFromPrompt("Choose a memo you want to see:");
    if (typeof memo === "undefined") return;
    console.log(memo.content);
  } else if (argv.d) {
    const memo = await selectMemoFromPrompt(
      "Choose a memo you want to delete:"
    );
    if (typeof memo === "undefined") return;
    memo.destroy();
    console.log(`${memo.first_line}を削除しました。`);
  } else {
    const lines = await getStdinLines();
    Memo.create(lines.join("\n"));
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
    choices: memos.map((memo) => memo.first_line),
  });
  const memo_first_line = await prompt.run();
  return Memo.find_by_first_line(memo_first_line);
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
  static _dir = "memos";
  constructor(file_name, content) {
    this._file_name = file_name;
    this._content = content;
  }
  static create(content) {
    const file_name_nums = this.all().map((memo) => {
      return parseInt(memo.file_name);
    });
    const file_name = (Math.max(...file_name_nums) + 1).toString();
    fs.writeFileSync(path.join(this._dir, `${file_name}.txt`), content);
  }
  get file_name() {
    return this._file_name;
  }
  get content() {
    return this._content;
  }
  get first_line() {
    return this.content.split("\n")[0];
  }
  static all() {
    const files = fs.readdirSync(this._dir).filter((file) => {
      return (
        fs.statSync(path.join(this._dir, file)).isFile() &&
        path.extname(file) === ".txt"
      );
    });
    const memos = files.map((file) => {
      const file_name = file.slice(0, -4);
      const content = fs.readFileSync(path.join(this._dir, file), "utf8");
      return new this(file_name, content);
    });
    return memos;
  }
  static find_by_first_line(first_line) {
    const memos = this.all();
    for (const memo of memos) {
      if (memo.first_line === first_line) {
        return memo;
      }
    }
  }
  destroy() {
    fs.unlink(
      path.join(this.constructor._dir, `${this.file_name}.txt`),
      (err) => {
        if (err) throw err;
      }
    );
  }
}

main();

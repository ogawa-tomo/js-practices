var argv = require("minimist")(process.argv.slice(2));
console.log(argv);

const month = argv.m;
console.log(month);

const year = argv.y;
console.log(year);

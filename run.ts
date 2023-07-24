const path = require("path");
const args = process.argv.slice(2);
const fileName = args[0];

if (!fileName) {
    console.error("Error: Please specify a file name.");
    process.exit(1);
}

const filePath = path.join("./src", fileName);

console.log(`Running file: ${filePath}`);
require("ts-node").register();
require(filePath);

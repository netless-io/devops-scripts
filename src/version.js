const shell = require("./shell");

function gitHash() {
    return shell.execSync("git rev-parse --short HEAD");
}

function package(path) {
    const json = require(path);
    return json.version;
}

module.exports = {
    gitHash, package
}
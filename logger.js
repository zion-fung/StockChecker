const fs = require("fs");

let logPath = `${process.cwd()}/log.txt`

function setLogFile(path) {
    logPath = path;
}

async function log(text) {
    const date = new Date().toString();
    await fs.writeFileSync(logPath, `${date} - ${text}\n`, { flag: "a" });
}

module.exports = {
    setLogFile,
    log
}
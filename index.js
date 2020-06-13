const emailer = require("./emailer");

const texter = require("./texter");

const stores = require("./stores/");

const argvDefaults = { nospam: false };

const argv = require('minimist')(process.argv.slice(2), { default: argvDefaults });

if (argv.f && argv.file) {
    console.log("Error: Can't have both -f and --file");
    process.exit();
}

if (argv.m && argv.method) {
    console.log("Error: Can't have both -m and --method");
    process.exit();
}

(async () => {
    // If the nospam flag is set, don't send an email/text if nothing is in stock
    const nospam = argv.nospam;
    const filepath = argv.f ? argv.f : argv.file;
    let html = null;
    if (filepath) {
        const storeList = require(`${filepath}`);
        message = await stores.main(storeList, true, nospam);
    } else {
        message = await stores.main([], false, nospam);
    }

    // If nospam is set, then there might be no output. If there isn't don't send an email/text
    if (message.length === 0) {
        return;
    }

    console.log(message);
    return;

    const method = argv.m ? argv.m : argv.method;
    if (!method || method === "email") {
        await emailer.sendEmail(message);
    } else {
        await texter.sendMessage(message);
    }
})();
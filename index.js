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
    const method = argv.m ? argv.m : argv.method;
    const storeList = filepath ? require(filepath) : [];

    // Get html results for email, plaintext for texting
    if (!method || method === "email") {
        const message = await stores.main(storeList, true, nospam);
        if (message.length === 0) { // If nospam is sent and the message is empty, don't send anything
            return;
        }
        await emailer.sendEmail(message);
    } else {
        const message = await stores.main(storeList, false, nospam);
        if (message.length === 0) { // If nospam is sent and the message is empty, don't send anything
            return;
        }
        await texter.sendMessage(message);
    }
    process.exit();
})();

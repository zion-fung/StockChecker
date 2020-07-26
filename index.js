const emailer = require("./emailer");

const texter = require("./texter");

const stores = require("./stores/");

const logger = require("./logger");

const argvDefaults = { nospam: false, executablePath: null };

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
    const storeList = filepath ? require(filepath) : [];

    const method = argv.m ? argv.m : argv.method;
    
    const executablePath = argv.executablePath; // For RPI 4

    // Get html results for email, plaintext for texting
    if (!method || method === "email") {
        const message = await stores.main(storeList, true, nospam);
        if (message.length === 0) { // If nospam is sent and the message is empty, don't send anything
            logger.log(`Skipped ${storeList} (email)`);
            return;
        }
        logger.log(`Emailing ${storeList}`);
        await emailer.sendEmail(message);
    } else {
        const message = await stores.main(storeList, false, nospam);
        if (message.length === 0) { // If nospam is sent and the message is empty, don't send anything
            logger.log(`Skipped ${storeList} (text)`);
            return;
        }
        logger.log(`Texting ${storeList}`);
        await texter.sendMessage(message);
    }
})();
const emailer = require("./emailer");

const texter = require("./texter");

const stores = require("./stores/");

const argv = require('minimist')(process.argv.slice(2));

if (argv.f && argv.file) {
    console.log("Error: Can't have both -f and --file");
    process.exit();
}

if (argv.m && argv.method) {
    console.log("Error: Can't have both -m and --method");
    process.exit();
}

(async () => {
    const filepath = argv.f ? argv.f : argv.file;
    let html = null;
    if (filepath) {
        const storeList = require(`./${filepath}`);
        html = await stores.main(storeList, true);
    } else {
        html = await stores.main([], false);
    }

    const method = argv.m ? argv.m : argv.method;
    if (!method || method === "email") {
        await emailer.sendEmail(html);
    } else {
        await texter.sendMessage(html);
    }
})();
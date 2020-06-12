const emailer = require("./emailer");

const stores = require("./stores/");

const argv = require('minimist')(process.argv.slice(2));

if (argv.f && argv.file) {
    console.log("Error: Can't have both -f and --file");
    process.exit();
}

(async () => {
    let filepath = argv.f ? argv.f : argv.file;
    let emailText = null;
    if (filepath) {
        const storeList = require(`${filepath}`);
        emailText = await stores.main(storeList);
    } else {
        emailText = await stores.main([]);
    }
    await emailer.main(emailText);
    process.exit();
})();

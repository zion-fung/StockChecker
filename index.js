const emailer = require("./emailer");

const stores = require("./stores/");

const argv = require('minimist')(process.argv.slice(2));

if (argv.f && argv.file) {
    console.log("Error: Can't have both -f and --file");
    process.exit();
}

(async () => {
    let filepath = argv.f ? argv.f : argv.file;
    if (!filepath) {
        stores.resetStores(); // No file given means run on all stores
    } else {
        // Run on specific stores
        const storeFile = require(`./${filepath}`);
        stores.setStores(storeFile);
    }
    const emailText = await stores.main();
    await emailer.main(emailText);
})();
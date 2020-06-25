const essentialSneaker = require("./essential-sneaker");

const items = [essentialSneaker];

const STORE_NAME = "Artisan Lab";

const ITEM_DESCRIPTOR = "Colors";

async function main() {
    let results = [];
    for (const item of items) {
        let result = await item.main();
        result.itemName = item.ITEM_NAME;
        results.push(result);
    }
    return results;
}

module.exports = {
    STORE_NAME,
    ITEM_DESCRIPTOR,
    main
};
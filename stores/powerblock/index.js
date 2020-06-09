const proSeries = require("./pro-series");

const items = [proSeries];

const STORE_NAME = "Powerblock";

const ITEM_DESCRIPTOR = "Variations";

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
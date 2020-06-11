const proSeries = require("./pro-series");
const kettlebellHandle = require("./kettlebell-handle");
const sportBench = require("./sport-bench");
const straightBar = require("./straight-bar");
const travelBench = require("./travel-bench");

const items = [kettlebellHandle, straightBar, sportBench, travelBench];

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
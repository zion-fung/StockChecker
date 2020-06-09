const kotn = require("./kotn");
const powerblock = require("./powerblock");

const storeList = [kotn, powerblock];
const storeStrings = {};
for (const store of storeList) {
    storeStrings[store.STORE_NAME] = store;
}

let stores = []

function resetStores() {
    stores = storeList.slice(0);
}

function setStores(storeList) {
    stores = [];
    for (const store of storeList) {
        stores.push(storeStrings[store]);
    }
}

let notifications = [];

async function main() {
    for (const store of stores) {
        const itemResults = await store.main();
        const storeName = store.STORE_NAME;
        let items = ["----------", `Store: ${storeName}`, "---"];
        for (const itemResult of itemResults) {
            items.push(`Item: ${itemResult.itemName}`);
            if (itemResult.error) {
                items.push(`Error finding item: ${itemResult.itemName}`);
                continue;
            }
            // When there's only 1 "color" or there aren't different colors
            if (Object.keys(itemResult.results).length === 1) {
                const key = Object.keys(itemResult.results)[0];
                const stock = itemResult.results[key].stock === true ? "In Stock" : "Out of Stock";
                items.push(`- (<a href=${itemResult.results[color].link}>Link</a>): ${stock}`);
                continue;
            }
            items.push(`${store.ITEM_DESCRIPTOR}:`);
            for (const color in itemResult.results) {
                const stock = itemResult.results[color].stock === true ? "In Stock" : "Out of Stock";
                items.push(`- (<a href=${itemResult.results[color].link}>Link</a>) ${color}: ${stock}`);
            }
        }
        notifications.push(`${items.map(item => `<p>${item}</p>`).join("\n")}`);
    }
    const output = notifications.join("\n");
    return output;
}

module.exports = {
    resetStores,
    setStores,
    main
};

/* Sample output
----------
Store: Kotn
---
Item: Essential Crew T-Shirt
Colors:
- (Link) Heather Grey: In Stock 
- (Link) Navy: In Stock
- (Link) Army Green: Out of Stock
- (Link) Charcoal Melange: Out of Stock
----------
Store: Woodies
---
Item: .....

*/
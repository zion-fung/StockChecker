const kotn = require("./kotn");
const powerblock = require("./powerblock");

const stores = [kotn, powerblock];

let notifications = [];

async function main(activeStores) {
    let inactiveStores = new Set();
    if (activeStores.length > 0) {
        inactiveStores = new Set(stores.map(store => store.STORE_NAME));
        for (const store of activeStores) {
            inactiveStores.delete(store);
        }
    }
    for (const store of stores) {
        if (inactiveStores.has(store.STORE_NAME)) {
            continue;
        }
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
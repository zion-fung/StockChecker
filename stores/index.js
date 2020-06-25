const kotn = require("./kotn");
const powerblock = require("./powerblock");
const artisanLab = require("./artisan-lab");

const stores = [kotn, powerblock, artisanLab];

let notifications = [];

// activeStores: List[String] - List of stores to check
// outputHtml: boolean - whether to output html or plaintext (for emails and texts respectively)
async function main(activeStores, outputHtml, nospam=false) {
    // Create list of inactivate stores to filter out the store list
    let inactiveStores = new Set();
    if (activeStores.length > 0) {
        inactiveStores = new Set(stores.map(store => store.STORE_NAME));
        for (const store of activeStores) {
            inactiveStores.delete(store);
        }
    }

    // Loop through each store and add the output line by line
    for (const store of stores) {
        // Skip store if it's not in the active list
        if (inactiveStores.has(store.STORE_NAME)) {
            continue;
        }
        
        // Set intial variables
        let hasInventory = false; // Used when the nospam flag is set
        const itemResults = await store.main();
        const storeName = store.STORE_NAME;
        let items = ["----------", `Store: ${storeName}`, "---"];

        // Process each result
        for (const itemResult of itemResults) {
            items.push(`Item: ${itemResult.itemName}`);
            if (itemResult.error) {
                items.push(`Error finding item: ${itemResult.itemName}`);
                continue;
            }
            // When there's only 1 "color" or there aren't different colors
            if (Object.keys(itemResult.results).length === 1) {
                const key = Object.keys(itemResult.results)[0];
                const stock = itemResult.results[key].stock ? "In Stock" : "Out of Stock";
                if (itemResult.results[key].stock) {
                    hasInventory = true;
                }
                if (outputHtml) {
                    items.push(`- (<a href=${itemResult.results[key].link}>Link</a>): ${stock}`);
                } else {
                    items.push(`- Status: ${stock}`);
                    items.push(`- Link: ${itemResult.results[key].link}`)
                }
                continue;
            }
            // When there's more than 1 color or variation
            items.push(`${store.ITEM_DESCRIPTOR}:`);
            for (const res in itemResult.results) {
                const stock = itemResult.results[res].stock ? "In Stock" : "Out of Stock";
                if (itemResult.results[res].stock) {
                    hasInventory = true;
                }
                if (outputHtml) {
                    items.push(`- (<a href=${itemResult.results[res].link}>Link</a>) ${res}: ${stock}`);
                } else {
                    items.push(`- ${res}: ${stock} | Link: ${itemResult.results[res].link}`)
                }
            }
        }
        // If nothing is in stock and nospam is set, then don't add the notification
        if (!hasInventory && nospam) {
            console.log("Skipping items for store:", storeName);
            continue;
        }
        if (outputHtml) {
            notifications.push(items.map(item => `<p>${item}</p>`).join("\n"));
        } else {
            notifications.push(items.join("\n"));
        }
    }

    // Format the output
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
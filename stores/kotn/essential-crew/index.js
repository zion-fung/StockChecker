const { chromium } = require("playwright");

const ITEM_NAME = "Essential Crew T-Shirt";

async function main() {
    let results = {
        "Heather Grey": {
            stock: true,
            link: "https://ca.kotn.com/collections/mens-tshirts/products/mens-essential-crew-in-heather-grey"
        },
        "Navy": {
            stock: true,
            link: "https://ca.kotn.com/collections/mens-tshirts/products/mens-essential-crew-in-navy"
        },
        "Army Green": {
            stock: true,
            link: "https://ca.kotn.com/collections/mens-tshirts/products/mens-essential-crew-in-army-green"
        },
        "Charcoal Melange": {
            stock: true,
            link: "https://ca.kotn.com/collections/mens-tshirts/products/mens-essential-crew-in-charcoal-melange"
        },
    };
    let isError = false;
    let browser = null;
    try {
        browser = await chromium.launch(); // add executablePath for rpi 4
        const context = await browser.newContext();
        const page = await context.newPage();
        for (const color in results) {
            const url = results[color].link;
            await page.goto(url);
            const inStockSizes = await page.$$(".sc-AxiKw.iEIuqc");
            for (const size of inStockSizes) {
                const text = await size.innerText();
                if (text === "M") {
                    results[color].stock = false;
                    break;
                }
            }
        }
    } catch (error) {
        console.log(error);
        isError = true;
    } finally {
        // process.exit() // Used to speed up rpi4?
        if (browser) {
            await browser.close();
        }
    }
    if (isError) {
        return {
            error: true,
            results: results,
        };
    }
    return { 
        error: false,
        results: results,
    };
}

module.exports = {
    ITEM_NAME,
    main
};
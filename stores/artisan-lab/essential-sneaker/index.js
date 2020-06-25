const { chromium } = require("playwright");

const ITEM_NAME = "Essential Sneakers";

async function main() {
    let results = {
        "Light Grey": {
            stock: true,
            link: "https://artisan-lab.com/shop-essential-sneakers/light-grey"
        }
    };
    let isError = false;
    let browser = null;
    try {
        browser = await chromium.launch({ executablePath: "/bin/chromium-browser" }); // add executablePath for rpi 4
        const context = await browser.newContext();
        const page = await context.newPage();
        for (const color in results) {
            const url = results[color].link;
            await page.goto(url);
            // Put item specific logic here
            await page.selectOption("select", "EU 42");
            const stock = await page.$(".variant-out-of-stock");
            if (stock) {
                results[color].stock = false;
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
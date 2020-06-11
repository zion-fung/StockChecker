const { chromium } = require("playwright");

const ITEM_NAME = "Essential Crew T-Shirt";

async function main() {
    let results = {
        "Heather Grey": {
            stock: true,
            link: "https://us.kotn.com/collections/mens/products/mens-essential-crew?variant=20428653920310"
        },
        "Navy": {
            stock: true,
            link: "https://us.kotn.com/collections/mens/products/mens-essential-crew?variant=31081293316150"
        },
        "Army Green": {
            stock: true,
            link: "https://us.kotn.com/collections/mens/products/mens-essential-crew?variant=20420198858806"
        },
        "Charcoal Melange": {
            stock: true,
            link: "https://us.kotn.com/collections/mens/products/mens-essential-crew?variant=31081239085110"
        },
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
            const mediumButton = await page.$("#m");
            const isDisabled = await mediumButton.evaluate(node => node.disabled);
            if (isDisabled) {
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
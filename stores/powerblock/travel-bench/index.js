const { chromium } = require("playwright");

const ITEM_NAME = "Powerblock Travel Bench";

const url = "https://powerblock.com/product/travel-bench/";

async function main() {
    let results = {
        "Travel Bench": {
            stock: true,
            link: "https://powerblock.com/product/travel-bench/"
        },
    };
    let isError = false;
    let browser = null;
    try {
        browser = await chromium.launch(); // add executablePath for rpi 4
        const context = await browser.newContext();
        const page = await context.newPage();
        await page.goto(url);
        await page.waitForSelector(".product_title");

        let stockElement = await page.$("p.stock");
        let stock = await stockElement.innerText();
        if (stock === "Out of stock") {
            results["Travel Bench"].stock = false;
        }
    } catch (error) {
        console.log(error);
        isError = true;
    } finally {
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
    main,
    ITEM_NAME
};
const { chromium } = require("playwright");

const ITEM_NAME = "Powerblock Pro Series";

const url = "https://powerblock.com/product/pro-series/";

async function main() {
    let results = {
        "5-50 Expandable": {
            stock: true,
            link: "https://powerblock.com/product/pro-series/"
        },
        "5-70 Expandable": {
            stock: true,
            link: "https://powerblock.com/product/pro-series/"
        },
        "5-90 Expandable": {
            stock: true,
            link: "https://powerblock.com/product/pro-series/"
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
        await page.selectOption("select#pa_dumbbell-type", "expandable");

        await page.selectOption("select#pa_weight", "5-50");
        let stockElement = await page.$("p.stock");
        let stock = await stockElement.innerText();
        if (stock === "Out of stock") {
            results["5-50 Expandable"].stock = false;
        }

        await page.selectOption("select#pa_weight", "5-70");
        stockElement = await page.$("p.stock");
        stock = await stockElement.innerText();
        if (stock === "Out of stock") {
            results["5-70 Expandable"].stock = false;
        }

        await page.selectOption("select#pa_weight", "5-90");
        stockElement = await page.$("p.stock");
        stock = await stockElement.innerText();
        if (stock === "Out of stock") {
            results["5-90 Expandable"].stock = false;
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
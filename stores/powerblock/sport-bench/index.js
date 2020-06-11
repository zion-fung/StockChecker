const { chromium } = require("playwright");

const ITEM_NAME = "Powerblock Sport Bench";

const url = "https://powerblock.com/product/sport-bench/";

async function main() {
    let results = {
        "Sport Bench": {
            stock: true,
            link: "https://powerblock.com/product/sport-bench/"
        },
    };
    let isError = false;
    let browser = null;
    try {
        browser = await chromium.launch({ executablePath: "/bin/chromium-browser" }); // add executablePath for rpi 4
        const context = await browser.newContext();
        const page = await context.newPage();
        await page.goto(url);
        await page.waitForSelector(".product_title");

        let stockElement = await page.$("p.stock");
        let stock = await stockElement.innerText();
        stock = stock.toLowerCase();
        if (stock === "out of stock" || stock === "available on backorder") {
            results["Sports Bench"].stock = false;
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
const { chromium } = require("playwright");

const ITEM_NAME = "Powerblock Straight Bar";

const url = "https://powerblock.com/product/pro-series-straight-bar/";

async function main() {
    let results = {
        "Straight Bar": {
            stock: true,
            link: "https://powerblock.com/product/pro-series-straight-bar/"
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
        if (stock === "Out of stock") {
            results["Straight Bar"].stock = false;
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
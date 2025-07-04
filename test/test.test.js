import { Builder } from "selenium-webdriver";
import { describe, it, before } from "mocha";

let driver;

describe("Catalog", function () {    
    before(async function () {
        this.timeout(20000);
        console.log('Test'); 
        driver = await new Builder().forBrowser("chrome").build();
    });

    it("Should add item to cart", async function (done) {
        await driver.get("https://www.onliner.by");
        setTimeout(done, 300);
    });
});

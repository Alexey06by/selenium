import { Builder, By, until } from "selenium-webdriver";
import { describe, it, before, after } from "mocha";
import { expect } from "chai";

let driver;

describe("Cart", function () {   

    before(async function () {
        driver = await new Builder().forBrowser("chrome").build();
        await driver.manage().window().maximize();
    });

    after (async function () {
        await driver.quit();
    });

    it("Should proceed to checkout from cart", async function () {
        await driver.get("https://catalog.onliner.by");
    
        const catalogItem = await driver.wait(
            until.elementLocated(By.css(
                '.catalog-form__slider:nth-child(17) .catalog-form__slider-list > .catalog-form__slider-item:first-child .catalog-form__preview'
            )),
            5000
        );     
        await driver.executeScript('arguments[0].scrollIntoView(true);',catalogItem);          
        await catalogItem.click();

        const productTitle = await driver.findElement(By.className('catalog-masthead__title'));
        const productFullName = await productTitle.getText();
        const cartButton = await driver.wait(
            until.elementLocated(By.css(
                '.product-aside__offers-item:first-child .product-aside__button_cart'
            )),
            5000
        ); 
        await driver.executeScript('arguments[0].scrollIntoView(true);',cartButton);        
        await cartButton.click();

        const cartRedirectionButton = await driver.wait(
            until.elementLocated(By.css(
                '.button-style_base-alter[href="https://cart.onliner.by"]'
            )),
            5000
        ); 
        await cartRedirectionButton.click();       

        const cookieRejectButton = await driver.wait(until.elementLocated(By.id('reject-button')));
        await cookieRejectButton.click();
        const cookieRejectButton2 = await driver.wait(until.elementLocated(By.id('reject-button')));
        await cookieRejectButton2.click();
        await driver.sleep(1000);
        
        const proceedToCheckout = await driver.wait(until.elementLocated(
            By.className('button-style_primary')
        ));
        await proceedToCheckout.click();

        const pageTitle = await driver.wait(
            until.elementLocated(By.className(
                'cart-form__title_condensed-other'
            )),
            5000
        );           
        const pageTitleVisible = await pageTitle.isDisplayed();
        expect(pageTitleVisible).to.equal(true);
        expect(await pageTitle.getText()).to.equal('Оформление заказа');    

        const productName = await driver.findElement(By.css(
            '.cart-form__total-group .cart-form__description:nth-child(2) .cart-form__description-part_1'
        ));
        const productNameVisible = await productName.isDisplayed();
        expect(productNameVisible).to.equal(true);  
        expect(productFullName).to.include(await productName.getText());  

        const currentUrl = await driver.getCurrentUrl();
        expect(currentUrl).to.include("cart.onliner.by/order");
    });
});

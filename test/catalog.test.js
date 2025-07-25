import { Builder, By, until } from "selenium-webdriver";
import { describe, it, before, after } from "mocha";
import { expect } from "chai";
import dotenv from "dotenv";
dotenv.config();

let driver;

describe("Catalog", function () {   

    before(async function () {
        driver = await new Builder().forBrowser("chrome").build();
        await driver.manage().window().maximize();
    });

    after (async function () {
        await driver.quit();
    });

    it("Should add item to cart", async function () {
        await driver.get(process.env.BASE_URL);

        const catalog = await driver.wait(
            until.elementLocated(
                By.css('.b-main-navigation__link[href="https://catalog.onliner.by"]')
            ),
            5000
        );
        await driver.wait(until.elementIsVisible(catalog), 5000);        
        const actions = driver.actions({async:true});
        await actions.move({origin: catalog}).click().perform();

        const catalogItem = await driver.wait(
            until.elementLocated(By.css(
                'a.catalog-form__preview[href$="/headphones/qcy/qcyt13wht"]'
            )),
            5000
        );     
        await driver.executeScript('arguments[0].scrollIntoView(true);',catalogItem);
        const actions2 = driver.actions({async:true});         
        await actions2.move({origin: catalogItem}).click().perform();

        const cartButton = await driver.wait(
            until.elementLocated(By.css(
                '.product-aside__offers-item:first-child .product-aside__button_cart'
            )),
            10000
        ); 
        await driver.executeScript('arguments[0].scrollIntoView(true);',cartButton);        
        const actions3 = driver.actions({async:true});
        await actions3.move({origin: cartButton}).click().perform();

        const cartRedirectionButton = await driver.wait(
            until.elementLocated(By.css(
                '.button-style_base-alter[href="https://cart.onliner.by"]'
            )),
            5000
        ); 
        await actions3.move({origin: cartRedirectionButton}).click().perform(); 
        
        const cartItem = await driver.wait(
            until.elementLocated(By.className('cart-form__offers-unit')), 5000);   
        const isCartItemVisible = await cartItem.isDisplayed();
        expect(isCartItemVisible).to.equal(true);  

        const cartItems = await driver.findElements(By.className('cart-form__offers-unit'));
        expect(cartItems.length).to.equal(1);  

        const currentUrl = await driver.getCurrentUrl();
        expect(currentUrl).to.include("cart.onliner.by");    
    });  

   it("Should start playcing an order", async function () {
        await driver.get(process.env.CATALOG_URL);
    
        const catalogItem = await driver.wait(
            until.elementLocated(By.css(
                'a.catalog-form__preview[href$="/cpu/amd/ryzen55600"]'
            )),
            5000
        );     
        await driver.executeScript('arguments[0].scrollIntoView(true);',catalogItem);          
        await catalogItem.click();

        const productTitle = await driver.findElement(By.className('catalog-masthead__title'));
        const productFullName = await productTitle.getText();
        const buyNowButton = await driver.wait(
            until.elementLocated(By.css(
                '.product-aside__offers-item:first-child .product-aside__button_buy'
            )),
            5000
        ); 
        await driver.executeScript('arguments[0].scrollIntoView(true);',buyNowButton);        
        await buyNowButton.click();
                
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

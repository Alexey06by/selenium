import { Builder, By, until } from "selenium-webdriver";
import { describe, it, before, after } from "mocha";
import { expect } from "chai";
import { sections } from "../test-data/site-sections.js";
import dotenv from "dotenv";
dotenv.config();

let driver;

describe("Login", function () {   

    before(async function () {
        driver = await new Builder().forBrowser("chrome").build();
        await driver.manage().window().maximize();
    });

    after (async function () {
        await driver.quit();
    });

    it("Should show error message if login with invalid credentials", async function () {
        await driver.get(process.env.BASE_URL);

        const cookieRejectButton = await driver.wait(until.elementLocated(By.id('reject-button')));
        await cookieRejectButton.click();
        const cookieRejectButton2 = await driver.wait(until.elementLocated(By.id('reject-button')));
        await cookieRejectButton2.click();
        await driver.sleep(500);     

        const loginButton = await driver.wait(
            until.elementLocated(By.xpath("//div[text()='Вход']")), 
            5000
        );
        await loginButton.click();

        const loginField = await driver.wait(
            until.elementLocated(By.css('[placeholder="Ник или e-mail"]')), 
            5000
        );
        await loginField.sendKeys(process.env.INVALID_LOGIN);

        const passwordField = await driver.wait(
            until.elementLocated(By.css('[placeholder="Пароль"]')), 
            5000
        );
        await passwordField.sendKeys(process.env.INVALID_PASSWORD);

        const enterButton = await driver.wait(
            until.elementLocated(By.className("auth-button_primary")), 
            5000
        );
        await enterButton.click();

        const errorMessage = await driver.wait(
            until.elementLocated(By.className("auth-form__description_error")), 
            5000
        );
        expect(await errorMessage.getText()).to.equal('Неверный логин или пароль');
        
        const errorMessageVisible = await errorMessage.isDisplayed();
        expect(errorMessageVisible).to.be.true;
    });

    for (const {sectionName, sectionUrl} of sections){
        it(`Should display login button on ${sectionName} section`, async function(){
            await driver.get(sectionUrl);

            const loginButton = await driver.wait(until.elementLocated(
                By.xpath('//div[contains(text(),"Вход")]'),
                5000
            ));
            await driver.wait(until.elementIsVisible(loginButton), 10000);
            await driver.sleep(250);
            await loginButton.click();

            const pageTitle = await driver.wait(until.elementLocated(
                By.className("auth-form__title_big")
            ));
            expect(await pageTitle.getText()).to.equal("Вход");

            const pageTitleVisible = await pageTitle.isDisplayed();
            expect(pageTitleVisible).to.be.true;
        });
    }
});

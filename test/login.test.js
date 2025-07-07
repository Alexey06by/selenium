import { Builder, By, until } from "selenium-webdriver";
import { describe, it, before, after } from "mocha";
import { expect } from "chai";
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
        await driver.get("https://www.onliner.by");

        const entranceButton = await driver.wait(
            until.elementLocated(By.xpath("//div[text()='Вход']")), 
            5000
        );
        await entranceButton.click();

        const login = await driver.wait(
            until.elementLocated(By.css('[placeholder="Ник или e-mail"]')), 
            5000
        );
        await login.sendKeys(process.env.LOGIN);

        const password = await driver.wait(
            until.elementLocated(By.css('[placeholder="Пароль"]')), 
            5000
        );
        await password.sendKeys(process.env.PASSWORD);

        const enterButton = await driver.wait(
            until.elementLocated(By.className("auth-button_primary")), 
            5000
        );
        await entranceButton.click();

        const errorMessage = await driver.wait(
            until.elementLocated(By.className("auth-form__description_error")), 
            5000
        );
        expect(errorMessage).to.equal('Неверный логин или пароль');
        
        const errorMessageVisible = errorMessage.isDisplayed();
        expect(errorMessageVisible).to.be.true;
    });
});
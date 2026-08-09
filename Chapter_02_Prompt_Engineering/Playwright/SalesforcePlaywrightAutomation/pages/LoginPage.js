const logger = require('../utils/logger');

class LoginPage {
    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page) {
        this.page = page;
        this.username = page.locator("//input[@type='email']");
        this.password = page.locator("//input[@type='password']");
        this.loginButton = page.locator("//input[@type='submit' and @name='Login']");
        this.errorMessage = page.locator("//div[@id='error']");
    }

    async navigate(url) {
        try {
            await this.page.goto(url);
            logger.log(`Navigated to ${url}`);
        } catch (error) {
            logger.log(`Navigation Error: ${error.message}`);
            throw error;
        }
    }

    async doLogin(user, pass) {
        try {
            await this.username.fill(user);
            logger.log('Entered username.');
            
            await this.password.fill(pass);
            logger.log('Entered password.');
            
            await this.loginButton.click();
            logger.log('Clicked login button.');
        } catch (error) {
            logger.log(`Login Error: ${error.message}`);
            throw error;
        }
    }

    async getErrorMessage() {
        try {
            // Auto-waiting will ensure the locator is actionable/visible before retrieving text
            const text = await this.errorMessage.textContent();
            logger.log(`Error message retrieved: ${text}`);
            return text;
        } catch (error) {
            logger.log(`Get Error Message Error: ${error.message}`);
            throw error;
        }
    }

    async isLoginSuccessful() {
        try {
            // Wait for the URL to change indicating successful login. Explicit retry mechanism if needed.
            await this.page.waitForURL(/.*home.*/, { timeout: 10000 });
            logger.log('Login successful verification passed.');
            return true;
        } catch (error) {
            logger.log('Login successful verification failed (Timeout).');
            return false;
        }
    }
}

module.exports = { LoginPage };

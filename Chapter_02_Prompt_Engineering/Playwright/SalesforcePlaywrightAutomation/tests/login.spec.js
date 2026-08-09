const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const logger = require('../utils/logger');

test.describe('Salesforce Login Tests', () => {
    let loginPage;

    test.beforeAll(async () => {
        logger.log('Starting Test Suite: Salesforce Login Tests');
    });

    test.beforeEach(async ({ page }) => {
        try {
            logger.log('Initializing LoginPage context for test.');
            loginPage = new LoginPage(page);
        } catch (error) {
            logger.log(`Error in beforeEach: ${error.message}`);
            throw error;
        }
    });

    test.afterEach(async () => {
        logger.log('Finished test execution.');
    });

    test.afterAll(async () => {
        logger.log('Completed Test Suite: Salesforce Login Tests');
    });

    test('Valid Login Scenario', async () => {
        try {
            await loginPage.navigate('https://login.salesforce.com/?locale=in');
            await loginPage.doLogin('valid_user@example.com', 'ValidPassword123!');
            
            const isSuccess = await loginPage.isLoginSuccessful();
            expect(isSuccess).toBeTruthy();
        } catch (error) {
            logger.log(`Test Failed (Valid Login): ${error.message}`);
            throw error;
        }
    });

    test('Invalid Login Scenario', async () => {
        try {
            await loginPage.navigate('https://login.salesforce.com/?locale=in');
            await loginPage.doLogin('invalid_user@example.com', 'WrongPassword');
            
            const errorMessage = await loginPage.getErrorMessage();
            expect(errorMessage).toBeTruthy();
        } catch (error) {
            logger.log(`Test Failed (Invalid Login): ${error.message}`);
            throw error;
        }
    });
});

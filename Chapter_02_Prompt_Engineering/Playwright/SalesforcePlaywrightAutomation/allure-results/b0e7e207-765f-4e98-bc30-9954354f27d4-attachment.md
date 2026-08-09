# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: login.spec.js >> Salesforce Login Tests >> Valid Login Scenario
- Location: tests\login.spec.js:30:5

# Error details

```
Error: expect(received).toBeTruthy()

Received: false
```

# Test source

```ts
  1  | const { test, expect } = require('@playwright/test');
  2  | const { LoginPage } = require('../pages/LoginPage');
  3  | const logger = require('../utils/logger');
  4  | 
  5  | test.describe('Salesforce Login Tests', () => {
  6  |     let loginPage;
  7  | 
  8  |     test.beforeAll(async () => {
  9  |         logger.log('Starting Test Suite: Salesforce Login Tests');
  10 |     });
  11 | 
  12 |     test.beforeEach(async ({ page }) => {
  13 |         try {
  14 |             logger.log('Initializing LoginPage context for test.');
  15 |             loginPage = new LoginPage(page);
  16 |         } catch (error) {
  17 |             logger.log(`Error in beforeEach: ${error.message}`);
  18 |             throw error;
  19 |         }
  20 |     });
  21 | 
  22 |     test.afterEach(async () => {
  23 |         logger.log('Finished test execution.');
  24 |     });
  25 | 
  26 |     test.afterAll(async () => {
  27 |         logger.log('Completed Test Suite: Salesforce Login Tests');
  28 |     });
  29 | 
  30 |     test('Valid Login Scenario', async () => {
  31 |         try {
  32 |             await loginPage.navigate('https://login.salesforce.com/?locale=in');
  33 |             await loginPage.doLogin('valid_user@example.com', 'ValidPassword123!');
  34 |             
  35 |             const isSuccess = await loginPage.isLoginSuccessful();
> 36 |             expect(isSuccess).toBeTruthy();
     |                               ^ Error: expect(received).toBeTruthy()
  37 |         } catch (error) {
  38 |             logger.log(`Test Failed (Valid Login): ${error.message}`);
  39 |             throw error;
  40 |         }
  41 |     });
  42 | 
  43 |     test('Invalid Login Scenario', async () => {
  44 |         try {
  45 |             await loginPage.navigate('https://login.salesforce.com/?locale=in');
  46 |             await loginPage.doLogin('invalid_user@example.com', 'WrongPassword');
  47 |             
  48 |             const errorMessage = await loginPage.getErrorMessage();
  49 |             expect(errorMessage).toBeTruthy();
  50 |         } catch (error) {
  51 |             logger.log(`Test Failed (Invalid Login): ${error.message}`);
  52 |             throw error;
  53 |         }
  54 |     });
  55 | });
  56 | 
```
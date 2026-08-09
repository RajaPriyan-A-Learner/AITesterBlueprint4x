# Playwright JavaScript Automation Framework Plan

This implementation plan is based on the instructions extracted from the Playwright `RICEPOT_TEMPLATE.md` file. As per your instructions, no code will be generated until explicit approval is given.

## Goal Description
Develop an enterprise-grade QA automation framework for the Salesforce login page utilizing **Playwright**, **JavaScript**, and **Node.js**. The framework must adhere to strict zero-bad-practices coding standards, ensuring high reliability, cross-browser compatibility, and detailed reporting.

## Understanding of the Requirements

### Technology Stack & Architecture
- **Language**: JavaScript
- **Test Runner**: Playwright Test (`@playwright/test`)
- **Design Pattern**: Page Object Model (POM) with locator initialization defined directly in the constructor (e.g., `this.username = page.locator(...)`).
- **Context & Thread Safety**: Leverage Playwright's built-in isolated test fixtures (which supply a fresh `page` and `context` per worker/test) to ensure thread-safe parallel execution.
- **Cross-Browser Factory**: Implement a pattern/configuration to dynamically support Chromium, Firefox, and WebKit browsers.

### Scope of Work
- **Target URL**: `login.salesforce.com/?locale=in`
- **Deliverables**:
  1. Node.js project setup (`package.json`, `playwright.config.js`).
  2. One Page Object file for the Login Page.
  3. Two Playwright test scripts covering the Valid Login and Invalid Login scenarios.

### Strict Coding Standards & Constraints
- **Locators**: Strict use of **XPath only**. CSS selectors, IDs, and tags are prohibited.
- **Synchronization**: `page.waitForTimeout()` is strictly forbidden. We must rely on Playwright's built-in auto-waiting mechanism (which handles stale element references implicitly), and use explicit retry blocks if necessary.
- **Hooks**: Apply structured Playwright hooks (`test.beforeAll`, `test.afterAll`, `test.beforeEach`, `test.afterEach`) for test setup and teardown.
- **Exception Handling**: Use robust `try-catch` blocks within the POM and the test scripts.
- **Code Cleanliness**: No inline comments, explanations, or bad coding practices. Code must be runnable and pristine.
- **Reporting & Logging**: 
  - Integrate `allure-playwright` for decorative HTML reporting.
  - Implement a custom text logger to trace back step-by-step actions and errors.

## Proposed Components

Once approved, the following structure will be generated:

### 1. Framework Configuration & Core Utilities
- **`package.json`**: Project dependencies (`@playwright/test`, `allure-playwright`).
- **`playwright.config.js`**: The central Playwright configuration acting as the cross-browser Factory (defining projects for Chromium, Firefox, WebKit) and configuring the Allure reporter.
- **`utils/logger.js`**: A utility module to append execution steps and errors to a text log file.

### 2. Page Object Model (POM)
- **`pages/LoginPage.js`**: Will contain XPath-only locators initialized in the constructor. The methods (e.g., `doLogin`) will utilize `try-catch` blocks and invoke the custom text logger before/after Playwright actions.

### 3. Test Scripts
- **`tests/login.spec.js`**: Will contain the two requested scenarios (Valid and Invalid). It will utilize Playwright fixtures to guarantee a thread-safe context and use Playwright's native `expect` assertions. Hooks (`test.beforeEach`, etc.) will be applied for setup.

## User Review Required

Please review my understanding of the Playwright framework requirements. Let me know if you would like me to proceed with execution and generate the code inside a new `SalesforcePlaywrightAutomation` folder.

*(Note: No code has been created, and no terminal commands have been executed.)*

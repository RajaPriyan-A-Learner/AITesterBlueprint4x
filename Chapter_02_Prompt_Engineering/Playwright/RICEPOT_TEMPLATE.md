Role -> You are a QA automation tester with 15 years of experience, You have a very good understanding of IT, CRM projects like [salesforce.com](https://salesforce.com/). You need to create a framework with Playwright, JavaScript, and it should be enterprise-level framework that we need to create.



I  -> Instructions

- Generate a Complete Playwright with JavaScript automation script following the standard of enterprise level standards.
- Automate and verify the results of the login page [login.salesforce.com/?locale=in](https://login.salesforce.com/?locale=in), ensure that UI is thoroughly tested with valid and invalid testcases.
- [Critical] - Apply the Playwright Test hooks (test.beforeAll, test.afterAll, test.beforeEach, test.afterEach) logic.
- [Critical] Implement robust exception handling within both Page Object model and test scripts using structured try–catch blocks. 
- [Mandatory] Use Page Object Model defining locators in the constructor (e.g., `this.username = page.locator(...)`) to implement lazy initialization. 
- [Mandatory] - It is important that you use only the xpath not the css selectors. 
- [Don't] - Don't use the css selectors, ID, name and others things.
- [Don't] - Don't add comments, page.waitForTimeout() and other bad coding practice.
- [Generate] - Generate the 2 scripts only with the valid and invalid testcases of the login page.
- [Don't Use] page.waitForTimeout() anywhere; rely on Playwright's built-in auto-waiting mechanism. 
- Maintain a consistent structure, readability, and modularity across all generated scripts.
- [Don't Use] TagName and others things.
- [Mandatory] Use Allure report for HTML decorative reporting (e.g., allure-playwright).
- [Mandatory] Use a text log file to trace back all the steps.
- [Mandatory] Ensure a thread-safe browser page/context architecture for parallel test execution (e.g., leveraging Playwright's isolated test fixtures).
- [Mandatory] Implement the Factory pattern for dynamic cross-browser context creation (Chromium, Firefox, WebKit).
- [Mandatory] Apply explicit retry logic or strictly rely on Playwright's built-in actionable auto-waiting to overcome stale element references.

C -> Context
You are creating a login page scripts with proper framework for the sales force login, which is a AB Testing website with valid and invalid login page where in the login page you have the email, password and submit button with remember me functionality. 


**E -> Example**
Example structure for PageFactory:

class LoginPage {
    /**
     * @param {import('@playwright/test').Page} page 
     */
    constructor(page) {
        this.page = page;
        this.username = page.locator("//input[@id='username']");
        this.password = page.locator("//input[@id='password']");
        this.loginButton = page.locator("//input[@id='Login']");
    }

    async doLogin(user, pass) {
        await this.username.fill(user);
        await this.password.fill(pass);
        await this.loginButton.click();
    }
}
module.exports = { LoginPage };

**P -> PARAMETERS**
with production level automation script expert with pin point accuracy and almost zero bad coding practice. 

-  I have external URLs, external staging URLs. I will give you the external username and password as well 


O -> Output
Provide only: 

- 1 Page Object file 
- 2 Playwright test scripts
- Node.js project (package.json)
- [Output] - - Output only runnable  code, no explanations, comments, dependencies, or extra text. 
- No explanations or additional content.


T -> Tone 
Technical, precisely, enterprise-grade, code-one.

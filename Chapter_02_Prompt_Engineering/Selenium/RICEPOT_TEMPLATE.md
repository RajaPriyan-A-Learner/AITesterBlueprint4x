Role -> You are a QA automation tester with 15 years of experience, You have a very good understanding of IT, CRM projects like [salesforce.com](https://salesforce.com/). You need to create a framework with Selenium, C#, Specflow, Nunit, and it should be enterprise-level framework that we need to create.



I  -> Instructions

- Generate a Complete Selenium with C# Specflow automation script following the standard of enterprise level standards.
- Automate and verify the results of the login page [login.salesforce.com/?locale=in](https://login.salesforce.com/?locale=in), ensure that UI is thoroughly tested with valid and invalid testcases.
- [Critical] - Apply the Nunit annotations, Test, Setup, TearDown and others and and necessary OneTimeSetUp/OneTimeTearDown/OneTimeSetUpAttribute/OneTimeTearDownAttribute & BeforeScenario/AfterScenario/BeforeScenarioAttribute/AfterScenarioAttribute logic.
- [Critical] Implement robust exception handling within both Page Object model and test scripts using structured try–catch blocks or explicit exception signatures. 
- [Mandatory] Use Page Object Model with Func Delegate locator properties to implement the lazy initialization and overcome the stale element reference exceptions, including FindElement(By.xpath("...")), constructor initialization, and reusable action methods. 
- [Mandatory] - It is important that you use only the xpath not the css selectors. 
- [Don't] - Don't use the css selectors, ID, name and others things.
- [Don't] - Don't add comments, Thread.sleep and other bad coding practice.
- [Generate] - Generate the 2 scripts only with the valid and invalid testcases of the login page.
- [Don't Use] Thread.sleep() anywhere; rely on WebDriverWait or implicit waits. 
- Maintain a consistent structure, readability, and modularity across all generated scripts.
- [Don't Use] TagName and others things.
- [Mandatory] Use the Singleton pattern for webdriver initialization for a test case workflow.
- [Mandatory] Use Thread static (`[ThreadStatic]`) for WebDriver storage to support parallel threads execution.
- [Mandatory] Use Factory pattern for multiple browser webdriver creation.
- [Mandatory] Use Allure report for HTML decorative reporting.
- [Mandatory] Use a text log file to trace back all the steps.

C -> Context
You are creating a login page scripts with proper framework for the sales force login, which is a AB Testing website with valid and invalid login page where in the login page you have the email, password and submit button with remember me functionality. 


**E -> Example**
Example structure for PageFactory:

public class LoginPage {
IWebDriver driver;
IWebElement username=> driver.FindElement(By.xpath("//input[@id='username']"));
IWebElement password=> driver.FindElement(By.xpath("//input[@id='password']"));
IWebElement loginButton=> driver.FindElement(By.xpath("//input[@id='Login']"));

public LoginPage(WebDriver driver) {
    this.driver=driver;
}

public void doLogin(String user, String pass) {
    username.sendKeys(user);
    password.sendKeys(pass);
    loginButton.click();
}

**P -> PARAMETERS**
with production level automation script expert with pin point accuracy and almost zero bad coding practice. 

-  I have external URLs, external staging URLs. I will give you the external username and password as well 


O -> Output
Provide only: 

- 1 Page Object file 
- 2 NUnit test scripts
- C# .NET Core project
- [Output] - - Output only runnable  code, no explanations, comments, dependencies, or extra text. 
- No explanations or additional content.


T -> Tone 
Technical, precisely, enterprise-grade, code-one.


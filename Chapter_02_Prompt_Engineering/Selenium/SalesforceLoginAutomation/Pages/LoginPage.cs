using System;
using OpenQA.Selenium;
using OpenQA.Selenium.Support.UI;
using SalesforceLoginAutomation.Core;

namespace SalesforceLoginAutomation.Pages
{
    public class LoginPage
    {
        private IWebDriver _driver;
        private WebDriverWait _wait;

        public LoginPage(IWebDriver driver)
        {
            _driver = driver;
            _wait = new WebDriverWait(_driver, TimeSpan.FromSeconds(15));
        }

        private IWebElement UsernameField => _driver.FindElement(By.XPath("//input[@type='email']"));
        private IWebElement PasswordField => _driver.FindElement(By.XPath("//input[@type='password']"));
        private IWebElement LoginButton => _driver.FindElement(By.XPath("//input[@type='submit' and @name='Login']"));
        private IWebElement ErrorMessage => _driver.FindElement(By.XPath("//div[@id='error']"));

        public void NavigateTo(string url)
        {
            try
            {
                _driver.Navigate().GoToUrl(url);
                Logger.Log($"Navigated to URL: {url}");
            }
            catch (Exception ex)
            {
                Logger.Log($"Error navigating to {url}: {ex.Message}");
                throw;
            }
        }

        public void DoLogin(string user, string pass)
        {
            try
            {
                _wait.Until(d => UsernameField.Displayed);
                UsernameField.Clear();
                UsernameField.SendKeys(user);
                Logger.Log("Entered username.");

                PasswordField.Clear();
                PasswordField.SendKeys(pass);
                Logger.Log("Entered password.");

                LoginButton.Click();
                Logger.Log("Clicked login button.");
            }
            catch (Exception ex)
            {
                Logger.Log($"Error during login action: {ex.Message}");
                throw;
            }
        }

        public string GetErrorMessage()
        {
            try
            {
                _wait.Until(d => ErrorMessage.Displayed);
                string text = ErrorMessage.Text;
                Logger.Log($"Retrieved error message: {text}");
                return text;
            }
            catch (Exception ex)
            {
                Logger.Log($"Error retrieving error message: {ex.Message}");
                throw;
            }
        }

        public bool IsLoginSuccessful()
        {
            try
            {
                _wait.Until(d => _driver.Url.Contains("home"));
                bool isSuccess = _driver.Url.Contains("home");
                Logger.Log($"Login success verification: {isSuccess}");
                return isSuccess;
            }
            catch (WebDriverTimeoutException)
            {
                Logger.Log("Login success verification failed due to timeout.");
                return false;
            }
            catch (Exception ex)
            {
                Logger.Log($"Error during login verification: {ex.Message}");
                throw;
            }
        }
    }
}

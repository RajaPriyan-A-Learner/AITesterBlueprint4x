using System;
using OpenQA.Selenium;
using OpenQA.Selenium.Chrome;
using OpenQA.Selenium.Edge;
using OpenQA.Selenium.Firefox;

namespace SalesforceLoginAutomation.Core
{
    public static class WebDriverFactory
    {
        public static IWebDriver CreateDriver(string browserName)
        {
            try
            {
                switch (browserName.ToLower())
                {
                    case "chrome":
                        return new ChromeDriver();
                    case "firefox":
                        return new FirefoxDriver();
                    case "edge":
                        return new EdgeDriver();
                    default:
                        throw new ArgumentException($"Browser not supported: {browserName}");
                }
            }
            catch (Exception ex)
            {
                Logger.Log($"Error creating WebDriver for {browserName}: {ex.Message}");
                throw;
            }
        }
    }
}

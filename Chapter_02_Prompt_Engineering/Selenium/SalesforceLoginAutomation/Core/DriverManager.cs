#nullable disable
using System;
using OpenQA.Selenium;

namespace SalesforceLoginAutomation.Core
{
    public sealed class DriverManager
    {
        private static readonly object _lock = new object();
        private static DriverManager _instance = null;

        [ThreadStatic]
        private static IWebDriver _driver;

        private DriverManager() { }

        public static DriverManager Instance
        {
            get
            {
                lock (_lock)
                {
                    if (_instance == null)
                    {
                        _instance = new DriverManager();
                    }
                    return _instance;
                }
            }
        }

        public IWebDriver Driver
        {
            get { return _driver; }
            set { _driver = value; }
        }

        public void InitDriver(string browserName)
        {
            try
            {
                _driver = WebDriverFactory.CreateDriver(browserName);
                _driver.Manage().Window.Maximize();
                _driver.Manage().Timeouts().ImplicitWait = TimeSpan.FromSeconds(10);
                Logger.Log($"Driver initialized for browser: {browserName}");
            }
            catch (Exception ex)
            {
                Logger.Log($"Driver initialization failed: {ex.Message}");
                throw;
            }
        }

        public void QuitDriver()
        {
            try
            {
                if (_driver != null)
                {
                    _driver.Quit();
                    _driver.Dispose();
                    _driver = null;
                    Logger.Log("Driver quit successfully.");
                }
            }
            catch (Exception ex)
            {
                Logger.Log($"Error during driver quit: {ex.Message}");
            }
        }
    }
}

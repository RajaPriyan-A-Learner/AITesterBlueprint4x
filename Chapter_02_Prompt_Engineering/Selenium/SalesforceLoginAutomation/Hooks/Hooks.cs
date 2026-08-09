using System;
using TechTalk.SpecFlow;
using SalesforceLoginAutomation.Core;

namespace SalesforceLoginAutomation.Hooks
{
    [Binding]
    public class Hooks
    {
        [BeforeScenario]
        public void BeforeScenario()
        {
            try
            {
                Logger.Log("Starting test scenario setup.");
                DriverManager.Instance.InitDriver("chrome");
            }
            catch (Exception ex)
            {
                Logger.Log($"Error in BeforeScenario: {ex.Message}");
                throw;
            }
        }

        [AfterScenario]
        public void AfterScenario()
        {
            try
            {
                Logger.Log("Ending test scenario, tearing down driver.");
                DriverManager.Instance.QuitDriver();
            }
            catch (Exception ex)
            {
                Logger.Log($"Error in AfterScenario: {ex.Message}");
            }
        }
    }
}

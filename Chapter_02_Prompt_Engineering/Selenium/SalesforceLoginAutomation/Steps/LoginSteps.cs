using NUnit.Framework;
using TechTalk.SpecFlow;
using SalesforceLoginAutomation.Pages;
using SalesforceLoginAutomation.Core;
using System;

namespace SalesforceLoginAutomation.Steps
{
    [Binding]
    public class LoginSteps
    {
        private LoginPage _loginPage;

        public LoginSteps()
        {
            try
            {
                _loginPage = new LoginPage(DriverManager.Instance.Driver);
                Logger.Log("LoginSteps initialized with LoginPage.");
            }
            catch (Exception ex)
            {
                Logger.Log($"Error initializing LoginSteps: {ex.Message}");
                throw;
            }
        }

        [Given(@"I navigate to the Salesforce login page ""(.*)""")]
        public void GivenINavigateToTheSalesforceLoginPage(string url)
        {
            try
            {
                _loginPage.NavigateTo(url);
            }
            catch (Exception ex)
            {
                Logger.Log($"Step GivenINavigateToTheSalesforceLoginPage failed: {ex.Message}");
                throw;
            }
        }

        [When(@"I enter valid username ""(.*)"" and password ""(.*)""")]
        public void WhenIEnterValidUsernameAndPassword(string username, string password)
        {
            try
            {
                _loginPage.DoLogin(username, password);
            }
            catch (Exception ex)
            {
                Logger.Log($"Step WhenIEnterValidUsernameAndPassword failed: {ex.Message}");
                throw;
            }
        }

        [When(@"I enter invalid username ""(.*)"" and password ""(.*)""")]
        public void WhenIEnterInvalidUsernameAndPassword(string username, string password)
        {
            try
            {
                _loginPage.DoLogin(username, password);
            }
            catch (Exception ex)
            {
                Logger.Log($"Step WhenIEnterInvalidUsernameAndPassword failed: {ex.Message}");
                throw;
            }
        }

        [When(@"I click the login button")]
        public void WhenIClickTheLoginButton()
        {
            try
            {
                Logger.Log("Click login handled within DoLogin method.");
            }
            catch (Exception ex)
            {
                Logger.Log($"Step WhenIClickTheLoginButton failed: {ex.Message}");
                throw;
            }
        }

        [Then(@"I should be successfully logged in")]
        public void ThenIShouldBeSuccessfullyLoggedIn()
        {
            try
            {
                bool result = _loginPage.IsLoginSuccessful();
                Assert.That(result, Is.True, "Login was not successful.");
                Logger.Log("Step ThenIShouldBeSuccessfullyLoggedIn passed.");
            }
            catch (Exception ex)
            {
                Logger.Log($"Step ThenIShouldBeSuccessfullyLoggedIn failed: {ex.Message}");
                throw;
            }
        }

        [Then(@"I should see an error message")]
        public void ThenIShouldSeeAnErrorMessage()
        {
            try
            {
                string errorMessage = _loginPage.GetErrorMessage();
                Assert.That(errorMessage, Is.Not.Empty, "Error message was empty.");
                Logger.Log($"Step ThenIShouldSeeAnErrorMessage passed. Message: {errorMessage}");
            }
            catch (Exception ex)
            {
                Logger.Log($"Step ThenIShouldSeeAnErrorMessage failed: {ex.Message}");
                throw;
            }
        }
    }
}

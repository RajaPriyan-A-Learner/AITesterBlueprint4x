Feature: Login
  In order to access my Salesforce account
  As a registered user
  I want to be able to log in with valid credentials and see errors for invalid ones

  Scenario: Valid Login
    Given I navigate to the Salesforce login page "https://login.salesforce.com/?locale=in"
    When I enter valid username "valid_user@example.com" and password "ValidPassword123!"
    And I click the login button
    Then I should be successfully logged in

  Scenario: Invalid Login
    Given I navigate to the Salesforce login page "https://login.salesforce.com/?locale=in"
    When I enter invalid username "invalid_user@example.com" and password "WrongPassword"
    And I click the login button
    Then I should see an error message

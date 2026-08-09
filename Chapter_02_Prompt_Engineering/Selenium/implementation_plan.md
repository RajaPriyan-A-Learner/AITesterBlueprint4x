# Salesforce Login Automation Framework Plan

This plan is based on the updated requirements extracted from the `RICEPOT_TEMPLATE.md` file. As requested, this phase is strictly for planning and understanding, with no code generation or commits.

## Goal Description
Design an enterprise-grade QA automation framework for the Salesforce login page. The framework will utilize C#, Selenium WebDriver, SpecFlow (for BDD), and NUnit (for assertions and execution). The goal is to produce highly robust, production-ready code with zero bad coding practices.

## Understanding of the Requirements

Based on the updated `RICEPOT_TEMPLATE.md`, here is my complete understanding of your instructions:

### Technology Stack & Architecture
- **Language**: C#
- **UI Automation**: Selenium WebDriver
- **BDD Framework**: SpecFlow
- **Test Runner / Assertions**: NUnit
- **Design Pattern**: Page Object Model (POM) using C# expression-bodied properties (e.g., `=> driver.FindElement(...)`) for lazy initialization to prevent `StaleElementReferenceException`.
- **WebDriver Management**: 
  - **Singleton Pattern**: Ensure a single WebDriver instance is maintained per test workflow.
  - **Factory Pattern**: Dynamically generate WebDriver instances for multiple browser types (Chrome, Edge, Firefox, etc.).
  - **Parallel Execution**: Utilize `[ThreadStatic]` to store WebDriver instances, ensuring thread safety when running tests in parallel.

### Scope of Work
- Target URL: `login.salesforce.com/?locale=in`
- Deliverables: 
  1. One Page Object file for the Login Page.
  2. Two NUnit test scripts (Valid Login and Invalid Login).
  3. A C# .NET Core project structure.

### Strict Coding Standards & Constraints
- **Locators**: Exclusively use **XPath**. The use of CSS Selectors, ID, Name, or TagName is strictly prohibited.
- **Waits**: Exclusively use `WebDriverWait` (Explicit) or Implicit Waits. `Thread.Sleep()` is strictly prohibited.
- **Annotations**: Proper use of NUnit attributes (`[SetUp]`, `[TearDown]`, `[OneTimeSetUp]`, etc.) and SpecFlow hooks (`[BeforeScenario]`, `[AfterScenario]`).
- **Exception Handling**: Robust use of `try-catch` blocks within POM and test scripts.
- **Reporting & Logging**:
  - Implement **Allure Reports** for decorative HTML reporting.
  - Generate a **text log file** to trace back all step-by-step actions.
- **Code Cleanliness**: No comments, no explanations, no extra text—only runnable code.

## Proposed Components

Once execution is approved (and when code generation is allowed), the structure would look like this:

### 1. Core Framework Infrastructure
- **`WebDriverFactory.cs`**: Factory class to spin up different browsers (Chrome, Firefox, etc.).
- **`DriverManager.cs`**: Singleton manager using `[ThreadStatic]` to store and retrieve the driver safely for parallel threads.
- **`Logger.cs`**: Utility class to log execution traces into a text file.

### 2. Page Object Model (POM)
- **`LoginPage.cs`**: Will contain XPath-only locators using lambda expressions for lazy evaluation and robust interaction methods (e.g., `DoLogin`) wrapped in `try-catch` blocks. Actions will trigger logger events and integrate with Allure.

### 3. SpecFlow Feature & Step Definitions
- **`Login.feature`**: Will define the two scenarios (Valid and Invalid login) in Gherkin syntax.
- **`LoginSteps.cs`**: Will contain the NUnit assertions and step bindings, calling the POM methods.

### 4. Framework Configuration (Hooks)
- **`Hooks.cs`**: Will manage WebDriver setup (via Factory & Manager), teardown, Allure attachments, and logging initialization using SpecFlow `[BeforeScenario]` and `[AfterScenario]` attributes.

## User Review Required

Please review the updated plan that now incorporates the C#/NUnit technology stack, the advanced WebDriver management patterns (Singleton/Factory/ThreadStatic), Allure reporting, and text logging.

*(Note: As per your original instruction, no code has been generated and no commits/pushes have been made.)*

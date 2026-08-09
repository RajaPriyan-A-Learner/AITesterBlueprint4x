# Knowledge Base: Prompt Engineering

**Last Updated**: 2026-08-09
**Audience**: QA Engineers, Testers, AI Learners
**Level**: Beginner to Intermediate
**Source Chapter**: Chapter_02_Prompt_Engineering

---

## TABLE OF CONTENTS

1. [Context: Chapter Focus & Industry Shift](#context)
2. [Core Concepts & Definitions](#concepts)
3. [Technical Deep-Dives: API & UI Frameworks](#technical)
4. [Architecture & Patterns](#architecture)
5. [Application: Practical Prompt Templates](#application)
6. [RICEPOT Templates: Selenium vs Playwright](#ricepot)
7. [Common Pitfalls & How to Avoid](#pitfalls)
8. [Interview Q&A](#qa)
9. [Quick Reference](#quickref)
10. [Reference & Resources](#reference)

---

## Context: Chapter Focus & Industry Shift
<a id="context"></a>

Prompt Engineering has become the foundational skill for AI-assisted Quality Assurance. Instead of manually writing boilerplate automation code or repetitive test cases, modern QA Engineers now "engineer" constraints, context, and structured templates. This paradigm shift enables the deterministic generation of enterprise-grade automation frameworks and highly accurate test documentation.

### Why This Matters?
Relying on generic AI prompts leads to hallucinations (invented error codes, assumed features, or nonexistent locators). By applying structured prompt frameworks, QAs can enforce strict boundaries. This ensures that the generated Page Object Models, Test Scripts, and Bug Reports are perfectly aligned with Product Requirements Documents (PRDs) and actual system evidence.

### Real-World Application
The Chapter 02 repository demonstrates this end-to-end: from RICEPOT templates that generate entire Salesforce login automation frameworks (both Selenium/C# and Playwright/JS), to 16 specialized prompt templates that cover test generation, bug management, and API testing — each with a practical filled-in example.

---

## Core Concepts & Definitions
<a id="concepts"></a>

### Structured Prompting Frameworks
- **RICE POT Framework**: Stands for Role, Instructions, Context, Example, Parameters, Output, Tone. This framework enforces the "95% Plan, 5% Execution" mindset, ensuring the AI fully understands the environment and constraints before generating code.
  - Source: [Playwright RICEPOT_TEMPLATE.md](file:///c:/Users/rajap/OneDrive/%E0%B9%80%E0%B8%AD%E0%B8%81%E0%B8%AA%E0%B8%B2%E0%B8%A3/LEARNINGAITESTER4X/Chapter_02_Prompt_Engineering/Playwright/RICEPOT_TEMPLATE.md), [Selenium RICEPOT_TEMPLATE.md](file:///c:/Users/rajap/OneDrive/%E0%B9%80%E0%B8%AD%E0%B8%81%E0%B8%AA%E0%B8%B2%E0%B8%A3/LEARNINGAITESTER4X/Chapter_02_Prompt_Engineering/Selenium/RICEPOT_TEMPLATE.md)
- **RACE (Role, Action, Context, Expectation)**: Ideal for targeted QA tasks like writing Bug Reports from informal notes. It ensures the AI knows exactly what is expected (e.g., a Jira-ready ticket) without unnecessary filler.
  - Source: [Prompt_Frameworks.md](file:///c:/Users/rajap/OneDrive/%E0%B9%80%E0%B8%AD%E0%B8%81%E0%B8%AA%E0%B8%B2%E0%B8%A3/LEARNINGAITESTER4X/IQ_Notes/Prompt_Frameworks.md)
- **CRISP / CRAP**: Context, Role, Action, Parameters, Instructions. A streamlined approach for generating quick, constrained outputs.
- **COAST**: Context, Objective, Action, Style, Tone. Used when presentation and communication style matter (e.g., writing status reports or stakeholder summaries).
- **CLASSIC Role Model**: "You are X, behave like Y, produce Z." This assigns a strict persona (e.g., "You are a Senior Security Tester") to govern the AI's behavior.

### Anti-Hallucination Layered Defense
A 5-layer system enforced across all templates:
1. **Negative Constraints**: "Do NOT assume undocumented behavior."
2. **Forced Uncertainty Markers**: Output `[UNKNOWN]`, `[NEEDS CLARIFICATION]`, or `Hypothesis` instead of inventing.
3. **Source Anchoring**: "Use ONLY the provided requirements."
4. **Scope Restriction**: "Do NOT include happy path scenarios."
5. **Anti-Hallucination Reminder (Template 10)**: A portable snippet appended to any prompt.

---

## Technical Deep-Dives: API & UI Frameworks
<a id="technical"></a>

### Automated UI Framework Generation (Playwright & Selenium)
When prompting for UI automation frameworks, specific architectural rules must be enforced:

**Selenium Implementation (C# / NUnit / Specflow)**
Source: [Selenium RICEPOT_TEMPLATE.md](file:///c:/Users/rajap/OneDrive/%E0%B9%80%E0%B8%AD%E0%B8%81%E0%B8%AA%E0%B8%B2%E0%B8%A3/LEARNINGAITESTER4X/Chapter_02_Prompt_Engineering/Selenium/RICEPOT_TEMPLATE.md)
- `[Mandatory]` Singleton pattern for WebDriver initialization.
- `[Mandatory]` `[ThreadStatic]` for WebDriver storage — enables parallel NUnit threads.
- `[Mandatory]` Factory pattern for multiple browser WebDriver creation.
- `[Mandatory]` Func Delegate locator properties (`IWebElement username => driver.FindElement(...)`) for lazy initialization.
- `[Don't]` `Thread.Sleep()`, CSS selectors, IDs, TagNames, comments.
- `[Mandatory]` Allure reports + text log files for traceability.

**Playwright Implementation (JavaScript)**
Source: [Playwright RICEPOT_TEMPLATE.md](file:///c:/Users/rajap/OneDrive/%E0%B9%80%E0%B8%AD%E0%B8%81%E0%B8%AA%E0%B8%B2%E0%B8%A3/LEARNINGAITESTER4X/Chapter_02_Prompt_Engineering/Playwright/RICEPOT_TEMPLATE.md)
- `[Mandatory]` Isolated native fixtures (`page`, `context`) for parallel execution.
- `[Mandatory]` Constructor-based locator initialization (`this.username = page.locator(...)`) for lazy evaluation.
- `[Mandatory]` Factory pattern for cross-browser context (Chromium, Firefox, WebKit).
- `[Mandatory]` Playwright's built-in auto-waiting for stale element handling.
- `[Don't]` `page.waitForTimeout()`, CSS selectors, IDs, TagNames, comments.
- `[Mandatory]` Allure reports + text log files for traceability.

### API Testing Scenarios
API testing requires strict categorical prompts to ensure full coverage:
- **Input Validation** (Template 12): Required fields missing, invalid data types, boundary values (min/max), invalid formats, empty strings vs null, special characters.
- **Authentication/Security** (Template 13): No token, invalid token, expired token, wrong permissions, token tampering, rate limiting.
- **Contract Testing** (Template 14): Response schema matches spec, required fields present, data types correct, nullable fields handled, array bounds respected.
- **Performance Scenarios** (Template 15): Baseline, load, stress, spike, endurance tests with RPS-based pass/fail criteria.
- **Error Handling** (Template 16): Client errors (4xx), server errors (5xx), timeout handling, malformed requests, safe error messages (no stack traces).

---

## Architecture & Patterns
<a id="architecture"></a>

When generating automation code, prompt templates enforce strict design patterns:
- **Page Object Model (POM)**: Strict separation of locators and actions. Locators must be initialized using lazy evaluation (e.g., C# expression-bodied members `=>` or JS constructor locators) to completely eliminate `StaleElementReferenceException`.
- **Factory Pattern**: Cross-browser context instantiation (Chromium, Firefox, WebKit, Edge). The AI is prompted to build a central `playwright.config.js` or `WebDriverFactory`.
- **Singleton Pattern** (Selenium only): One WebDriver instance per test case workflow, managed via `[ThreadStatic]`.
- **Explicit Synchronization**: Templates strictly ban the use of `Thread.Sleep()` or `page.waitForTimeout()`, forcing the AI to rely exclusively on Playwright's auto-waiting or Selenium's explicit `WebDriverWait`.
- **Locator Strategy**: Strict enforcement of **XPath only**. CSS selectors, IDs, and tags are prohibited by the prompt parameters.
- **Hooks Architecture**: Selenium uses NUnit `[SetUp]`/`[TearDown]`/`[OneTimeSetUp]`; Playwright uses `test.beforeAll`/`test.afterAll`/`test.beforeEach`/`test.afterEach`.

---

## Application: Practical Prompt Templates
<a id="application"></a>

The Chapter 02 knowledge base includes **18 organized folders** (16 templates + 2 PRD variants), each containing a blank template AND a filled real-world example:

### Test Case Generation
| Folder | Template Purpose | Example Scenario |
|---|---|---|
| `01_Test_case_Generation` | Base test case generation from requirements | Salesforce User Login (5 tests) |
| `02_PRD_to_Test_cases` | Comprehensive PRD extraction | Profile Picture Upload feature |
| `04_Negative_Test_Cases_Only` | Invalid inputs only, no happy paths | Checkout Payment Form validation |
| `05_Regression_Test_Suite` | Prioritized regression with time estimates | Shopping Cart with Stripe/FedEx |

### Bug Management
| Folder | Template Purpose | Example Scenario |
|---|---|---|
| `06_Basic_Bug_report_From_Evidence` | Bug report from logs/screenshots | NullReferenceException in PaymentProcessor |
| `07_Bug_Classification` | Severity/Priority classification | "Export to PDF" button unresponsive on Safari |
| `08_Bug_Analysis` | Chain-of-Thought step-by-step analysis | iOS 17 app crash on rapid logout taps |
| `09_Convert_Notes_To_Bug_Report` | Informal notes → formal Jira ticket | German translation missing on checkout |

### API Testing
| Folder | Template Purpose | Example Scenario |
|---|---|---|
| `03_API_Test_case_Generation` | Basic API endpoint test generation | POST /api/v1/login authentication |
| `11_Rest_API_Test_Suite` | Full endpoint coverage suite | GET /api/v1/users/{id} with Bearer auth |
| `12_API_Validation_Tests` | Input validation (boundaries, types) | POST /api/v1/register field constraints |
| `13_API_Authentication_Tests` | OAuth 2.0 / token security testing | DELETE /api/v1/documents/{id} scopes |
| `14_API_Contract_Testing` | JSON schema structural validation | Product schema (UUID, nullable arrays) |
| `15_AP_Performance_test_Scenarios` | Load/stress/spike/endurance design | GET /api/v1/dashboard/metrics (500 RPS) |
| `16_API_Error_Handling_Tests` | 4xx/5xx error mapping validation | Payment Gateway error spec |

### Guardrails
| Folder | Template Purpose | Example Scenario |
|---|---|---|
| `10_Anti_Hallucination_reminder` | Portable "append to any prompt" guardrail | Shows how to inject into existing prompts |

---

## RICEPOT Templates: Selenium vs Playwright
<a id="ricepot"></a>

Two complete RICEPOT templates exist in the repo, demonstrating the same framework philosophy applied to two different technology stacks:

| RICEPOT Element | Selenium (C# / NUnit) | Playwright (JavaScript) |
|---|---|---|
| **Role** | 15 YOE QA, CRM/Salesforce expert | 15 YOE QA, CRM/Salesforce expert |
| **Instructions** | 23 constraints (Singleton, ThreadStatic, Factory, Allure, XPath-only) | 23 constraints (Fixtures, Factory, Allure, XPath-only) |
| **Context** | Salesforce login with email/password/submit/remember me | Same |
| **Example** | C# POM with `IWebElement => driver.FindElement(By.xpath(...))` | JS POM with `this.username = page.locator(...)` |
| **Parameters** | Production-level, zero bad practices | Same |
| **Output** | 1 POM + 2 NUnit test scripts + .NET Core project | 1 POM + 2 Playwright test scripts + Node.js project |
| **Tone** | Technical, enterprise-grade, code-only | Same |

---

## Common Pitfalls & How to Avoid
<a id="pitfalls"></a>

The **Anti-Hallucination Reminder (Template 10)** outlines the critical pitfalls when engineering prompts:

| Pitfall | ❌ WRONG (Hallucination) | ✅ RIGHT (Constrained) |
|---------|---------|---------|
| **Assuming Root Cause** | "The database crashed because..." | "Hypothesis: Database timeout. Actual cause [UNKNOWN]." |
| **Inventing Error Codes** | "Expect Error 404 for invalid email" | "Use ONLY error codes provided in the API spec." |
| **Guessing System Behavior** | Generating expected results not in PRD | "If expected result is unmentioned, state '[NEEDS CLARIFICATION]'." |
| **Vague Context** | "Test the login page" | "Test the Salesforce login page at staging URL with MFA enabled." |
| **Missing Role** | "Write a test script" | "ROLE: You are an API QA Engineer..." |
| **Using CSS/ID locators** | `driver.FindElement(By.Id("login"))` | `driver.FindElement(By.xpath("//input[@id='Login']"))` |
| **Hardcoded waits** | `Thread.Sleep(3000)` or `page.waitForTimeout(3000)` | `WebDriverWait` or Playwright auto-waiting |

---

## Interview Q&A
<a id="qa"></a>

**Q1: How do you prevent an AI from hallucinating requirements or error messages?**
A: By implementing "Negative Constraints" in your prompt frameworks (like RICE POT). For example, explicitly stating "Do NOT assume undocumented behavior," "Do NOT invent error messages," and requiring the AI to output "[UNKNOWN]" or "[NEEDS CLARIFICATION]" when data is missing.

**Q2: When automating UI tests via AI prompts, how do you handle Stale Element Exceptions?**
A: You constrain the AI in the "Parameters" section of your prompt to strictly implement lazy evaluation for locators in the Page Object Model (e.g., using `=>` in C# or constructor-based `page.locator()` in Playwright) and to rely exclusively on explicit waits rather than static `Thread.Sleep()`.

**Q3: What is the difference between the RACE and RICE POT frameworks?**
A: RACE (Role, Action, Context, Expectation) is a concise framework ideal for targeted, singular tasks like converting notes into a bug report. RICE POT (Role, Instructions, Context, Example, Parameters, Output, Tone) is a highly detailed, comprehensive framework used for heavy-lifting tasks, like generating an entire Playwright automation architecture from scratch.

**Q4: How does the same RICEPOT prompt differ between Selenium and Playwright?**
A: The core structure (Role, Context, Tone) remains identical. The key differences are in Instructions and Example: Selenium mandates `[ThreadStatic]`, Singleton, and `Func<>` delegate locators for thread safety; Playwright leverages native isolated fixtures and constructor-based `page.locator()` calls. The Output also differs (NUnit/.NET vs Playwright Test/Node.js).

---

## Quick Reference
<a id="quickref"></a>

| Need To... | Use Template | Folder |
|---|---|---|
| Generate test cases from requirements | Template 01 | `01_Test_case_Generation` |
| Extract tests from a PRD | Template 02 | `02_PRD_to_Test_cases` |
| Generate API endpoint tests | Template 03 | `03_API_Test_case_Generation` |
| Generate ONLY negative/invalid tests | Template 04 | `04_Negative_Test_Cases_Only` |
| Plan a regression suite | Template 05 | `05_Regression_Test_Suite` |
| Write a bug report from evidence | Template 06 | `06_Basic_Bug_report_From_Evidence` |
| Classify bug severity/priority | Template 07 | `07_Bug_Classification` |
| Analyze a bug step-by-step | Template 08 | `08_Bug_Analysis` |
| Convert informal notes to a ticket | Template 09 | `09_Convert_Notes_To_Bug_Report` |
| Append anti-hallucination guardrails | Template 10 | `10_Anti_Hallucination_reminder` |
| Full REST API test suite | Template 11 | `11_Rest_API_Test_Suite` |
| API input validation tests | Template 12 | `12_API_Validation_Tests` |
| API auth/security tests | Template 13 | `13_API_Authentication_Tests` |
| API contract/schema tests | Template 14 | `14_API_Contract_Testing` |
| API performance test scenarios | Template 15 | `15_AP_Performance_test_Scenarios` |
| API error handling tests | Template 16 | `16_API_Error_Handling_Tests` |
| Generate Selenium/C# framework | RICEPOT | `Selenium/RICEPOT_TEMPLATE.md` |
| Generate Playwright/JS framework | RICEPOT | `Playwright/RICEPOT_TEMPLATE.md` |

---

## Reference & Resources
<a id="reference"></a>

- [Prompt Engineering Quick Reference](file:///c:/Users/rajap/OneDrive/%E0%B9%80%E0%B8%AD%E0%B8%81%E0%B8%AA%E0%B8%B2%E0%B8%A3/LEARNINGAITESTER4X/Prompt_Engineering_Templates/Quick_Reference.md)
- [Prompt Fundamentals Base](file:///c:/Users/rajap/OneDrive/%E0%B9%80%E0%B8%AD%E0%B8%81%E0%B8%AA%E0%B8%B2%E0%B8%A3/LEARNINGAITESTER4X/Prompt_Engineering_Templates/Prompt_Fundamentals.md)
- [Playwright RICEPOT Template](file:///c:/Users/rajap/OneDrive/%E0%B9%80%E0%B8%AD%E0%B8%81%E0%B8%AA%E0%B8%B2%E0%B8%A3/LEARNINGAITESTER4X/Chapter_02_Prompt_Engineering/Playwright/RICEPOT_TEMPLATE.md)
- [Selenium RICEPOT Template](file:///c:/Users/rajap/OneDrive/%E0%B9%80%E0%B8%AD%E0%B8%81%E0%B8%AA%E0%B8%B2%E0%B8%A3/LEARNINGAITESTER4X/Chapter_02_Prompt_Engineering/Selenium/RICEPOT_TEMPLATE.md)
- [Playwright Framework Walkthrough](file:///c:/Users/rajap/OneDrive/%E0%B9%80%E0%B8%AD%E0%B8%81%E0%B8%AA%E0%B8%B2%E0%B8%A3/LEARNINGAITESTER4X/Chapter_02_Prompt_Engineering/Playwright/walkthrough.md)
- [Selenium Framework Walkthrough](file:///c:/Users/rajap/OneDrive/%E0%B9%80%E0%B8%AD%E0%B8%81%E0%B8%AA%E0%B8%B2%E0%B8%A3/LEARNINGAITESTER4X/Chapter_02_Prompt_Engineering/Selenium/walkthrough.md)
- [Prompt Frameworks (CRISP, RACE, COAST, CLASSIC)](file:///c:/Users/rajap/OneDrive/%E0%B9%80%E0%B8%AD%E0%B8%81%E0%B8%AA%E0%B8%B2%E0%B8%A3/LEARNINGAITESTER4X/IQ_Notes/Prompt_Frameworks.md)
- [Lead SDET Interview Q&A](file:///c:/Users/rajap/OneDrive/%E0%B9%80%E0%B8%AD%E0%B8%81%E0%B8%AA%E0%B8%B2%E0%B8%A3/LEARNINGAITESTER4X/IQ_Notes/Interview_QA_Lead_SDET_Prompt_Engineering.md)

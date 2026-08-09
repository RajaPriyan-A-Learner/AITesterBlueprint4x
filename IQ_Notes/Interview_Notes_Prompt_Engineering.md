# Interview Notes: Prompt Engineering for QA

**Folder:** IQ_Notes
**Target Audience:** QA Engineers, Automation Testers, SDETs preparing for AI/LLM-focused roles.

---

## 1. What is Prompt Engineering in QA?
Prompt Engineering is the practice of designing, structuring, and refining inputs (prompts) to Large Language Models (LLMs) to generate deterministic, accurate, and high-quality outputs. In a QA context, this replaces manual boilerplate coding with engineered constraints that generate automation frameworks, test cases, and bug reports without hallucinations.

---

## 2. Types of Prompt Engineering
- **Zero-Shot Prompting**: Asking the model to perform a task without providing any examples. (e.g., "Write a test case for login.")
- **Few-Shot Prompting**: Providing a few examples to guide the model's output structure and tone. (e.g., Providing an example of a negative test case before asking it to generate more).
- **Chain-of-Thought (CoT)**: Forcing the AI to break down a complex problem into logical steps before outputting the final answer (e.g., "Analyze this bug report step-by-step").
- **Role Model Prompting**: Assigning a persona to the AI (e.g., "You are a Senior QA Engineer").
- **Constrained Prompting**: Using strict negative constraints (e.g., "Do NOT assume undocumented behavior").

---

## 3. Core Principles & Structuring Strategies
1. **The 95/5 Rule**: 95% of the effort should be in planning and engineering the prompt's constraints and context; only 5% is the actual execution/generation.
2. **Anti-Hallucination Guardrails**:
   - Explicitly instruct the AI what *not* to do.
   - Example: "Use ONLY provided evidence."
   - Example: "If information is missing, explicitly state '[UNKNOWN]' or '[NEEDS CLARIFICATION]'."
3. **Strict Formatting**: Always mandate the exact output format (Tables, Markdown, JSON) to ensure the AI doesn't add conversational filler.

---

## 4. Prompting Frameworks Used in QA
To structure complex tasks, specific frameworks are used:

### RICE POT (Heavy-Lifting / Framework Generation)
- **R**ole: Who is the AI? (e.g., Senior SDET)
- **I**nstructions: What must the AI do? (e.g., Generate a Playwright POM)
- **C**ontext: What is the environment? (e.g., Testing Salesforce Login)
- **E**xample: Give a sample output.
- **P**arameters: What are the strict rules? (e.g., XPath only, No Thread.Sleep)
- **O**utput: What format? (e.g., Markdown code blocks)
- **T**one: Professional, concise.

### RACE (Targeted Tasks / Bug Reporting)
- **R**ole: API Testing Specialist.
- **A**ction: Generate auth test cases.
- **C**ontext: OAuth 2.0 Bearer tokens.
- **E**xpectation: A markdown table with expected status codes.

### CRISP (Quick Iterations)
- **C**ontext, **R**ole, **I**nstructions, **S**trict Parameters.

### CLASSIC
- "You are X, behave like Y, produce Z."

---

## 5. The 16 Templates Defined in the Repository
Our repository utilizes 16 specialized templates that enforce these frameworks for different QA domains:

### **Test Generation (Templates 01, 02, 04, 05)**
- **01. Test Case Generation**: Base template for generating standardized test cases.
- **02. PRD to Test Cases**: Extracts functional/edge cases directly from Product Requirement Docs.
- **04. Negative Test Cases Only**: Strictly forbids happy paths; focuses entirely on invalid inputs and boundaries.
- **05. Regression Test Suite**: Prioritizes critical business flows and fragile areas.

### **Bug Management (Templates 06, 07, 08, 09)**
- **06. Bug Report From Evidence**: Converts logs/screenshots into Jira-ready tickets.
- **07. Bug Classification**: Determines Severity/Priority based strictly on defined criteria.
- **08. Bug Analysis**: Step-by-step breakdown (Chain-of-Thought) separating verified facts from hypotheses.
- **09. Convert Notes to Bug Report**: Transforms informal testing notes into formal reports.

### **API Testing (Templates 11, 12, 13, 14, 15, 16)**
- **11. REST API Test Suite**: Full endpoint coverage (methods, bodies, status codes).
- **12. API Validation**: Boundary values, missing fields, invalid types.
- **13. API Authentication**: Expired tokens, missing headers, unauthorized scopes.
- **14. API Contract Testing**: Validates JSON schema (types, nullables, required fields).
- **15. API Performance**: Scenarios for load, stress, spike, and endurance testing based on RPS.
- **16. API Error Handling**: Validates client (4xx) and server (5xx) error mappings.

### **Guardrails (Template 10)**
- **10. Anti-Hallucination Reminder**: A snippet appended to prompts enforcing strict negative constraints (No guessing, no inventing error codes).

---

## 6. Principal SDET Interview Questions (Product-Based Companies)

**Q1: How do you prevent an LLM from hallucinating requirements or generating false assertions?**
**A:** By using Constrained Prompting and negative guardrails. I explicitly state negative constraints like "Do NOT assume undocumented behavior" and mandate that the AI must output "[NEEDS CLARIFICATION]" if a requirement is missing from the provided context. At a systemic pipeline level, I also integrate strict output parsing (e.g., JSON Schema validation) to ensure the LLM's output conforms exactly to our expected data types before it is executed.

**Q2: As a Principal SDET, how would you architect an AI-driven automation framework from scratch using the RICE POT framework?**
**A:** RICE POT (Role, Instructions, Context, Example, Parameters, Output, Tone) is crucial for heavy-lifting architectural generation. I would define the **Role** as a Principal Architect. **Instructions** would focus on generating a Page Object Model. **Context** would define the stack (e.g., Playwright/JS). Crucially, for **Parameters**, I enforce strict enterprise design patterns: Factory pattern for cross-browser instantiation, isolated native fixtures for parallel execution, and strict XPath locators with explicit auto-waiting. This ensures the AI generates scalable, thread-safe code rather than generic, flaky scripts.

**Q3: How do you handle and prevent flaky tests generated by LLMs in a CI/CD pipeline?**
**A:** Flakiness in AI-generated tests often stems from poor locator strategies and implicit waits. I solve this preemptively at the prompt level by explicitly banning `Thread.Sleep` (or `page.waitForTimeout`) and enforcing robust, lazy-evaluated locator strategies. If a test is flaky post-generation, I use a Bug Analysis template (Chain-of-Thought). I feed the CI failure logs back to the LLM, forcing it to explicitly separate verified facts from hypotheses before suggesting a targeted fix.

**Q4: Product companies release frequently. How do you use Prompt Engineering to speed up in-sprint automation?**
**A:** I use targeted Prompt Frameworks like RACE (Role, Action, Context, Expectation). During sprint planning, as soon as a PRD or OpenAPI spec is ready, I feed it into our targeted templates (e.g., Template 02 for PRDs, Template 11 for REST APIs). By enforcing negative constraints (like using Template 04 to say "Do NOT include happy path scenarios"), I can instantly generate exhaustive edge cases and boundary tests, allowing the team to shift-left and build automation simultaneously with development.

**Q5: LLM API costs can spiral out of control in large testing organizations. How do you optimize token usage while maintaining quality?**
**A:** I apply the "95/5 Rule"—investing 95% of the effort into refining the prompt to be highly concise and deterministic. I use the CRISP framework to cut out conversational filler. Instead of dumping raw, unformatted PRDs into the LLM, I preprocess the context to include only the relevant endpoints or features. Furthermore, I enforce strict **Output formats** (like Markdown tables or rigid JSON schemas) to prevent the LLM from generating unnecessary conversational explanations that consume valuable output tokens.

**Q6: How do you leverage Prompt Engineering to analyze production incidents or complex bugs?**
**A:** I use a Chain-of-Thought approach (Template 08). When an incident occurs, I instruct the AI to first list the reported symptoms, then extract verified facts from the logs/screenshots (Datadog/Sentry), and explicitly separate those facts from any hypotheses about the root cause. This ensures the AI doesn't confidently invent a false root cause (hallucination), and instead gives the engineering team a factual, structured aggregation of the failure to debug faster.

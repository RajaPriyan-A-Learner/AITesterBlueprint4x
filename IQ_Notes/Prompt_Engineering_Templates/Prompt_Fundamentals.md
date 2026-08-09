# SKILL: Prompt Engineering Fundamentals

**Author**: QA Assistant  
**Based On**: Prompt Frameworks (STAR, CLEAR, CRISP, RACE, COAST, RICE POT, CLASSIC)  
**Purpose**: Guide the creation of highly effective, structured prompts for QA automation and AI interactions  
**Status**: Active

---

## SKILL OVERVIEW

Automated workflow and reference guide for applying structured prompt engineering frameworks to generate precise, context-rich, and constraint-bound prompts. Ensures all tasks are well-defined, roles are clearly established, and outputs meet enterprise standards.

---

## ACTIVATION TRIGGERS

User provides any of these process-level prompts:
- "Create a prompt using the RICE POT framework"
- "Apply the CRISP framework for this QA task"
- "Structure my request using RACE"
- "Review my prompt against the completeness checklist"

---

## WORKFLOW PROCESS

### Step 1: Select the Appropriate Framework
Analyze the task and choose the best framework:
- **CRISP / CRAP**: Context, Role, Action, Parameters, Instructions
- **RACE**: Role, Action, Context, Expectation (Great for specific tasks like Bug Reports)
- **COAST**: Context, Objective, Action, Style, Tone
- **CLASSIC**: "You are X, behave like Y, produce Z"
- **RICE POT**: Role, Instructions, Context, Example, Parameters, Output, Tone (95% Plan, 5% Execution)

### Step 2: Define the Core Components
- **Role**: Assign a specific persona (e.g., "15 years QA Automation Architect")
- **Context**: Provide background information and environment details
- **Action/Task**: Define specific and quantified objectives
- **Parameters/Constraints**: Prevent hallucinations by setting strict boundaries

### Step 3: Format the Output & Tone
- Specify the exact output format (e.g., Markdown, Code only, Table)
- Define the tone (e.g., Technical, precise, enterprise-grade)

### Step 4: Validate Against Checklist
Review the generated prompt against the completeness checklist before execution.

---

## OUTPUT FORMAT (STRICT)

When generating a prompt for the user, use this structure (RICE POT Example):

```markdown
**Role**: [Defined Persona]
**Instructions**: 
- [Instruction 1]
- [Instruction 2]
**Context**: [Background details]
**Example**: [Code or formatting example]
**Parameters**: [Constraints and boundaries]
**Output**: [Exact format required]
**Tone**: [Desired tone]
```

---

## MANDATORY RULES (MUST FOLLOW)

1. **DO NOT assume** context; ask for missing background if necessary.
2. **ALWAYS assign a Role** to set the behavior boundary.
3. **STRICTLY adhere** to negative constraints (the "Don'ts").
4. **PROVIDE Examples** to align expectations and output format.
5. **VERIFY** the prompt against the Completeness Checklist.

---

## COMMON PITFALLS TO AVOID

| Pitfall | ❌ WRONG | ✅ RIGHT |
|---------|---------|---------|
| **Missing Role** | "Write a test script" | "Act as a Senior QA Automation Engineer..." |
| **Vague Context** | "Test the login page" | "Test the Salesforce login page at staging URL with MFA enabled" |
| **No Constraints** | "Use any locator" | "[Mandatory] Use ONLY XPath locators" |
| **Unspecified Output** | "Give me the code" | "Provide ONLY runnable code, no explanations" |

---

## QUALITY GATES (COMPLETENESS CHECKLIST)

Is the prompt complete? It MUST pass these checks:
- [ ] Role defined
- [ ] Context provided
- [ ] Task is specific and quantified
- [ ] Constraints prevent hallucinations, conditions set
- [ ] Output format specified
- [ ] Terminology defined if needed

---

## USAGE EXAMPLES

### Example 1: RACE Framework for Bug Report
**Role**: Senior QA Tester
**Action**: Create a detailed Bug Report
**Context**: Invalid login throws a 500 Server Error on app.vwo.com instead of a validation message.
**Expectation**: A Jira-ready bug report with steps to reproduce, expected vs actual results, and severity.

### Example 2: CLASSIC Role Model
"You are a Playwright Automation Expert. Behave like a strict code reviewer. Produce a code review summary highlighting anti-patterns in the provided script."

---

## REFERENCES
- [ChatGPT Example - RACE Bug Report](https://chatgpt.com/share/69b4e6b0-c704-8001-adce-cad61b921623)
- [ChatGPT Example - Prompt Checklist](https://chatgpt.com/share/697efcef-7c50-8009-b5e6-db0a4fab6f82)
- Original source: `IQ_Notes/Prompt_Frameworks.md`

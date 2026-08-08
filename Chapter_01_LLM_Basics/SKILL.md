# SKILL: Anti-Hallucination Test Case Generation Workflow

**Author**: QA Assistant  
**Based On**: Anti-Hallucination Rules (ch_01_anti_hallucination.md)  
**Purpose**: Generate verifiable, traceable test cases from PRD with zero hallucinations  
**Status**: Active

---

## SKILL OVERVIEW

Automated workflow for generating comprehensive test cases from Product Requirements Documents (PRD) while maintaining strict adherence to anti-hallucination rules. Ensures all assertions are traceable, no features/behaviors are invented, and missing information is explicitly flagged for stakeholder input.

---

## ACTIVATION TRIGGERS

User provides any of these process-level prompts:
- "Write test cases based on [document] and hallucination rules"
- "Generate test cases from PRD"
- "Create test cases with anti-hallucination verification"
- "Build test suite with missing information"
- "Differentiate new vs old test cases"

---

## WORKFLOW PROCESS

### Step 1: Extract Verifiable Facts from Input

**Input**: PRD document (or provided document)

**Action**:
1. Read entire document systematically
2. Extract only explicit requirements
3. List verified facts with source reference
4. Ignore inferences, assumptions, "typical" behaviors
5. Flag ambiguous/vague statements as unknown

**Output**: Bulleted list of verified facts

**Example**:
```
✓ Email/password authentication required
✓ Session timeout configurable (default not specified)
✓ Optional 2FA support
✓ Real-time validation on blur
```

---

### Step 2: Identify Missing / Unknown Information

**Action**:
1. Read verified facts from Step 1
2. Identify information needed for complete test coverage
3. List gaps explicitly
4. Categorize by impact (critical, important, nice-to-have)
5. Do NOT assume defaults or "typical" values

**Output**: Structured list of unknowns

**Example**:
```
- Password complexity rules (length, character types)
- Rate limiting thresholds (X attempts per Y minutes)
- Session timeout default value
- Specific error message text
- 2FA method options (SMS, email, app, etc.)
```

---

### Step 3: Await Stakeholder Input for Missing Information

**Action**:
1. Present missing information list to user/stakeholder
2. Request specific values/details
3. Do NOT proceed with assumptions
4. Wait for explicit clarification
5. Document provided information with exact values

**Output**: Verified missing information now known

**Example Input Expected**:
```
Password complexity: min 8 chars, 1 uppercase, 2 lowercase, 3 numbers
Rate limiting: 3 attempts per 10 minutes
Session timeout: 5 minutes
Error messages: [exact text provided]
```

---

### Step 4: Generate Test Cases from Verified Facts Only

**Action**:
1. Review all verified facts + newly provided information
2. Create test cases covering:
   - Happy path (valid inputs)
   - Sad paths (invalid inputs)
   - Edge cases (boundary conditions)
   - Error scenarios (specific error messages)
   - Security requirements
   - Accessibility requirements
   - Performance requirements
3. For each test case:
   - Reference source requirement (PRD page/section)
   - Match error messages exactly to provided text
   - Use specific values (not "configurable")
   - Include both positive and negative scenarios
4. Format in structured table (ID, Test Case, Precondition, Steps, Expected Result, Type)

**Output**: Comprehensive test case matrix

---

### Step 5: Label All Inferences Explicitly

**Action**:
1. After test case generation, review all assertions
2. For any derived assumption (not from PRD or stakeholder input):
   - Mark as "Inference (low confidence)"
   - Explain reasoning
   - Request verification before use
3. Never present inferred facts as verified

**Output**: Test cases with confidence labels

**Example**:
```
Inference (low confidence): Email max length assumed 254 per RFC 5321 [NOT in PRD]
Inference (low confidence): Password max 500 chars [NOT in PRD]
```

---

### Step 6: Perform Self-Check for Hallucinations

**Mandatory Verification**:
- [ ] Every test case traces to PRD requirement or stakeholder input
- [ ] No invented features, APIs, error codes, UI elements
- [ ] No assumed default system behavior
- [ ] No "typical" or "standard" behaviors assumed
- [ ] All error messages match provided text exactly
- [ ] All numeric values (timeouts, thresholds) use provided values
- [ ] No test case creates new requirements not in PRD
- [ ] All inferences labeled and flagged for review

**Output**: Self-validation pass/fail report

---

### Step 7: Organize & Differentiate Test Cases (Optional)

**Trigger**: User requests "review" or "differentiate" test cases

**Action**:
1. Separate new test cases from existing ones
2. Create change summary showing:
   - What was added
   - Why it was added (which requirement/input)
   - Mapping to specific PRD sections/provided information
3. Group by feature/category
4. Include checklist for verification
5. Highlight modified vs new

**Output**: Differentiated summary document (NEW_ADDITIONS_SUMMARY.md style)

---

## OUTPUT FORMAT (STRICT)

All test case outputs MUST include:

### Header Section
- Document title with "based on anti-hallucination rules"
- PRD reference
- Verification method notation
- Date generated

### Verified Facts Section
```
✓ [Fact from PRD] - source reference
✓ [Fact from PRD] - source reference
```

### Missing Information Section (if applicable)
```
- [Unknown detail] - impact level
- [Unclear requirement] - impact level
```

### Test Cases Section
Format: Markdown table with columns:
- ID (TC###.#)
- Test Case (name)
- Precondition (if any)
- Steps (numbered, clear sequence)
- Expected Result (exact, traceable)
- Type (Functional, Security, UX, etc.)

### Inference Labels Section
```
Inference (low confidence): [claim] - [reasoning] [FLAG FOR VERIFICATION]
```

### Self-Validation Check Section
```
✓ All assertions traceable to PRD
✓ No invented features/behaviors
✓ No assumed defaults
✓ Zero hallucinations detected
```

### Test Case Summary Section
```
- Total Test Cases: [number]
- By Type: Functional: X | Security: Y | UX: Z | ...
- Coverage: [%] of PRD requirements
```

---

## MANDATORY RULES (MUST FOLLOW)

1. **DO NOT invent** features, APIs, error codes, UI elements, behaviors
2. **DO NOT assume** default or "typical" system behavior
3. **IF missing**, respond with "Insufficient information to determine"
4. **EVERY assertion** must be traceable to provided input
5. **IF inferred**, label explicitly as "Inference (low confidence)"
6. **OUTPUT must be** deterministic and repeatable
7. **WAIT for input** - never assume stakeholder will accept defaults
8. **MATCH text exactly** - error messages, values, requirements word-for-word
9. **DOCUMENT source** - cite PRD page/section for every requirement
10. **FLAG uncertainties** - mark for verification before test execution

---

## PROCESS-LEVEL PROMPTS CAPTURED

### Prompt 1: Initial Generation
```
"Based on the hallucination rules and PRD, write down test cases"
```
**Workflow**: Steps 1-6 (Extract → Check → Generate → Verify)

### Prompt 2: Fill Missing Information Gap
```
"Here is missing information. Afterwards write down test cases"
[Provide: password rules, rate limits, timeouts, error messages, 2FA methods, etc.]
```
**Workflow**: Step 3 → Step 4 (Accept new info → Regenerate with specifics)

### Prompt 3: Differentiate & Review
```
"Differentiate new test cases from old ones for easy review"
```
**Workflow**: Step 7 (Organize → Separate → Summarize)

---

## EXECUTION FLOW DIAGRAM

```
┌─────────────────────────────────────────────┐
│ USER PROVIDES PRD + HALLUCINATION RULES     │
└────────────────┬────────────────────────────┘
                 │
                 ▼
         ┌───────────────────┐
         │ STEP 1: EXTRACT   │
         │ VERIFIED FACTS    │
         └────────┬──────────┘
                  │
                  ▼
         ┌───────────────────┐
         │ STEP 2: IDENTIFY  │
         │ MISSING INFO      │
         └────────┬──────────┘
                  │
                  ▼
    ┌────────────────────────────┐
    │ PRESENT GAPS TO STAKEHOLDER│
    │ WAIT FOR INPUT             │
    └────────────┬───────────────┘
                 │
                 ▼
    ┌────────────────────────────┐
    │ USER PROVIDES MISSING DATA │
    │ (password rules, timeouts, │
    │  error messages, etc.)     │
    └────────────┬───────────────┘
                 │
                 ▼
         ┌───────────────────┐
         │ STEP 4: GENERATE  │
         │ TEST CASES        │
         └────────┬──────────┘
                  │
                  ▼
         ┌───────────────────┐
         │ STEP 5: LABEL     │
         │ INFERENCES        │
         └────────┬──────────┘
                  │
                  ▼
         ┌───────────────────┐
         │ STEP 6: SELF-CHECK│
         │ HALLUCINATIONS    │
         └────────┬──────────┘
                  │
         ┌────────▼────────┐
         │                 │
         ▼                 ▼
    PASS?              FAIL?
      │                  │
      │         ┌────────┴────────┐
      │         │ FLAG ISSUES &   │
      │         │ REQUEST FIXES   │
      │         └────────┬────────┘
      │                  │
      ▼                  ▼
   ┌────────────────────────────────┐
   │ GENERATE OUTPUT DOCUMENT       │
   │ (TC_01_*.md format)            │
   └────────────┬───────────────────┘
                │
        (USER REQUESTS REVIEW)
                │
                ▼
       ┌────────────────────┐
       │ STEP 7: DIFFERENTIATE
       │ NEW vs OLD         │
       └────────┬───────────┘
                │
                ▼
      ┌─────────────────────┐
      │ GENERATE SUMMARY    │
      │ (TC_NEW_*.md)       │
      └─────────────────────┘
```

---

## COMMON PITFALLS TO AVOID

| Pitfall | ❌ WRONG | ✅ RIGHT |
|---------|---------|---------|
| **Assume defaults** | "Session timeout is usually 30 min" | "Timeout is: [UNKNOWN - ASK]" |
| **Invent specifics** | "Password requires uppercase (typical)" | Wait for stakeholder input |
| **Generic error messages** | "Show error message on failure" | "Show exact: 'Email is required'" |
| **Vague requirements** | "Validate password strength" | "8+ chars, 1 upper, 2 lower, 3 numbers" |
| **Skip source tracing** | "Add test for login" | "Test login per PRD Section 3.2" |
| **Hide inferences** | State derived facts as certain | Label all inferences explicitly |
| **Accept ambiguity** | "2FA is supported" | "2FA methods: SMS, Email, App, Questions" |

---

## QUALITY GATES

Test cases generated by this workflow PASS when:

✅ **Traceability**: 100% of assertions link to PRD or stakeholder input  
✅ **No Hallucination**: Zero invented features/behaviors  
✅ **Specificity**: All values concrete (not "configurable" or "typical")  
✅ **Completeness**: All missing information flagged or provided  
✅ **Accuracy**: Error messages, timeouts, thresholds match exactly  
✅ **Clarity**: Each test case is executable without interpretation  
✅ **Verification**: All inferences labeled and flagged  

---

## USAGE EXAMPLES

### Example 1: Initial Test Case Request
```
User: "Create test cases from this VWO Login PRD using anti-hallucination rules"

Workflow:
1. Extract verified facts from PRD ✓
2. Identify missing info (password rules, rate limits, timeouts, etc.) ✓
3. Present gaps to user ✓
4. Wait for user input...
```

### Example 2: With Missing Information Provided
```
User: "Here's missing info: password = 8 chars min, 1 upper, 2 lower, 3 numbers,
       rate limit = 3 attempts/10 min, timeout = 5 min, error messages = [exact text]"

Workflow:
1. Accept and verify provided information ✓
2. Generate test cases with specific values ✓
3. Label any remaining inferences ✓
4. Self-check for hallucinations ✓
5. Output complete test case document ✓
```

### Example 3: Review & Differentiate
```
User: "Differentiate new test cases from old ones"

Workflow:
1. Separate new tests (43 added) from original (140+ preserved) ✓
2. Group by category/feature ✓
3. Show what was added and why ✓
4. Create review checklist ✓
5. Output differentiated summary document ✓
```

---

## REFERENCES

- **Anti-Hallucination Rules**: [ch_01_anti_hallucination.md](ch_01_anti_hallucination.md)
- **Test Case Output**: [TC_01_VWO_Login_Dashboard.md](TC_01_VWO_Login_Dashboard.md)
- **New Additions Summary**: [TC_NEW_ADDITIONS_SUMMARY.md](TC_NEW_ADDITIONS_SUMMARY.md)

---

## SKILL MAINTENANCE

**Last Updated**: 2026-08-08  
**Next Review**: When new PRD-to-test-case conversion workflow needed  
**Feedback Loop**: Capture edge cases from test execution for workflow improvement


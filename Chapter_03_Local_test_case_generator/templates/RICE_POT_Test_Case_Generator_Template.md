# RICE POT Prompt Template — Test Case Generation (Reusable)

**Framework:** Role, Instructions, Context, Example, Parameters, Output, Tone
**Philosophy:** 95% Plan / 5% Execution — the model should fully understand scope, boundaries, and format before generating a single test case.

Fill in the bracketed sections per feature. Everything else is reusable as-is.

---

## ROLE

You are a **Senior QA Engineer / SDET** with 8+ years of experience in **[domain — e.g., Financial Services / EdTech / CRM]**, specializing in **functional, negative, boundary, security, and non-functional test design**. You design test cases that are defensible in a test review — traceable to a specific requirement, unambiguous to execute, and free of assumptions not backed by the spec.

---

## INSTRUCTIONS

1. Generate test cases **only** from the requirements listed in the CONTEXT section. Do not infer UI behavior, error codes, session handling, or business rules that aren't stated.
2. If a requirement implies a scenario but doesn't specify the exact behavior (e.g., "account locks after 3 failed attempts" — lockout duration not stated), create the test case and mark the unspecified detail as `Not specified` in the relevant field — do not guess a value.
3. Cover the following test **types** across the case set, not just happy path:
   - Positive (valid input, expected flow)
   - Negative (invalid input, wrong credentials, malformed data)
   - Boundary (min/max length, edge values — e.g., exactly 8 characters, 7 characters)
   - Security (injection attempts, brute-force/lockout behavior, session/token handling if in scope)
   - State/Idempotency (repeating an action, retry after failure, account state transitions)
   - Non-functional (performance, accessibility, localization) — **only if requirements or PARAMETERS mention them; otherwise state "Out of scope — not specified"**
4. Each test case must trace to a **requirement number** from CONTEXT. If a case can't be traced to a stated requirement, do not include it — flag it separately under "Suggested Additional Coverage (needs requirement confirmation)" instead of numbering it as a formal test case.
5. Do not merge multiple assertions into one step's "Expected Result" — one verifiable outcome per test case.
6. Use consistent, execution-ready step phrasing: imperative verbs ("Enter", "Click", "Submit"), not narrative ("The user then...").

---

## CONTEXT

**Feature:** [e.g., Salesforce User Login]
**Application/Module:** [e.g., Salesforce Lightning — Login Page]
**Environment:** [e.g., UAT / Staging — specify URL or "Not specified"]
**User roles in scope:** [e.g., Standard User, Admin — or "Not specified"]
**Out of scope:** [explicitly state what NOT to test — e.g., SSO/MFA flows, password reset, if not covered by requirements]

**Requirements (numbered, verbatim from spec):**
1. [Requirement 1]
2. [Requirement 2]
3. [Requirement 3]
4. [Requirement 4]
5. [Add as needed]

---

## EXAMPLE

*(One worked example — anchors format and depth expectations. Replace with a domain-relevant example if needed.)*

| Test ID | Description | Pre-conditions | Test Data | Steps | Expected Result | Priority | Req Ref |
|---|---|---|---|---|---|---|---|
| TC-LOGIN-001 | Verify account locks after 3 consecutive failed login attempts | User has a valid, unlocked account with known credentials | Valid email: `user@test.com`; Invalid password: `WrongPass1` (x3) | 1. Navigate to login page<br>2. Enter valid email and incorrect password<br>3. Click "Log In"<br>4. Repeat steps 2–3 two more times with the same incorrect password | After the 3rd failed attempt, the account is locked and the system prevents further login attempts. **Lockout duration/unlock mechanism: Not specified.** | High | Req 4 |

---

## PARAMETERS

- **Number of test cases to generate:** Cover ALL requirements exhaustively — do NOT stop at 5 or any other fixed number. Generate as many test cases as needed to fully cover Positive, Negative, Boundary, Security, and State/Idempotency scenarios.
- **Test case ID prefix:** TC-{TICKET_KEY}-
- **Priority scale:** High / Medium / Low
- **Include test data column:** Yes
- **Include traceability (Req Ref) column:** Yes
- **Include negative/security cases even if not explicit in requirements but implied by domain norms:** Yes — flag separately under Coverage Notes
- **Output as:** Markdown table

---

## OUTPUT

⚠️ **CRITICAL OUTPUT RULES — follow exactly:**
1. Output ONLY the test cases and coverage notes. Do NOT write any introduction, preamble, summary paragraph, or closing remarks.
2. Do NOT say things like "Here are the test cases" or "I hope this helps" — go straight into the table.
3. Do NOT limit the number of test cases to 5 or any fixed count. Generate ALL test cases required to exhaustively cover every requirement.
4. Start your response immediately with `## Part 1 — Test Case Table`.

Return the result in **two parts**:

**Part 1 — Test Case Table**
Columns (in order): `Test ID | Description | Pre-conditions | Test Data | Steps | Expected Result | Priority | Req Ref`

**Part 2 — Coverage Notes**
- Requirements with no explicit edge-case coverage (state which and why)
- Any field marked `Not specified` and what clarification is needed from the BA/PO
- Suggested additional coverage that would require a new requirement to formalize (not counted in the numbered test case set)

---

## TONE

Precise, execution-ready, review-defensible. No filler commentary, no assumed behavior stated as fact. Where the spec is silent, say so explicitly rather than smoothing over the gap — a reviewer should be able to point to a requirement number for every test case and to `Not specified` for every gap.

---

### Filled Example — Applied to Your Salesforce Login Requirements

*(Same requirements as your original prompt, run through this template)*

**Requirements used:**
1. User can log in with a valid email and password.
2. User sees an error message "Invalid credentials" if the password is wrong.
3. Passwords must be at least 8 characters.
4. User account locks after 3 failed attempts.

**Part 1 — Test Case Table**

| Test ID | Description | Pre-conditions | Test Data | Steps | Expected Result | Priority | Req Ref |
|---|---|---|---|---|---|---|---|
| TC-LOGIN-001 | Verify successful login with valid email and password | User has a registered, active, unlocked account | Valid email + valid password | 1. Navigate to login page<br>2. Enter valid email<br>3. Enter valid password<br>4. Click "Log In" | User is logged in successfully. Post-login destination: **Not specified** | High | Req 1 |
| TC-LOGIN-002 | Verify error message on incorrect password | User has a registered, active account | Valid email + incorrect password | 1. Navigate to login page<br>2. Enter valid email<br>3. Enter incorrect password<br>4. Click "Log In" | System displays error message "Invalid credentials" | High | Req 2 |
| TC-LOGIN-003 | Verify password below minimum length is rejected | User is on login/registration flow where password rule applies | Password: 7 characters (e.g., `Pass12A`) | 1. Enter email<br>2. Enter a 7-character password<br>3. Submit | System rejects the password. **Exact validation message: Not specified** | Medium | Req 3 |
| TC-LOGIN-004 | Verify password at exact minimum boundary (8 characters) is accepted | User has valid email registered | Password: exactly 8 characters, meeting policy | 1. Enter email<br>2. Enter an 8-character valid password<br>3. Submit | Password is accepted as valid (assuming it also matches account credentials for login, or is accepted during creation — **flow context: Not specified**) | Medium | Req 3 |
| TC-LOGIN-005 | Verify account locks after 3 consecutive failed login attempts | User has a valid, unlocked account | Valid email + incorrect password (x3) | 1. Enter valid email + incorrect password, submit<br>2. Repeat 2 more times with incorrect password | After the 3rd failed attempt, account is locked. **Lockout duration, unlock method (time-based/admin/email), and whether a specific message is shown: Not specified** | High | Req 4 |

**Part 2 — Coverage Notes**

- **Req 1 (valid login):** No stated behavior for empty email/password fields, malformed email format, or case-sensitivity of email — flagged as gaps, not testable without confirmation.
- **Req 2 (invalid credentials):** No distinction specified between "wrong password" and "email not found" — real systems often deliberately show the same generic message for both (security best practice); requirement doesn't confirm this, so not assumed.
- **Req 3 (password length):** No upper bound specified; no character-composition rules (uppercase/number/special char) stated — cannot generate composition-based test cases without a requirement.
- **Req 4 (lockout):** No lockout duration, no unlock mechanism, no messaging specified — all marked `Not specified`. This is the highest-risk gap; recommend clarifying before sign-off since it affects both TC-LOGIN-005 and any retry-after-lockout test.
- **Suggested additional coverage (not counted as formal test cases — needs requirement confirmation):**
  - SQL injection / script injection in email or password fields (security norm, not stated in spec)
  - Session behavior after successful login (timeout, concurrent sessions)
  - Accessibility of error messaging (WCAG) — relevant if this is a production-facing form

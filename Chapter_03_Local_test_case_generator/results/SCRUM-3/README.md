# SCRUM-3 — Test Case Generation Results

| Field | Value |
|-------|-------|
| **Jira Issue** | SCRUM-3 — VWO Login Dashboard Implementation |
| **Generated On** | 2026-08-15 |
| **LLM Used** | Ollama · `llama3.2:latest` (local) |
| **Total Test Cases** | 35 |

## Files in this Folder

| File | Description |
|------|-------------|
| `SCRUM-3_test_cases.md` | All 35 generated test cases in Markdown format |
| `recording_scrum3_ollama_generation.webp` | Browser recording — test case generation run |
| `recording_scrum3_settings_check.webp` | Browser recording — settings verification run |

## Test Case Summary

| # | Scenario | Category |
|---|----------|----------|
| TC-01 | Successful login with valid credentials | Happy path |
| TC-02 | Invalid email domain rejected | Negative |
| TC-03 | Empty password rejected | Negative |
| TC-04 | Weak password (< 8 chars) rejected | Boundary |
| TC-05 | Password exceeding max length rejected | Boundary |
| TC-06 | Account locked after 3 failed attempts | Security |
| TC-07 | Email format validation | Validation |
| TC-08–TC-11 | Multiple failed attempt scenarios | Security |
| TC-12–TC-15 | Role-based login scenarios | Authorization |
| TC-16–TC-20 | Account lockout error messaging | Security |
| TC-21–TC-24 | Account recovery flows | Recovery |
| TC-25–TC-26 | Role-based access control | Authorization |
| TC-27–TC-28 | Login failure / account creation | Negative / New user |
| TC-29 | Session expiration | Security |
| TC-30 | Excessive failed attempts lockout | Security |
| TC-31 | Two-factor authentication | Security |
| TC-32–TC-33 | Disabled account + recovery | Edge case |
| TC-34 | Password reset flow | Recovery |
| TC-35 | Password strength enforcement | Validation |

## Notes

- Groq API was rate-limited during the session → switched to local **Ollama** (`llama3.2:latest`).
- The LLM flagged several **requirement gaps** in SCRUM-3: lockout duration, empty-field behaviour, and password composition rules were not specified in the Jira ticket.

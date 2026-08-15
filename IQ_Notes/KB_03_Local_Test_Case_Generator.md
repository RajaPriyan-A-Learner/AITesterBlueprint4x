# Knowledge Base: Local Test Case Generator — AI-Powered Jira-to-Testcase Pipeline

**Last Updated**: 2026-08-15
**Audience**: QA Engineers, SDETs, AI Learners
**Level**: Intermediate
**Source Chapter**: Chapter_03_Local_test_case_generator

---

## TABLE OF CONTENTS

1. [Context: Chapter Focus & Industry Shift](#context)
2. [Core Concepts & Definitions](#concepts)
3. [Technical Deep-Dives: Architecture & Data Flow](#technical)
4. [Architecture & Patterns](#architecture)
5. [Application: RICE POT Prompt Template in Practice](#application)
6. [LLM Backend: Ollama vs Groq](#llm)
7. [Common Pitfalls & How to Avoid](#pitfalls)
8. [Interview Q&A](#qa)
9. [Quick Reference](#quickref)
10. [Reference & Resources](#reference)

---

## Context: Chapter Focus & Industry Shift
<a id="context"></a>

Chapter 03 moves from **prompt engineering theory** (Chapter 02) to **applied AI tooling** — building a fully functional, production-style internal QA productivity tool that converts a Jira ticket ID into structured test cases, entirely locally, with no external dependency required.

### Why This Matters?
Manual test case writing from Jira tickets is one of the highest-friction, lowest-value tasks in a QA engineer's workflow. It is repetitive, error-prone (missed edge cases, assumption-based happy paths), and slow. Chapter 03 demonstrates how to eliminate this with a **local-first AI pipeline**: the tester types a Jira ticket key, and the app fetches the ticket, merges it into the RICE POT template, and streams back a fully structured, reviewable test case table in seconds.

The "local-first" design is deliberate: no cloud dependency, no API cost per request, no data privacy concern — Ollama runs the LLM on the tester's own machine with automatic fallback to Groq when needed.

Source: [Local_Test_case_generator_prompt.md](file:///c:/Users/rajap/OneDrive/%E0%B9%80%E0%B8%AD%E0%B8%81%E0%B8%AA%E0%B8%B2%E0%B8%A3/LEARNINGAITESTER4X/Chapter_03_Local_test_case_generator/Local_Test_case_generator_prompt.md), line 27

### Real-World Application
The app fetches a real Jira ticket (e.g., SCRUM-3 — VWO Login Dashboard Implementation), extracts its summary, description, and acceptance criteria, and generates a markdown test case table with columns: Test ID, Description, Pre-conditions, Test Data, Steps, Expected Result, Priority, Req Ref. The output is immediately reviewable, traceable to the ticket, and auto-saved to `results/{TICKET_KEY}/`.

---

## Core Concepts & Definitions
<a id="concepts"></a>

### Two-Screen Streamlit Architecture
The app is a **multipage Streamlit application** with two screens:
- **Screen 1 — Chat (`app.py`)**: ChatGPT-style interface. User types `create test cases for SCRUM-3`. App parses the ticket key, fetches Jira data, merges with RICE POT template, streams LLM response.
- **Screen 2 — Settings (`pages/settings.py`)**: Configuration panel for Jira credentials (URL, email, API token), LLM provider selection (Ollama/Groq), and Groq API key. Values are persisted to `config.json`.

Source: [implementation_plan.md](file:///c:/Users/rajap/OneDrive/%E0%B9%80%E0%B8%AD%E0%B8%81%E0%B8%AA%E0%B8%B2%E0%B8%A3/LEARNINGAITESTER4X/Chapter_03_Local_test_case_generator/implementation_plan.md), lines 25–40

### Config Priority Chain
Settings are resolved in this order (highest to lowest priority):
1. **`config.json`** — values explicitly saved by the user via the Settings UI
2. **`.env` file** — pre-populated credentials for local dev (git-ignored)
3. **`DEFAULTS`** — safe empty/fallback values hardcoded in `config_store.py`

This means `.env` acts as a "pre-fill" layer: fields in Settings are auto-populated from `.env` on first launch, so the user never has to re-type credentials after initial setup.

Source: [config_store.py](file:///c:/Users/rajap/OneDrive/%E0%B9%80%E0%B8%AD%E0%B8%81%E0%B8%AA%E0%B8%B2%E0%B8%A3/LEARNINGAITESTER4X/Chapter_03_Local_test_case_generator/config_store.py), lines 1–20

### RICE POT Template — Applied
The template in `/templates/RICE_POT_Test_Case_Generator_Template.md` is a **reusable, filled prompt structure** for test case generation. Key PARAMETERS are:
- **No fixed count limit** — generates ALL scenarios exhaustively (Positive, Negative, Boundary, Security, State/Idempotency)
- **Output rules** — no preamble, start immediately with `## Part 1 — Test Case Table`
- **Not-specified marking** — fields without a backing requirement are marked `Not specified`, never guessed

Source: [RICE_POT_Test_Case_Generator_Template.md](file:///c:/Users/rajap/OneDrive/%E0%B9%80%E0%B8%AD%E0%B8%81%E0%B8%AA%E0%B8%B2%E0%B8%A3/LEARNINGAITESTER4X/Chapter_03_Local_test_case_generator/templates/RICE_POT_Test_Case_Generator_Template.md), lines 60–90

### Auto-Save to Results Folder
After every successful LLM generation, `app.py` automatically saves the output to:
```
results/{TICKET_KEY}/{TICKET_KEY}_test_cases_{YYYYMMDD_HHMMSS}.md
```
A `st.toast()` notification confirms the save. No manual export step needed.

Source: [app.py](file:///c:/Users/rajap/OneDrive/%E0%B9%80%E0%B8%AD%E0%B8%81%E0%B8%AA%E0%B8%B2%E0%B8%A3/LEARNINGAITESTER4X/Chapter_03_Local_test_case_generator/app.py), lines 311–327

---

## Technical Deep-Dives: Architecture & Data Flow
<a id="technical"></a>

### End-to-End Data Flow

```
User types: "create test cases for SCRUM-3"
        │
        ▼
[app.py] regex parse → ticket_key = "SCRUM-3"
        │
        ▼
[jira_client.py] REST GET /rest/api/2/issue/SCRUM-3
  → Basic Auth (email + API token from config)
  → Returns: summary, description, acceptance_criteria
        │
        ▼
[app.py] load RICE_POT template from /templates/
        │
        ▼
[app.py] build_prompt() → merges ticket data + template
  → Strict output rules injected at top (no preamble, no count limit)
        │
        ▼
[llm_client.py] generate(prompt, config)
  → if provider == "Ollama": stream from localhost:11434/api/generate
  → if provider == "Groq":   stream from Groq SDK
  → if Ollama fails + Groq key set: auto-fallback to Groq
        │
        ▼
[app.py] stream to chat pane token-by-token (output_placeholder.markdown)
        │
        ▼
[app.py] auto-save to results/{TICKET_KEY}/ with timestamp
```

Source: [walkthrough.md](file:///c:/Users/rajap/OneDrive/%E0%B9%80%E0%B8%AD%E0%B8%81%E0%B8%AA%E0%B8%B2%E0%B8%A3/LEARNINGAITESTER4X/Chapter_03_Local_test_case_generator/walkthrough.md), lines 60–67

### Jira REST API Integration (`jira_client.py`)
- Endpoint: `GET /rest/api/2/issue/{ticket_key}`
- Auth: HTTP Basic Auth — base64(email:api_token)
- Acceptance Criteria extraction: reads from `customfield_10016` (standard Jira field) or falls back to description text search
- Connection test: `test_connection(config)` → returns `(bool, str)` tuple

### LLM Streaming (`llm_client.py`)
**Ollama streaming:**
```python
POST localhost:11434/api/generate
payload = {"model": "llama3.2:latest", "prompt": prompt, "stream": True}
# Each response line is JSON: {"response": "<token>", "done": false}
```

**Groq streaming:**
```python
client.chat.completions.create(
    model="llama-3.1-8b-instant",
    messages=[{"role": "user", "content": prompt}],
    stream=True, max_tokens=4096
)
```

Source: [llm_client.py](file:///c:/Users/rajap/OneDrive/%E0%B9%80%E0%B8%AD%E0%B8%81%E0%B8%AA%E0%B8%B2%E0%B8%A3/LEARNINGAITESTER4X/Chapter_03_Local_test_case_generator/llm_client.py), lines 106–172

### .env → config_store → Settings UI Pipeline
```python
# .env
JIRA_URL=https://alearner.atlassian.net/
JIRA_EMAIL=user@company.com
JIRA_API_TOKEN=...
GROQ_API_KEY=gsk_...
OLLAMA_MODEL=llama3.2:latest
LLM_PROVIDER=Ollama

# config_store.py loads .env via python-dotenv on startup
load_dotenv(".env", override=False)

# Settings UI reads cfg = config_store.load()
# → fields pre-filled from .env if config.json is empty
```

Source: [config_store.py](file:///c:/Users/rajap/OneDrive/%E0%B9%80%E0%B8%AD%E0%B8%81%E0%B8%AA%E0%B8%B2%E0%B8%A3/LEARNINGAITESTER4X/Chapter_03_Local_test_case_generator/config_store.py), lines 15–75

---

## Architecture & Patterns
<a id="architecture"></a>

### Module Separation Pattern
Each module has a single responsibility — this is critical for maintainability and independent testability:

| Module | Responsibility | Key Function |
|--------|---------------|-------------|
| `app.py` | UI orchestration only | `build_prompt()`, chat loop |
| `jira_client.py` | Jira API only | `fetch_ticket(key, config)` |
| `llm_client.py` | LLM calls only | `generate(prompt, config)` |
| `config_store.py` | Config persistence only | `load()`, `save(data)` |
| `pages/settings.py` | Settings UI only | `st.text_input()`, `st.radio()` |

Source: [implementation_plan.md](file:///c:/Users/rajap/OneDrive/%E0%B9%80%E0%B8%AD%E0%B8%81%E0%B8%AA%E0%B8%B2%E0%B8%A3/LEARNINGAITESTER4X/Chapter_03_Local_test_case_generator/implementation_plan.md), lines 62–84

### Fallback Logic Pattern
```
Primary: Ollama (local, free, private)
    ↓ fails (ConnectionError/Timeout)
Fallback: Groq API (cloud, rate-limited)
    ↓ no key configured
Error: clear message → user goes to Settings
```

The fallback is **transparent to the user** — a warning banner appears briefly before Groq takes over. This is the "graceful degradation" pattern applied to AI backends.

Source: [llm_client.py](file:///c:/Users/rajap/OneDrive/%E0%B9%80%E0%B8%AD%E0%B8%81%E0%B8%AA%E0%B8%B2%E0%B8%A3/LEARNINGAITESTER4X/Chapter_03_Local_test_case_generator/llm_client.py), lines 36–51

### Credential Security Pattern
- **Never hardcoded** — zero credentials in source code
- **git-ignored** — both `.env` and `config.json` are in `.gitignore`
- **Priority layering** — `.env` (dev convenience) < `config.json` (saved UI values)
- **Password masking** — `type="password"` on all token input fields in Streamlit

---

## Application: RICE POT Prompt Template in Practice
<a id="application"></a>

### How `build_prompt()` Works
The function in `app.py` merges live Jira ticket data into the RICE POT template:

```python
def build_prompt(ticket: dict, template: str) -> str:
    # 1. Inject STRICT OUTPUT RULES at the top (critical for LLM compliance)
    # 2. Embed ticket fields: key, type, status, summary, description, acceptance_criteria  
    # 3. Append the full RICE POT template for format reference
    # 4. End with explicit trigger: "Begin now (start directly with ## Part 1...)"
```

**Key insight**: The output rules are injected at the **very top** of the prompt (before ticket data), because LLMs tend to front-weight their attention. Placing constraints last means they may be ignored.

Source: [app.py](file:///c:/Users/rajap/OneDrive/%E0%B9%80%E0%B8%AD%E0%B8%81%E0%B8%AA%E0%B8%B2%E0%B8%A3/LEARNINGAITESTER4X/Chapter_03_Local_test_case_generator/app.py), lines 137–175

### Prompt Anti-Pattern Fixed in This Chapter
**Before** (what was wrong):
```
## Instructions
Generate test cases ONLY from the ticket details above.
Begin generating test cases now:
```
This produced: intro paragraphs, "Here are the test cases...", and only 5 results.

**After** (what works):
```
⚠️ STRICT OUTPUT RULES:
1. NO introduction, NO preamble
2. Do NOT limit to 5 — generate ALL scenarios
3. Start IMMEDIATELY with: ## Part 1 — Test Case Table
```
Result: Direct table output, exhaustive coverage.

Source: [app.py](file:///c:/Users/rajap/OneDrive/%E0%B9%80%E0%B8%AD%E0%B8%81%E0%B8%AA%E0%B8%B2%E0%B8%A3/LEARNINGAITESTER4X/Chapter_03_Local_test_case_generator/app.py), lines 143–175; [RICE_POT template](file:///c:/Users/rajap/OneDrive/%E0%B9%80%E0%B8%AD%E0%B8%81%E0%B8%AA%E0%B8%B2%E0%B8%A3/LEARNINGAITESTER4X/Chapter_03_Local_test_case_generator/templates/RICE_POT_Test_Case_Generator_Template.md), lines 60–90

### SCRUM-3 Live Run Results
Real ticket tested: **SCRUM-3 — VWO Login Dashboard Implementation**
- **LLM used**: `llama3.2:latest` via Ollama (local)
- **Output**: 35 test cases covering positive, negative, boundary, security, role-based, session, 2FA, and recovery scenarios
- **Requirement gaps flagged**: Lockout duration, empty-field behavior, password composition rules — all marked `Not specified`
- **Auto-saved to**: `results/SCRUM-3/SCRUM-3_test_cases_{timestamp}.md`

---

## LLM Backend: Ollama vs Groq
<a id="llm"></a>

### Decision Matrix

| Factor | Ollama (Local) | Groq (Cloud) |
|--------|---------------|-------------|
| **Cost** | Free (runs on your GPU/CPU) | Free tier — rate-limited (6K TPM on some models) |
| **Privacy** | 100% local — ticket data never leaves machine | Data sent to Groq servers |
| **Speed** | Depends on hardware (slower on CPU-only) | Very fast (dedicated LPU hardware) |
| **Model quality** | `llama3.2:latest` (3.2B, good for test cases) | `llama-3.1-8b-instant` (8B, higher capability) |
| **Availability** | Requires Ollama running locally | Requires internet |
| **Rate limits** | None | Yes — free tier has TPM limits |

### Recommended Model Selection
- **`llama3.2:latest`** (3.2B) — good balance of speed and quality for test case generation on modest hardware
- **`qwen3.5:9b`** — best quality for complex tickets but slower; also available in the workspace
- **`gemma3:1b`** — fastest but lower quality; produces repetitive or truncated test cases

Source: Ollama API response showing available models in workspace: `gemma3:1b`, `qwen3.5:9b`, `llama3.2:latest`

### Why Groq Rate-Limited in This Session
The free Groq tier for `llama-3.1-8b-instant` has a **6,000 TPM (tokens per minute)** limit. A single RICE POT prompt + full ticket description can easily exceed 3,000 tokens, leaving only 3,000 tokens for the response — causing truncation or `429 rate_limit_exceeded`. Solution: switch to Ollama for unlimited local generation.

---

## Common Pitfalls & How to Avoid
<a id="pitfalls"></a>

| Pitfall | ❌ WRONG | ✅ RIGHT |
|---------|---------|---------|
| **LLM stops at 5 test cases** | Default PARAMETERS said "e.g., 5" | Set "Cover ALL exhaustively — do NOT stop at 5" |
| **LLM writes intro text** | No output constraint → "Here are the test cases..." | Add `⚠️ STRICT OUTPUT RULES` at top of prompt |
| **Groq rate limit** | Using free-tier Groq for large prompts | Use Ollama locally; Groq only as fallback |
| **Credentials in git** | Hardcoding tokens in source files | Use `.env` + `config.json`, both in `.gitignore` |
| **Settings not pre-filled** | `.env` exists but config_store doesn't read it | Use `python-dotenv` + priority-layer loading |
| **LLM guesses unspecified behavior** | Prompt doesn't say what to do with gaps | Explicitly: "Mark unspecified fields as `Not specified`" |
| **No traceability** | Test cases not linked to ticket/requirement | `Req Ref` column mandatory; uses ticket key as reference |
| **Results lost after session** | Manual copy-paste from chat | Auto-save to `results/{TICKET_KEY}/` with timestamp |
| **Wrong Ollama model** | `gemma3:1b` produces low-quality/repetitive TCs | Use `llama3.2:latest` or `qwen3.5:9b` for better output |

---

## Interview Q&A
<a id="qa"></a>

**Q1: How do you build a local-first AI test case generator that connects to Jira?**

A: The architecture has four modules: (1) `jira_client.py` fetches ticket data via Jira REST API v2 with Basic Auth; (2) `config_store.py` manages credential persistence using a priority chain — `.env` pre-fills, `config.json` persists UI saves; (3) `llm_client.py` streams responses from Ollama locally with automatic Groq fallback; (4) `app.py` orchestrates the flow and renders results in a ChatGPT-style Streamlit UI. The critical design decisions: local-first (Ollama) for privacy and cost, auto-save for result persistence, and `.env` pre-population to eliminate repetitive credential entry.

---

**Q2: Why does an LLM sometimes stop generating test cases after 5 results, and how do you fix it?**

A: Two root causes: (1) The prompt template's PARAMETERS section had a placeholder `[e.g., 5, 10...]` — the LLM reads this as an instruction and stops at 5. (2) Without explicit anti-truncation constraints, the model applies a default "reasonable response length" heuristic. Fix: replace the placeholder with an explicit directive: `"Cover ALL requirements exhaustively — do NOT stop at 5 or any other fixed number."` Also add `⚠️ STRICT OUTPUT RULES` at the top of the prompt, placed before ticket data, because LLMs front-weight attention and constraints placed at the end are often ignored.

---

**Q3: How do you prevent an AI-generated test case document from containing preamble text like "Here are the test cases"?**

A: Add an explicit negative constraint as the very first thing in the prompt, before any ticket data:
```
⚠️ STRICT OUTPUT RULES:
1. Output ONLY the test case table and coverage notes.
2. Do NOT write any introduction, preamble, or closing remarks.
3. Start immediately with: ## Part 1 — Test Case Table
```
Placement matters: constraints at the end of a long prompt compete with recency-dominated context. Placing them at the very top maximizes compliance.

---

**Q4: How does the Ollama → Groq fallback work, and what are the tradeoffs?**

A: In `llm_client.py`, the `generate()` function wraps Ollama in a try/except for `ConnectionError` and `Timeout`. If Ollama is unreachable and a Groq API key is configured, it yields a warning message then transparently continues streaming from Groq. Tradeoffs: Groq is faster and higher-quality but has rate limits on the free tier and sends data to external servers. Ollama is private and unlimited but requires local GPU/CPU resources. The recommended production approach is Ollama primary for all sensitive/large prompts, Groq only as an emergency fallback.

---

## Quick Reference
<a id="quickref"></a>

```
Run app:
  cd Chapter_03_Local_test_case_generator
  pip install -r requirements.txt
  streamlit run app.py

Check Ollama models:
  curl http://localhost:11434/api/tags

Use in chat:
  "create test cases for SCRUM-3"
  "generate tests for QA-102"

Results saved to:
  results/{TICKET_KEY}/{TICKET_KEY}_test_cases_{YYYYMMDD_HHMMSS}.md

Credential priority:
  config.json (saved UI) > .env (pre-fill) > DEFAULTS (empty)
```

| Need To... | Where to Look |
|-----------|--------------|
| Change LLM provider | Settings page (⚙️ button) or `config.json` |
| Pre-fill credentials | `.env` file |
| Change Ollama model | `.env` → `OLLAMA_MODEL=` or Settings |
| View generated test cases | `results/SCRUM-3/` folder |
| Modify test case format | `templates/RICE_POT_Test_Case_Generator_Template.md` |
| Fix "only 5 test cases" | `build_prompt()` in `app.py` + template PARAMETERS |
| Fix "intro text in output" | `⚠️ STRICT OUTPUT RULES` block in `build_prompt()` |

---

## Reference & Resources
<a id="reference"></a>

- [app.py — Chat Screen](file:///c:/Users/rajap/OneDrive/%E0%B9%80%E0%B8%AD%E0%B8%81%E0%B8%AA%E0%B8%B2%E0%B8%A3/LEARNINGAITESTER4X/Chapter_03_Local_test_case_generator/app.py)
- [config_store.py — Credential Priority Chain](file:///c:/Users/rajap/OneDrive/%E0%B9%80%E0%B8%AD%E0%B8%81%E0%B8%AA%E0%B8%B2%E0%B8%A3/LEARNINGAITESTER4X/Chapter_03_Local_test_case_generator/config_store.py)
- [llm_client.py — Ollama + Groq Streaming](file:///c:/Users/rajap/OneDrive/%E0%B9%80%E0%B8%AD%E0%B8%81%E0%B8%AA%E0%B8%B2%E0%B8%A3/LEARNINGAITESTER4X/Chapter_03_Local_test_case_generator/llm_client.py)
- [jira_client.py — Jira REST API](file:///c:/Users/rajap/OneDrive/%E0%B9%80%E0%B8%AD%E0%B8%81%E0%B8%AA%E0%B8%B2%E0%B8%A3/LEARNINGAITESTER4X/Chapter_03_Local_test_case_generator/jira_client.py)
- [RICE POT Template](file:///c:/Users/rajap/OneDrive/%E0%B9%80%E0%B8%AD%E0%B8%81%E0%B8%AA%E0%B8%B2%E0%B8%A3/LEARNINGAITESTER4X/Chapter_03_Local_test_case_generator/templates/RICE_POT_Test_Case_Generator_Template.md)
- [Walkthrough](file:///c:/Users/rajap/OneDrive/%E0%B9%80%E0%B8%AD%E0%B8%81%E0%B8%AA%E0%B8%B2%E0%B8%A3/LEARNINGAITESTER4X/Chapter_03_Local_test_case_generator/walkthrough.md)
- [SCRUM-3 Results](file:///c:/Users/rajap/OneDrive/%E0%B9%80%E0%B8%AD%E0%B8%81%E0%B8%AA%E0%B8%B2%E0%B8%A3/LEARNINGAITESTER4X/Chapter_03_Local_test_case_generator/results/SCRUM-3/)
- [KB_01 — LLM Fundamentals](file:///c:/Users/rajap/OneDrive/%E0%B9%80%E0%B8%AD%E0%B8%81%E0%B8%AA%E0%B8%B2%E0%B8%A3/LEARNINGAITESTER4X/IQ_Notes/KB_01_LLM_Fundamentals.md)
- [KB_02 — Prompt Engineering](file:///c:/Users/rajap/OneDrive/%E0%B9%80%E0%B8%AD%E0%B8%81%E0%B8%AA%E0%B8%B2%E0%B8%A3/LEARNINGAITESTER4X/IQ_Notes/KB_02_Prompt_Engineering.md)
- [Interview Q&A Lead SDET](file:///c:/Users/rajap/OneDrive/%E0%B9%80%E0%B8%AD%E0%B8%81%E0%B8%AA%E0%B8%B2%E0%B8%A3/LEARNINGAITESTER4X/IQ_Notes/Interview_QA_Lead_SDET_Prompt_Engineering.md)

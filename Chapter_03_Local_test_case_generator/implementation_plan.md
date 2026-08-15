# Local Test Case Generator — Streamlit App

A two-screen Streamlit app that takes a Jira ticket ID from a chat interface, fetches the ticket details, merges them into the RICE POT template, and generates structured test cases via Ollama (local, `gemma3:1b`) with automatic fallback to Groq.

---

## Proposed File Structure

```
Chapter_03_Local_test_case_generator/
├── app.py                        # Screen 1 — Chat (main entry point)
├── pages/
│   └── settings.py               # Screen 2 — Settings (Streamlit multipage)
├── config_store.py               # Read/write persisted settings to config.json
├── jira_client.py                # Jira REST API — fetch ticket details
├── llm_client.py                 # Ollama + Groq calls with fallback logic
├── templates/
│   └── RICE_POT_Test_Case_Generator_Template.md   # (already exists)
├── requirements.txt
└── config.json                   # Auto-created at runtime, git-ignored
```

---

## Screen 1 — Chat (`app.py`)

- ChatGPT-style layout: message history displayed top-to-bottom, sticky input at bottom
- User types e.g. `create test cases for QA-102` → clicks **Send**
- App parses the Jira ticket key via regex (`[A-Z]+-\d+`)
- Calls `jira_client.py` → fetches summary, description, acceptance criteria
- Loads the RICE POT template from `/templates`
- Calls `llm_client.py` → sends merged prompt to Ollama (or Groq fallback)
- Renders streamed/full LLM response as a chat bubble

## Screen 2 — Settings (`pages/settings.py`)

- Fields: Jira Base URL, Jira Email, Jira API Token, LLM Provider (Ollama / Groq), Groq API Key
- **Save** button persists to `config.json` via `config_store.py`
- Shows current saved values (tokens masked)
- Connection test buttons: **Test Jira** and **Test Ollama**

---

## Data Flow

```
[User types "create test cases for QA-102"]
        ↓
[app.py] — regex parse → ticket key = "QA-102"
        ↓
[jira_client.py] — REST GET /rest/api/2/issue/QA-102
        ↓ (summary, description, acceptance criteria)
[app.py] — load RICE_POT template from /templates/
        ↓ (merged prompt string)
[llm_client.py] — try Ollama (gemma3:1b @ localhost:11434)
        ↓  if unavailable or user chose Groq → fallback to Groq API
[app.py] — render response in chat pane
```

---

## Proposed Changes

### [NEW] `app.py`
Main chat screen. Parses user input, orchestrates Jira fetch + template merge + LLM call, renders chat history using `st.chat_message`.

### [NEW] `pages/settings.py`
Streamlit multipage settings screen. Inputs for all credentials and provider selection. Calls `config_store.save()` on Submit.

### [NEW] `config_store.py`
Reads/writes `config.json` (excluded from git via `.gitignore`). Exposes `load()` and `save(data)` functions.

### [NEW] `jira_client.py`
Single function `fetch_ticket(ticket_key, config)` → returns dict with `summary`, `description`, `acceptance_criteria`. Uses `requests` with Basic Auth.

### [NEW] `llm_client.py`
`generate(prompt, config)` → tries Ollama first via HTTP POST to `localhost:11434/api/generate`, falls back to Groq SDK if Ollama is down or config says Groq. Returns generated text string.

### [NEW] `requirements.txt`
`streamlit`, `requests`, `groq`

### [NEW] `.gitignore`
Excludes `config.json` and `__pycache__/`.

---

## Verification Plan

### Automated
- `streamlit run app.py` — confirm both pages load without errors
- Settings page saves and reloads values from `config.json`

### Manual
1. Open Settings → enter Jira credentials → Save → confirm `config.json` created
2. In Chat → type `create test cases for <a real Jira ID>` → verify ticket is fetched and test cases appear
3. Disable Ollama → send a request → verify fallback to Groq kicks in (if Groq key is set)

---

> [!IMPORTANT]
> **Open questions for you before I build:**
> 1. **Output directory** — Should I create the app files directly inside `Chapter_03_Local_test_case_generator/`, or in a new sub-folder like `app/`?
> 2. **Jira version** — Are you connecting to **Jira Cloud** (Atlassian) or **Jira Server/Data Center**? (affects the REST API path slightly)
> 3. **Streaming** — Should the LLM response stream token-by-token (like ChatGPT), or is a full response on completion fine?

# Walkthrough — Local Test Case Generator

## What Was Built

A two-screen Streamlit app that takes a Jira ticket ID, fetches ticket details, merges them into the RICE POT template, and streams AI-generated test cases directly in the chat pane.

---

## File Structure (created)

```
Chapter_03_Local_test_case_generator/
├── app.py                 ← Screen 1: Chat interface (main entry)
├── pages/
│   └── settings.py        ← Screen 2: Settings (Jira + LLM config)
├── config_store.py        ← Reads/writes config.json safely
├── jira_client.py         ← Jira Cloud REST API v2 client
├── llm_client.py          ← Ollama + Groq with streaming + fallback
├── templates/
│   └── RICE_POT_Test_Case_Generator_Template.md  (pre-existing)
├── requirements.txt
├── .gitignore             ← Excludes config.json from git
└── implementation_plan.md
```

---

## How to Run

```bash
cd Chapter_03_Local_test_case_generator
pip install -r requirements.txt
streamlit run app.py
```

Opens at **http://localhost:8501**

---

## First-Time Setup

1. Click **⚙️ Settings** in the top-right corner
2. Enter your **Jira Base URL** (e.g. `https://yourcompany.atlassian.net`)
3. Enter your **Jira Email** and **API Token** ([generate here](https://id.atlassian.com/manage-profile/security/api-tokens))
4. Choose **LLM Provider**: Ollama (default, local) or Groq (cloud)
5. If using Groq, paste your **Groq API Key** ([get one free](https://console.groq.com))
6. Click **💾 Save Settings** → credentials are stored in `config.json` (git-ignored)

---

## How to Use

In the Chat screen, type any message containing a Jira ticket key:

```
create test cases for QA-102
generate tests for PROJ-455
test cases for JIRA-23
```

The app will:
1. **Parse** the ticket key from your message
2. **Fetch** the ticket (summary, description, acceptance criteria) from Jira
3. **Merge** the ticket data into the RICE POT template
4. **Stream** the LLM response token-by-token (like ChatGPT)
5. **Render** Part 1 (Test Case Table) + Part 2 (Coverage Notes)

---

## LLM Behaviour

| Situation | Behaviour |
|---|---|
| Ollama running + model present | Uses `gemma3:1b` locally (no internet needed) |
| Ollama unreachable + Groq key set | Auto-falls back to Groq `llama3-8b-8192` |
| Ollama unreachable + no Groq key | Shows clear error with instructions |
| User explicitly selects Groq | Goes directly to Groq, skips Ollama |

---

## Screenshot

![App UI](file:///C:/Users/rajap/.gemini/antigravity-ide/brain/8f118e89-f65e-4a2d-9022-468a6630a8a3/streamlit_app_ui_1786797155782.png)

---

## Verification Results

- ✅ All packages import cleanly (`streamlit`, `requests`, `groq`)
- ✅ All local modules import cleanly (`config_store`, `jira_client`, `llm_client`)
- ✅ App starts at `http://localhost:8501`
- ✅ Page title: "Local Test Case Generator"
- ✅ Chat interface visible with correct placeholder text
- ✅ Welcome message rendered correctly
- ✅ No Python errors or Streamlit tracebacks
- ✅ Settings page accessible via ⚙️ button

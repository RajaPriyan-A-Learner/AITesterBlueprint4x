# 🧪 Local AI Test Case Generator

> **From a Jira ticket ID to 35+ structured test cases in under 2 minutes — running 100% locally.**

![Python](https://img.shields.io/badge/Python-3.x-blue?logo=python) ![Streamlit](https://img.shields.io/badge/Streamlit-1.35+-red?logo=streamlit) ![Ollama](https://img.shields.io/badge/LLM-Ollama%20Local-green) ![Jira](https://img.shields.io/badge/Jira-REST%20API%20v2-blue?logo=jira)

---

## What It Does

Type `create test cases for SCRUM-3` → the app:

1. **Fetches** the Jira ticket (summary, description, acceptance criteria) via REST API
2. **Merges** the ticket into a RICE POT prompt template
3. **Streams** structured test cases from a local LLM (Ollama) — like ChatGPT, on your machine
4. **Auto-saves** results to `results/{TICKET_KEY}/` with timestamp

No cloud. No API cost. No data leaves your machine.

---

## Demo — SCRUM-3 Live Run

| Metric | Result |
|--------|--------|
| Ticket | SCRUM-3 — VWO Login Dashboard |
| Test Cases Generated | **35** |
| Time | ~90 seconds (local CPU) |
| Scenarios | Positive · Negative · Boundary · Security · Role-based · Session · 2FA · Recovery |
| Requirement Gaps Flagged | **4** (auto-identified, marked `Not specified`) |

📁 See full output → [`results/SCRUM-3/`](results/SCRUM-3/)

---

## How to Run

```bash
pip install -r requirements.txt
streamlit run app.py
```

Open [http://localhost:8501](http://localhost:8501) → click **⚙️ Settings** → enter Jira + Ollama credentials → type `create test cases for YOUR-TICKET-KEY`

---

## Stack

| Layer | Tech |
|-------|------|
| UI | Streamlit (two-screen: Chat + Settings) |
| LLM Primary | Ollama · `llama3.2:latest` (local) |
| LLM Fallback | Groq API · `llama-3.1-8b-instant` |
| API | Jira REST API v2 (Basic Auth) |
| Prompt Framework | RICE POT (Role · Instructions · Context · Example · Parameters · Output · Tone) |
| Config | python-dotenv → `.env` pre-fills Settings UI |

---

## Project Structure

```
├── app.py                    ← Chat UI + orchestration
├── pages/settings.py         ← Jira + LLM config screen
├── config_store.py           ← 3-layer credential priority chain
├── jira_client.py            ← Jira REST API client
├── llm_client.py             ← Ollama + Groq streaming + fallback
├── templates/
│   └── RICE_POT_Test_Case_Generator_Template.md
├── results/SCRUM-3/          ← Auto-saved test case outputs
└── .env                      ← Git-ignored — pre-fills Settings
```

---

## Key Engineering Decisions

- **Local-first LLM** — Jira ticket data (often sensitive business requirements) never leaves the internal network
- **Automatic fallback** — Groq activates transparently if Ollama is unreachable
- **RICE POT prompt constraints** — `⚠️ STRICT OUTPUT RULES` injected at the top of every prompt (not buried at the end) to enforce no preamble and exhaustive coverage
- **3-layer config priority** — `.env` → `config.json` → defaults, with empty-string guard to prevent accidental overwrites

---

## Built With

**Agentic AI + Prompt Engineering** — part of the [AI Tester Blueprint 4X](https://github.com/RajaPriyan-A-Learner/AITesterBlueprint4x) learning series.

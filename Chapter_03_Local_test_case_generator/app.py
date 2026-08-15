"""
app.py
------
Screen 1 — Chat
ChatGPT-style interface for the Local Test Case Generator.
User types: "create test cases for QA-102" → app fetches ticket,
merges it into the RICE POT template, streams LLM response into chat.
"""

import re
import os
import streamlit as st
import config_store
import jira_client
import llm_client

# ── Page config ──────────────────────────────────────────────────────────────
st.set_page_config(
    page_title="Local Test Case Generator",
    page_icon="🧪",
    layout="wide",
    initial_sidebar_state="collapsed",
)

# ── Custom CSS ───────────────────────────────────────────────────────────────
st.markdown("""
<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

html, body, [class*="css"] { font-family: 'Inter', sans-serif; }

/* ── Hide default Streamlit chrome ───────────────────────────────────────── */
#MainMenu, footer, header { visibility: hidden; }

/* ── Shared layout ───────────────────────────────────────────────────────── */
.stApp { min-height: 100vh; transition: background 0.3s ease; }

.app-header {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px 0 8px;
    margin-bottom: 20px;
}
.app-title {
    font-size: 22px;
    font-weight: 700;
    background: linear-gradient(135deg, #7c3aed, #3b82f6);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}
.app-subtitle { font-size: 13px; margin-top: 2px; }
.provider-badge {
    margin-left: auto;
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
    background: rgba(124,58,237,0.12);
    color: #7c3aed;
    border: 1px solid rgba(124,58,237,0.25);
}
.stChatMessage {
    border-radius: 14px !important;
    padding: 14px 18px !important;
    margin-bottom: 12px !important;
}
.stChatInputContainer { border-radius: 14px !important; }
.ticket-pill {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    border-radius: 8px;
    padding: 4px 12px;
    font-size: 12px;
    margin-bottom: 12px;
}
.nav-hint { text-align: center; font-size: 12px; margin-top: 8px; }
.stSpinner > div > div { border-color: #7c3aed transparent transparent transparent !important; }

/* ── Dark mode ───────────────────────────────────────────────────────────── */
@media (prefers-color-scheme: dark) {
    .stApp { background: linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #16213e 100%); }
    .app-header { border-bottom: 1px solid rgba(255,255,255,0.07); }
    .app-subtitle { color: #475569; }
    .stChatMessage {
        background: rgba(255,255,255,0.04) !important;
        border: 1px solid rgba(255,255,255,0.07) !important;
        backdrop-filter: blur(8px);
    }
    [data-testid="stChatMessageContent"] p { color: #e2e8f0; line-height: 1.65; }
    .stChatInputContainer {
        background: rgba(255,255,255,0.04) !important;
        border: 1px solid rgba(255,255,255,0.10) !important;
        backdrop-filter: blur(8px);
    }
    .stChatInputContainer textarea { color: #f1f5f9 !important; background: transparent !important; }
    .ticket-pill { background: rgba(99,102,241,0.15); border: 1px solid rgba(99,102,241,0.3); color: #a5b4fc; }
    .nav-hint { color: #475569; }
}

/* ── Light mode ──────────────────────────────────────────────────────────── */
@media (prefers-color-scheme: light) {
    .stApp { background: linear-gradient(135deg, #f8f9ff 0%, #eff0ff 50%, #f0f4ff 100%); }
    .app-header { border-bottom: 1px solid rgba(0,0,0,0.07); }
    .app-subtitle { color: #64748b; }
    .stChatMessage {
        background: rgba(255,255,255,0.85) !important;
        border: 1px solid rgba(0,0,0,0.08) !important;
        box-shadow: 0 2px 8px rgba(0,0,0,0.04);
    }
    [data-testid="stChatMessageContent"] p { color: #1e293b; line-height: 1.65; }
    .stChatInputContainer {
        background: rgba(255,255,255,0.9) !important;
        border: 1px solid rgba(0,0,0,0.10) !important;
    }
    .ticket-pill { background: rgba(99,102,241,0.08); border: 1px solid rgba(99,102,241,0.2); color: #4f46e5; }
    .nav-hint { color: #64748b; }
}
</style>
""", unsafe_allow_html=True)

# ── Helpers ──────────────────────────────────────────────────────────────────
TICKET_PATTERN = re.compile(r"\b([A-Z][A-Z0-9]+-\d+)\b")
TEMPLATES_DIR = os.path.join(os.path.dirname(__file__), "templates")


def load_template() -> str:
    """Load the first .md file found in /templates/."""
    for fname in os.listdir(TEMPLATES_DIR):
        if fname.endswith(".md"):
            with open(os.path.join(TEMPLATES_DIR, fname), "r", encoding="utf-8") as f:
                return f.read()
    return ""


def build_prompt(ticket: dict, template: str) -> str:
    """
    Merge Jira ticket data into a focused generation prompt,
    using the RICE POT template structure as the output format guide.
    """
    acceptance = ticket["acceptance_criteria"] or "Not specified in ticket."
    return f"""You are a Senior QA Engineer. Your task is to generate structured test cases for the following Jira ticket.

⚠️ STRICT OUTPUT RULES — you MUST follow these exactly:
1. Output ONLY the test case table and coverage notes. NO introduction, NO preamble, NO summary paragraph, NO closing remarks.
2. Do NOT write sentences like "Here are the test cases" or "Based on the ticket..." — start IMMEDIATELY with the markdown table.
3. Do NOT limit output to 5 or any fixed number. Generate ALL test cases needed to exhaustively cover every scenario (Positive, Negative, Boundary, Security, State/Idempotency).
4. Your response MUST begin with: ## Part 1 — Test Case Table

## Ticket Details
- **Ticket Key:** {ticket['key']}
- **Issue Type:** {ticket['issue_type']}
- **Status:** {ticket['status']}
- **Summary:** {ticket['summary']}

### Description
{ticket['description'] or 'No description provided.'}

### Acceptance Criteria
{acceptance}

## Output Format
Use the RICE POT template structure below for format and column layout:

{template}

## Generation Rules
1. Generate test cases ONLY from the ticket details above — do not invent requirements.
2. Cover ALL scenario types: Positive, Negative, Boundary, Security, and State/Idempotency.
3. For any behavior not specified in the ticket, mark that field as `Not specified` — do NOT guess.
4. Use `{ticket['key']}` as the requirement reference in the Req Ref column.
5. Do NOT stop after 5 test cases — keep going until ALL scenarios are covered.
6. Use Markdown table format with the columns: Test ID | Description | Pre-conditions | Test Data | Steps | Expected Result | Priority | Req Ref

Begin now (start directly with ## Part 1 — Test Case Table):"""


def parse_ticket_key(user_input: str) -> str | None:
    """Extract a Jira ticket key from user input. Returns None if not found."""
    match = TICKET_PATTERN.search(user_input.upper())
    return match.group(1) if match else None


# ── Session state init ───────────────────────────────────────────────────────
if "messages" not in st.session_state:
    st.session_state.messages = []
if "cfg" not in st.session_state:
    st.session_state.cfg = config_store.load()

cfg = st.session_state.cfg

# ── Header ───────────────────────────────────────────────────────────────────
col_title, col_badge, col_settings = st.columns([6, 2, 1])
with col_title:
    st.markdown("""
    <div class="app-header">
        <span style="font-size:28px">🧪</span>
        <div>
            <div class="app-title">Local Test Case Generator</div>
            <div class="app-subtitle">Powered by Jira + Ollama / Groq · RICE POT Template</div>
        </div>
    </div>
    """, unsafe_allow_html=True)

with col_badge:
    provider_label = cfg.get("llm_provider", "Ollama")
    icon = "💻" if provider_label == "Ollama" else "☁️"
    st.markdown(f'<div class="provider-badge" style="margin-top:20px">{icon} {provider_label}</div>', unsafe_allow_html=True)

with col_settings:
    st.markdown('<div style="margin-top:20px">', unsafe_allow_html=True)
    if st.button("⚙️ Settings", key="goto_settings"):
        st.switch_page("pages/settings.py")
    st.markdown('</div>', unsafe_allow_html=True)

st.markdown('<p class="nav-hint">💡 Try: <code>create test cases for QA-102</code></p>', unsafe_allow_html=True)

# ── Welcome message ──────────────────────────────────────────────────────────
if not st.session_state.messages:
    with st.chat_message("assistant", avatar="🧪"):
        st.markdown("""
**Welcome to the Local Test Case Generator!** 👋

I can generate structured test cases from any Jira ticket using the **RICE POT** template framework.

**How to use:**
1. Type a request like: `create test cases for QA-102`
2. I'll fetch the ticket from Jira and generate full test cases — covering positive, negative, boundary, and security scenarios.
3. Results are streamed directly here, like ChatGPT.

> ⚙️ First time? Click **Settings** above to configure your Jira credentials and LLM provider.
        """)

# ── Render chat history ───────────────────────────────────────────────────────
for msg in st.session_state.messages:
    avatar = "👤" if msg["role"] == "user" else "🧪"
    with st.chat_message(msg["role"], avatar=avatar):
        st.markdown(msg["content"])

# ── Chat input ────────────────────────────────────────────────────────────────
if user_input := st.chat_input("Type a request, e.g. 'create test cases for QA-102'…"):

    # Reload config in case Settings were changed
    cfg = config_store.load()
    st.session_state.cfg = cfg

    # Show user message
    st.session_state.messages.append({"role": "user", "content": user_input})
    with st.chat_message("user", avatar="👤"):
        st.markdown(user_input)

    # Parse ticket key
    ticket_key = parse_ticket_key(user_input)

    with st.chat_message("assistant", avatar="🧪"):
        if not ticket_key:
            # No ticket key found — treat as general message
            response_text = (
                f"I couldn't find a Jira ticket key in your message.\n\n"
                f"Please include a ticket key like **QA-102** or **PROJ-456**.\n\n"
                f"Example: `create test cases for QA-102`"
            )
            st.markdown(response_text)
            st.session_state.messages.append({"role": "assistant", "content": response_text})
        else:
            # Step 1: Fetch Jira ticket
            status_placeholder = st.empty()
            status_placeholder.markdown(f"🔍 Fetching ticket **{ticket_key}** from Jira…")

            try:
                ticket = jira_client.fetch_ticket(ticket_key, cfg)
            except Exception as exc:
                error_msg = f"❌ **Jira Error:** {exc}"
                status_placeholder.error(error_msg)
                st.session_state.messages.append({"role": "assistant", "content": error_msg})
                st.stop()

            # Step 2: Load template
            status_placeholder.markdown(f"📋 Loaded ticket **{ticket_key}**: _{ticket['summary']}_\n\n⚙️ Building prompt from RICE POT template…")
            template = load_template()

            if not template:
                error_msg = "❌ No template found in `/templates/` folder."
                status_placeholder.error(error_msg)
                st.session_state.messages.append({"role": "assistant", "content": error_msg})
                st.stop()

            # Step 3: Build prompt
            prompt = build_prompt(ticket, template)

            # Step 4: Stream LLM response
            status_placeholder.markdown(
                f"✅ **{ticket_key}**: _{ticket['summary']}_\n\n"
                f"🤖 Generating test cases via **{cfg.get('llm_provider', 'Ollama')}**…"
            )

            output_placeholder = st.empty()
            full_response = ""

            try:
                for chunk in llm_client.generate(prompt, cfg):
                    full_response += chunk
                    output_placeholder.markdown(full_response + "▌")

                # Final render without cursor
                status_placeholder.markdown(
                    f"✅ **{ticket_key}** · _{ticket['summary']}_ · "
                    f"`{ticket['issue_type']}` · Status: `{ticket['status']}`"
                )
                output_placeholder.markdown(full_response)
                st.session_state.messages.append({"role": "assistant", "content": full_response})

                # ── Auto-save result to results/{ticket_key}/ ─────────────────
                try:
                    import datetime
                    results_dir = os.path.join(os.path.dirname(__file__), "results", ticket_key)
                    os.makedirs(results_dir, exist_ok=True)
                    ts = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
                    result_file = os.path.join(results_dir, f"{ticket_key}_test_cases_{ts}.md")
                    with open(result_file, "w", encoding="utf-8") as f:
                        f.write(f"# Test Cases — {ticket_key}\n")
                        f.write(f"**Summary:** {ticket['summary']}  \n")
                        f.write(f"**Generated:** {datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')}  \n")
                        f.write(f"**LLM:** {cfg.get('llm_provider','Ollama')} · `{cfg.get('ollama_model','') if cfg.get('llm_provider','Ollama')=='Ollama' else 'groq'}`  \n\n")
                        f.write("---\n\n")
                        f.write(full_response)
                    st.toast(f"💾 Saved → results/{ticket_key}/{os.path.basename(result_file)}", icon="✅")
                except Exception as save_err:
                    st.toast(f"⚠️ Auto-save failed: {save_err}", icon="⚠️")


            except Exception as exc:
                error_msg = f"❌ **LLM Error:** {exc}"
                output_placeholder.error(error_msg)
                st.session_state.messages.append({"role": "assistant", "content": error_msg})

# ── Sidebar: quick actions ────────────────────────────────────────────────────
with st.sidebar:
    st.markdown("### 🧪 Test Case Generator")
    st.markdown("---")

    provider = cfg.get("llm_provider", "Ollama")
    icon = "💻" if provider == "Ollama" else "☁️"
    st.markdown(f"**Provider:** {icon} {provider}")

    if cfg.get("jira_url"):
        st.markdown(f"**Jira:** `{cfg['jira_url']}`")
    else:
        st.warning("⚠️ Jira not configured")

    st.markdown("---")

    if st.button("🗑️ Clear Chat", use_container_width=True):
        st.session_state.messages = []
        st.rerun()

    if st.button("🔄 Reload Config", use_container_width=True):
        st.session_state.cfg = config_store.load()
        st.rerun()

    st.markdown("---")
    st.caption("**Tips:**\n- `create test cases for QA-102`\n- `generate tests for PROJ-455`\n- Any message with a Jira key works!")

"""
pages/settings.py
-----------------
Screen 2 — Settings
Streamlit multipage screen for configuring Jira credentials,
LLM provider selection, and Groq API key.
All values are persisted via config_store (config.json, git-ignored).
"""

import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

import streamlit as st
import config_store
import jira_client
import llm_client

st.set_page_config(
    page_title="Settings — Test Case Generator",
    page_icon="⚙️",
    layout="centered",
)

# ── Custom CSS ──────────────────────────────────────────────────────────────
st.markdown("""
<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

html, body, [class*="css"] { font-family: 'Inter', sans-serif; }

/* ── Shared styles ─────────────────────────────────────────────────────── */
.stApp { transition: background 0.3s ease; }

.settings-card {
    border-radius: 16px;
    padding: 28px 32px;
    margin-bottom: 20px;
    backdrop-filter: blur(10px);
}
.settings-card h3 {
    color: #7c3aed;
    font-size: 14px;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    margin-bottom: 16px;
}

input:focus { border-color: #7c3aed !important; box-shadow: 0 0 0 2px rgba(124,58,237,0.2) !important; }

.stButton > button {
    background: linear-gradient(135deg, #7c3aed, #4f46e5) !important;
    color: #fff !important;
    border: none !important;
    border-radius: 10px !important;
    font-weight: 600 !important;
    padding: 10px 24px !important;
    transition: all 0.2s ease !important;
}
.stButton > button:hover {
    transform: translateY(-1px) !important;
    box-shadow: 0 6px 20px rgba(124,58,237,0.4) !important;
}

.section-title { font-size: 24px; font-weight: 700; margin-bottom: 4px; }
.section-sub   { font-size: 14px; margin-bottom: 28px; }

/* ── Dark mode ───────────────────────────────────────────────────────────── */
@media (prefers-color-scheme: dark) {
    .stApp { background: linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #16213e 100%); }
    .settings-card { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); }
    label { color: #cbd5e1 !important; font-size: 13px !important; }
    input, textarea, select {
        background: rgba(255,255,255,0.06) !important;
        border: 1px solid rgba(255,255,255,0.12) !important;
        border-radius: 8px !important;
        color: #f1f5f9 !important;
    }
    .section-title { color: #f1f5f9; }
    .section-sub   { color: #475569; }
}

/* ── Light mode ──────────────────────────────────────────────────────────── */
@media (prefers-color-scheme: light) {
    .stApp { background: linear-gradient(135deg, #f8f9ff 0%, #eff0ff 50%, #f0f4ff 100%); }
    .settings-card { background: rgba(255,255,255,0.75); border: 1px solid rgba(0,0,0,0.07); box-shadow: 0 2px 12px rgba(0,0,0,0.05); }
    label { color: #374151 !important; font-size: 13px !important; }
    input, textarea, select {
        background: #ffffff !important;
        border: 1px solid rgba(0,0,0,0.12) !important;
        border-radius: 8px !important;
        color: #111827 !important;
    }
    .section-title { color: #111827; }
    .section-sub   { color: #6b7280; }
}
</style>
""", unsafe_allow_html=True)

# ── Load saved config ────────────────────────────────────────────────────────
cfg = config_store.load()

st.markdown('<p class="section-title">⚙️ Settings</p>', unsafe_allow_html=True)
st.markdown('<p class="section-sub">Configure your Jira connection and LLM provider. Credentials are saved locally and never shared.</p>', unsafe_allow_html=True)

# ── Jira Configuration ───────────────────────────────────────────────────────
st.markdown('<div class="settings-card"><h3>🔗 Jira Connection</h3>', unsafe_allow_html=True)

jira_url = st.text_input(
    "Jira Base URL",
    value=cfg.get("jira_url", ""),
    placeholder="https://yourcompany.atlassian.net",
    help="Your Jira Cloud base URL (no trailing slash)",
    key="s_jira_url",
)
jira_email = st.text_input(
    "Jira Email",
    value=cfg.get("jira_email", ""),
    placeholder="you@company.com",
    key="s_jira_email",
)
jira_token = st.text_input(
    "Jira API Token",
    value=cfg.get("jira_token", ""),
    type="password",
    placeholder="Paste your Atlassian API token here",
    help="Generate at https://id.atlassian.com/manage-profile/security/api-tokens",
    key="s_jira_token",
)

col_test_jira, col_jira_status = st.columns([1, 3])
with col_test_jira:
    if st.button("🔌 Test Jira", key="btn_test_jira"):
        with st.spinner("Testing…"):
            ok, msg = jira_client.test_connection({
                "jira_url": jira_url,
                "jira_email": jira_email,
                "jira_token": jira_token,
            })
        with col_jira_status:
            if ok:
                st.success(msg)
            else:
                st.error(msg)

st.markdown('</div>', unsafe_allow_html=True)

# ── LLM Provider ─────────────────────────────────────────────────────────────
st.markdown('<div class="settings-card"><h3>🤖 LLM Provider</h3>', unsafe_allow_html=True)

provider = st.radio(
    "Default LLM backend",
    options=["Ollama", "Groq"],
    index=0 if cfg.get("llm_provider", "Ollama") == "Ollama" else 1,
    horizontal=True,
    key="s_provider",
    help="Ollama runs locally (default). Groq is the cloud fallback.",
)

if provider == "Ollama":
    st.info(f"Using local Ollama · model `{cfg.get('ollama_model', 'gemma3:1b')}` · endpoint `{cfg.get('ollama_endpoint', 'http://localhost:11434')}`", icon="💻")

    col_test_ollama, col_ollama_status = st.columns([1, 3])
    with col_test_ollama:
        if st.button("🔌 Test Ollama", key="btn_test_ollama"):
            with st.spinner("Testing…"):
                ok, msg = llm_client.test_ollama(cfg)
            with col_ollama_status:
                if ok:
                    st.success(msg)
                else:
                    st.error(msg)
else:
    groq_api_key = st.text_input(
        "Groq API Key",
        value=cfg.get("groq_api_key", ""),
        type="password",
        placeholder="gsk_...",
        help="Get a free key at https://console.groq.com",
        key="s_groq_key",
    )

    col_test_groq, col_groq_status = st.columns([1, 3])
    with col_test_groq:
        if st.button("🔌 Test Groq", key="btn_test_groq"):
            with st.spinner("Testing…"):
                ok, msg = llm_client.test_groq({
                    **cfg,
                    "groq_api_key": st.session_state.get("s_groq_key", cfg.get("groq_api_key", "")),
                })
            with col_groq_status:
                if ok:
                    st.success(msg)
                else:
                    st.error(msg)


st.markdown('</div>', unsafe_allow_html=True)

# ── Save Button ───────────────────────────────────────────────────────────────
if st.button("💾 Save Settings", use_container_width=True, key="btn_save"):
    new_cfg = {
        "jira_url": jira_url.strip(),
        "jira_email": jira_email.strip(),
        "jira_token": jira_token.strip(),
        "llm_provider": provider,
        "groq_api_key": st.session_state.get("s_groq_key", cfg.get("groq_api_key", "")),
    }
    config_store.save(new_cfg)
    st.success("✅ Settings saved successfully!", icon="💾")
    st.balloons()

# ── Footer ────────────────────────────────────────────────────────────────────
st.markdown("---")
st.caption("🔒 All credentials are stored in `config.json` (local only, git-ignored). Nothing is sent to external servers except Jira and your chosen LLM provider.")

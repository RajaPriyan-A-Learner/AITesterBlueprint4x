"""
config_store.py
---------------
Handles reading and writing persisted settings to a local config.json file.

Priority order for each field (highest → lowest):
  1. config.json  — values explicitly saved by the user via the Settings UI
  2. .env file    — pre-populated credentials for local development
  3. DEFAULTS     — safe empty/fallback values

Credentials are NEVER hardcoded. Neither config.json nor .env are committed
to source control (both are git-ignored).
"""

import json
import os

# ── Load .env (if present) using python-dotenv ────────────────────────────────
try:
    from dotenv import load_dotenv
    _ENV_PATH = os.path.join(os.path.dirname(__file__), ".env")
    load_dotenv(_ENV_PATH, override=False)  # don't override already-set env vars
except ImportError:
    pass  # python-dotenv not installed — .env values won't be available

CONFIG_PATH = os.path.join(os.path.dirname(__file__), "config.json")

DEFAULTS = {
    "jira_url": "",
    "jira_email": "",
    "jira_token": "",
    "llm_provider": "Ollama",   # "Ollama" | "Groq"
    "groq_api_key": "",
    "ollama_endpoint": "http://localhost:11434",
    "ollama_model": "gemma3:1b",
}

# ── Map env-var names → config keys ───────────────────────────────────────────
_ENV_MAP = {
    "JIRA_URL":       "jira_url",
    "JIRA_EMAIL":     "jira_email",
    "JIRA_API_TOKEN": "jira_token",
    "GROQ_API_KEY":   "groq_api_key",
    "OLLAMA_ENDPOINT": "ollama_endpoint",
    "OLLAMA_MODEL":   "ollama_model",
    "LLM_PROVIDER":   "llm_provider",
}


def _env_defaults() -> dict:
    """Build a dict of values sourced from environment variables / .env file."""
    env = {}
    for env_var, cfg_key in _ENV_MAP.items():
        val = os.environ.get(env_var, "")
        if val:
            env[cfg_key] = val
    return env


def load() -> dict:
    """Return config dict, merging .env values for any field left empty in config.json."""
    env_vals = _env_defaults()

    # Start from DEFAULTS, layer .env on top
    merged = DEFAULTS.copy()
    merged.update(env_vals)

    if not os.path.exists(CONFIG_PATH):
        return merged

    try:
        with open(CONFIG_PATH, "r", encoding="utf-8") as f:
            stored = json.load(f)
        # For each stored value: use it only if non-empty; otherwise keep .env value
        for key, val in stored.items():
            if val:  # non-empty stored value wins
                merged[key] = val
        return merged
    except (json.JSONDecodeError, OSError):
        return merged


def save(data: dict) -> None:
    """Persist config dict to config.json."""
    existing = load()
    existing.update(data)
    with open(CONFIG_PATH, "w", encoding="utf-8") as f:
        json.dump(existing, f, indent=2)

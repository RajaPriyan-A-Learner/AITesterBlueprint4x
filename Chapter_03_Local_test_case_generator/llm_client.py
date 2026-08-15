"""
llm_client.py
-------------
Handles LLM generation with:
  - Primary:  Ollama (local, gemma3:1b @ localhost:11434) — streaming
  - Fallback: Groq API — used only when Ollama is unavailable OR user explicitly chose Groq

No API keys are hardcoded. All credentials come from config_store.
"""

import json
import requests
from typing import Generator


# ---------------------------------------------------------------------------
# Public API
# ---------------------------------------------------------------------------

def generate(prompt: str, config: dict) -> Generator[str, None, None]:
    """
    Stream the LLM response token-by-token.

    Yields chunks of text as they arrive.
    Falls back to Groq automatically if Ollama is unreachable and provider is Ollama.

    Args:
        prompt: The full assembled prompt string.
        config: dict from config_store.load()

    Yields:
        str chunks of the generated response.
    """
    provider = config.get("llm_provider", "Ollama")

    if provider == "Groq":
        yield from _groq_generate(prompt, config)
    else:
        # Try Ollama first; fall back to Groq on connection failure
        try:
            yield from _ollama_generate(prompt, config)
        except (requests.ConnectionError, requests.Timeout) as exc:
            groq_key = config.get("groq_api_key", "")
            if groq_key:
                yield "⚠️ Ollama is unreachable — switching to Groq fallback...\n\n"
                yield from _groq_generate(prompt, config)
            else:
                raise RuntimeError(
                    "Ollama is unreachable and no Groq API key is configured. "
                    "Start Ollama or add a Groq API key in ⚙️ Settings."
                ) from exc


def test_ollama(config: dict) -> tuple[bool, str]:
    """
    Quick connectivity test for Ollama.
    Returns (success: bool, message: str).
    """
    endpoint = config.get("ollama_endpoint", "http://localhost:11434")
    try:
        resp = requests.get(f"{endpoint}/api/tags", timeout=5)
        if resp.status_code == 200:
            models = [m["name"] for m in resp.json().get("models", [])]
            model = config.get("ollama_model", "gemma3:1b")
            if any(model in m for m in models):
                return True, f"✅ Ollama running — model `{model}` found."
            else:
                return True, f"✅ Ollama running — model `{model}` **not found** in list: {models}. It may still work if already loaded."
        return False, f"❌ Ollama responded with HTTP {resp.status_code}"
    except (requests.ConnectionError, requests.Timeout):
        return False, f"❌ Cannot reach Ollama at `{endpoint}`."


# ---------------------------------------------------------------------------
# Private helpers
# ---------------------------------------------------------------------------

def test_groq(config: dict) -> tuple[bool, str]:
    """
    Quick connectivity test for Groq — makes a minimal API call (max_tokens=1).
    Returns (success: bool, message: str).
    """
    api_key = config.get("groq_api_key", "")
    if not api_key:
        return False, "❌ No Groq API key configured. Add one in ⚙️ Settings."
    try:
        from groq import Groq
    except ImportError:
        return False, "❌ 'groq' package not installed. Run: pip install groq"
    try:
        client = Groq(api_key=api_key)
        resp = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[{"role": "user", "content": "ping"}],
            max_tokens=1,
        )
        model_used = resp.model or "llama-3.1-8b-instant"
        return True, f"✅ Groq connected — model `{model_used}` is reachable."
    except Exception as exc:
        err = str(exc)
        if "401" in err or "invalid_api_key" in err.lower() or "authentication" in err.lower():
            return False, "❌ Invalid Groq API key — check it at https://console.groq.com"
        return False, f"❌ Groq error: {err}"


def _ollama_generate(prompt: str, config: dict) -> Generator[str, None, None]:

    """
    Stream text from Ollama's /api/generate endpoint.
    Each response line is a JSON object with a 'response' field.
    """
    endpoint = config.get("ollama_endpoint", "http://localhost:11434")
    model = config.get("ollama_model", "gemma3:1b")

    payload = {
        "model": model,
        "prompt": prompt,
        "stream": True,
    }

    with requests.post(
        f"{endpoint}/api/generate",
        json=payload,
        stream=True,
        timeout=120,
    ) as resp:
        resp.raise_for_status()
        for raw_line in resp.iter_lines():
            if not raw_line:
                continue
            try:
                chunk = json.loads(raw_line)
                token = chunk.get("response", "")
                if token:
                    yield token
                if chunk.get("done"):
                    break
            except json.JSONDecodeError:
                continue


def _groq_generate(prompt: str, config: dict) -> Generator[str, None, None]:
    """
    Stream text from the Groq API using the groq SDK.
    Model: llama3-8b-8192 (fast, free-tier friendly).
    """
    try:
        from groq import Groq  # lazy import — only needed when Groq is used
    except ImportError as exc:
        raise RuntimeError(
            "The 'groq' package is not installed. Run: pip install groq"
        ) from exc

    api_key = config.get("groq_api_key", "")
    if not api_key:
        raise ValueError(
            "Groq API key not configured. Add it in ⚙️ Settings."
        )

    client = Groq(api_key=api_key)
    stream = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[{"role": "user", "content": prompt}],
        stream=True,
        max_tokens=4096,
    )

    for chunk in stream:
        delta = chunk.choices[0].delta.content
        if delta:
            yield delta

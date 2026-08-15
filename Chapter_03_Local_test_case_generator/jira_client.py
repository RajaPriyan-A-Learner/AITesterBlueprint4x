"""
jira_client.py
--------------
Fetches Jira ticket details via the Jira Cloud REST API v2.
Uses HTTP Basic Auth (email + API token). No credentials hardcoded.
"""

import requests
from requests.auth import HTTPBasicAuth


def fetch_ticket(ticket_key: str, config: dict) -> dict:
    """
    Fetch a Jira ticket's summary, description, and acceptance criteria.

    Args:
        ticket_key: e.g. "QA-102"
        config: dict from config_store.load()

    Returns:
        {
            "key": str,
            "summary": str,
            "description": str,
            "acceptance_criteria": str,   # empty string if not found
            "issue_type": str,
            "status": str,
        }

    Raises:
        ValueError: if credentials are missing or ticket not found.
        requests.HTTPError: on non-2xx responses.
    """
    base_url = config.get("jira_url", "").rstrip("/")
    email = config.get("jira_email", "")
    token = config.get("jira_token", "")

    if not all([base_url, email, token]):
        raise ValueError(
            "Jira credentials are incomplete. "
            "Please fill in Jira URL, Email, and API Token in ⚙️ Settings."
        )

    url = f"{base_url}/rest/api/2/issue/{ticket_key}"
    auth = HTTPBasicAuth(email, token)
    headers = {"Accept": "application/json"}

    response = requests.get(url, auth=auth, headers=headers, timeout=15)

    if response.status_code == 404:
        raise ValueError(f"Ticket **{ticket_key}** not found in Jira. Check the ticket key and Jira URL.")
    if response.status_code == 401:
        raise ValueError("Authentication failed. Check your Jira Email and API Token in ⚙️ Settings.")

    response.raise_for_status()
    data = response.json()
    fields = data.get("fields", {})

    summary = fields.get("summary", "No summary available")
    description = _extract_text(fields.get("description", ""))

    # Acceptance criteria is often stored in a custom field — try common field names
    acceptance_criteria = ""
    for field_key in ["customfield_10016", "customfield_10014", "customfield_10001"]:
        raw = fields.get(field_key)
        if raw:
            acceptance_criteria = _extract_text(raw)
            break

    return {
        "key": ticket_key,
        "summary": summary,
        "description": description,
        "acceptance_criteria": acceptance_criteria,
        "issue_type": fields.get("issuetype", {}).get("name", "Unknown"),
        "status": fields.get("status", {}).get("name", "Unknown"),
    }


def test_connection(config: dict) -> tuple[bool, str]:
    """
    Quick connectivity test — tries to reach the Jira /myself endpoint.
    Returns (success: bool, message: str).
    """
    base_url = config.get("jira_url", "").rstrip("/")
    email = config.get("jira_email", "")
    token = config.get("jira_token", "")

    if not all([base_url, email, token]):
        return False, "Credentials not set. Fill in Jira URL, Email, and API Token."

    try:
        url = f"{base_url}/rest/api/2/myself"
        response = requests.get(
            url,
            auth=HTTPBasicAuth(email, token),
            headers={"Accept": "application/json"},
            timeout=10,
        )
        if response.status_code == 200:
            display_name = response.json().get("displayName", "Unknown User")
            return True, f"✅ Connected as **{display_name}**"
        elif response.status_code == 401:
            return False, "❌ Authentication failed — wrong email or API token."
        else:
            return False, f"❌ Unexpected response: HTTP {response.status_code}"
    except requests.ConnectionError:
        return False, f"❌ Cannot reach `{base_url}`. Check the Jira URL."
    except requests.Timeout:
        return False, "❌ Connection timed out."


def _extract_text(value) -> str:
    """
    Safely extract plain text from a Jira field value.
    Handles: plain strings, Atlassian Document Format (ADF) dicts, and None.
    """
    if value is None:
        return ""
    if isinstance(value, str):
        return value.strip()
    if isinstance(value, dict):
        # ADF format — walk the content tree
        return _walk_adf(value).strip()
    return str(value).strip()


def _walk_adf(node: dict) -> str:
    """Recursively extract plain text from an ADF node."""
    if node.get("type") == "text":
        return node.get("text", "")
    parts = []
    for child in node.get("content", []):
        parts.append(_walk_adf(child))
    separator = "\n" if node.get("type") in ("paragraph", "heading", "bulletList", "listItem") else ""
    return separator.join(parts)

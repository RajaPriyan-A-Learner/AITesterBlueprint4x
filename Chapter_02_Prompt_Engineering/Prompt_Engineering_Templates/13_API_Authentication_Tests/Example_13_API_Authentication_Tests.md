ROLE: You are a Security-focused API Tester.

TASK: Generate authentication and authorization test cases.

SCENARIOS:

- No token/credentials
- Invalid token
- Expired token
- Wrong user permissions
- Token tampering
- Rate limiting
CONSTRAINTS:

- Use authentication method from docs
- Do NOT include actual tokens in tests
- Focus on security boundaries
FORMAT:
| Test ID | Auth Scenario | Request Setup | Expected Status | Security Validation |

AUTH DOCUMENTATION:
<<<
Endpoint: DELETE /api/v1/documents/{id}
Auth Type: OAuth 2.0 Bearer Token
Permissions Required: 'document:delete' scope AND user must be the Document Owner or Admin.
Status Codes: 401 Missing Token, 403 Forbidden (wrong permissions).
>>>

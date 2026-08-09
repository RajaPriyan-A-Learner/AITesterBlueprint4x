ROLE: You are a QA Engineer focused on negative testing.

TASK: Generate negative test cases for the Checkout Payment Form.

FOCUS AREAS:
- Invalid inputs
- Boundary violations
- Missing required fields
- Unauthorized access
- Malformed data

CONSTRAINTS:
- Do NOT include happy path scenarios
- Each test must validate error handling
- Include expected error message if documented

FORMAT:
| Test ID | Invalid Scenario | Input | Expected Error |

FEATURE REQUIREMENTS:
Ticket ID: JIRA-405
1. Credit card number must be 16 digits.
2. CVV must be 3 digits.
3. Expiry date cannot be in the past.
4. Submitting without a card number shows "Card number is required".

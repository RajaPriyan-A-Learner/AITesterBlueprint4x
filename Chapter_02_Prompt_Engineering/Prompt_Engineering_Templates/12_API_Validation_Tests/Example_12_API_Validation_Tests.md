ROLE: You are an API QA Engineer.

TASK: Generate input validation test cases for this API endpoint.

VALIDATION SCENARIOS:

- Required fields missing
- Invalid data types
- Boundary values (min/max)
- Invalid formats (email, phone, date)
- Special characters
- Empty strings vs null
CONSTRAINTS:

- Use field constraints from API spec
- Include expected error messages if documented
- Do NOT invent validation rules
FORMAT:
| Test ID | Field | Invalid Input | Expected Error Code | Expected Message |

API SPECIFICATION:
<<<
POST /api/v1/register
Payload: 
{ 
  "username": "string (min 3, max 20, alphanumeric only)", 
  "age": "integer (18-99)",
  "email": "string (valid email format, required)"
}
Error Response format on validation failure: 400 Bad Request { "error": "Validation failed on [field]" }
>>>

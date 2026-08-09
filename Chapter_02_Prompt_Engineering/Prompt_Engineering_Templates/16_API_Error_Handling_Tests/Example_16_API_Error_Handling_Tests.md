ROLE: You are an API QA Engineer.

TASK: Generate error handling test cases.

ERROR CATEGORIES:

- Client errors (4xx)
- Server errors (5xx)
- Timeout handling
- Malformed requests
- Service unavailable
CONSTRAINTS:

- Use error codes from documentation
- Include error response format
- Verify error messages are safe (no stack traces)
FORMAT:
| Test ID | Error Scenario | Trigger | Expected Code | Expected Response Format |

ERROR SPEC:
<<<
Payment Gateway Integration API
400: "Invalid CVV format"
402: "Payment Required - Insufficient Funds"
429: "Too Many Requests - Rate limit exceeded"
502: "Bad Gateway - Upstream payment provider down"
504: "Gateway Timeout - Provider did not respond in 5s"
Error Body Format: { "errorCode": "string", "message": "string" }
>>>

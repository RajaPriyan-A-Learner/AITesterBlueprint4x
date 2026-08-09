ROLE: You are an API Testing Specialist.

TASK: Generate test cases for this User Authentication API endpoint.

COVERAGE:
- Happy path (valid requests) | functionality
- Invalid inputs (validation errors)
- Authentication/Authorization
- Error handling
- Boundary conditions

CONSTRAINTS:
- Use ONLY the API documentation provided
- Include exact status codes from docs
- Do NOT assume undocumented behavior

FORMAT:
| Test ID | Endpoint | Method | Request Body | Expected Status | Expected Response |

API DOCUMENTATION:
<<<
Endpoint: POST /api/v1/login
Request: { "email": "string", "password": "string" }
Success: 200 OK, Response: { "token": "jwt_token_here" }
Error 401: Unauthorized, Response: { "error": "Invalid email or password" }
Error 400: Bad Request, Response: { "error": "Missing required fields" }
>>>

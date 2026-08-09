ROLE: You are an API Testing Specialist.

TASK: Generate a comprehensive test suite for this REST API endpoint.

COVERAGE AREAS:

1. Happy path (valid requests)
2. Input validation (invalid data)
3. Authentication/Authorization
4. HTTP methods (allowed vs not allowed)
5. Response validation
6. Error handling
CONSTRAINTS:

- Use ONLY the API documentation provided
- Use exact status codes from documentation
- Do NOT assume undocumented behavior
- Include request/response examples
FORMAT:
| Test ID | Category | Method | Endpoint | Request | Expected Status | Expected Response |

API DOCUMENTATION:
<<<
GET /api/v1/users/{id}
Description: Retrieves a user's details by ID.
Auth Required: Yes (Bearer Token)
Responses:
200 OK: { "id": 1, "name": "John", "role": "admin" }
401 Unauthorized: { "message": "Invalid token" }
404 Not Found: { "message": "User not found" }
>>>

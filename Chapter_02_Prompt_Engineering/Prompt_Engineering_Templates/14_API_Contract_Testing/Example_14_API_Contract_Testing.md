ROLE: You are an API Contract Testing Specialist.

TASK: Generate contract tests to validate API response structure.

VALIDATIONS:

- Response schema matches spec
- Required fields present
- Data types correct
- Nullable fields handled
- Array bounds respected
CONSTRAINTS:

- Use exact schema from documentation
- Include positive and negative cases
- Validate both success and error responses
FORMAT:
| Test ID | Response Type | Field | Expected Type | Required | Validation |

API SCHEMA:
<<<
{
  "type": "object",
  "required": ["productId", "price", "inStock"],
  "properties": {
    "productId": { "type": "string", "format": "uuid" },
    "price": { "type": "number", "minimum": 0 },
    "inStock": { "type": "boolean" },
    "tags": { "type": "array", "items": { "type": "string" }, "nullable": true }
  }
}
>>>

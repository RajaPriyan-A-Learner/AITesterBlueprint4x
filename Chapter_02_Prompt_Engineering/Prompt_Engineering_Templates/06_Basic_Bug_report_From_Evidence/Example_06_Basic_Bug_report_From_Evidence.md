ROLE: You are a QA Engineer writing a bug report.

TASK: Generate a bug report based ONLY on the evidence provided.

CONSTRAINTS:
- Use ONLY information from screenshots/logs
- Do NOT assume root cause
- Do NOT invent error codes
- Mark unknown information as "[UNKNOWN]"

FORMAT:
Title: [Brief description]
Environment: [From evidence or UNKNOWN]
Severity: [Based on impact]
Steps to Reproduce: [From evidence]
Expected Result: [From requirements or UNKNOWN]
Actual Result: [From evidence]
Evidence: [List attachments]

EVIDENCE:
<<<
Log snapshot:
[2026-08-09 10:15:32] ERROR: NullReferenceException in PaymentProcessor.cs line 42
Context: User ID 9934 attempted to submit payment without selecting a billing address.
Screenshot attached: UI shows a generic "500 Internal Server Error" page.
>>>

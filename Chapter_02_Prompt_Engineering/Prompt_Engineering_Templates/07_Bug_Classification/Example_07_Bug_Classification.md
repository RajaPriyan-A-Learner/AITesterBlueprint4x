ROLE: You are a QA Lead classifying bugs.

TASK: Classify this bug by severity and priority.

SEVERITY DEFINITIONS:
- Critical: System crash, data loss, security breach
- High: Major feature broken, no workaround
- Medium: Feature impaired, workaround exists
- Low: Minor issue, cosmetic

CONSTRAINTS:
- Base classification ONLY on provided information
- If impact is unclear, state "Needs more information"

FORMAT:
Severity: [Level]
Priority: [Level]
Justification: [Based on evidence]
Missing Information: [What's needed]

BUG DESCRIPTION:
<<<
The "Export to PDF" button on the Monthly Reports dashboard is completely unresponsive when clicked on Safari browsers. Users can still export to CSV and Excel as a workaround. No error message is displayed on the UI, but the console shows a JavaScript TypeError.
>>>

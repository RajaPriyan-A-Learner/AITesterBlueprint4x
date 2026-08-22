# Resume Tailoring Batch Execution Plan

This plan outlines the approach to process the 25 job descriptions from `linkedin_jobs_test_engineer_page1.csv` against your master resume (`Rajapriyan_Subramaniyan_Resume_v2.docx`), strictly following the `resume-tailor` skill rules.

## User Review Required

> [!WARNING]
> **Honesty Gate Rule**: The `resume-tailor` skill strictly forbids fabricating experience to match job descriptions. I have done a preliminary analysis of the first few jobs against your master resume (Lead SDET, 8+ years, C#/.NET, SpecFlow, Selenium, Playwright, AI-Augmented Testing):

### 1. Hard Gaps (Recommend Skipping)
- **AMD (System Testing & Automation Engineer)**: Requires deep networking testing, Linux kernel, C/Python, VMware. *Your background is C#/Web/API automation.*
- *Action*: I will flag jobs with major tech-stack and domain mismatches rather than generating a fake resume.

### 2. Strong / Transferable Matches (Will Generate)
- **Woolworths Group (Senior Automation Engineer C#)**: Perfect match (C#, Selenium/Playwright, CI/CD, Agentic Engineering).
- **TEKsystems (Senior QA Engineer)**: Requires Playwright/TypeScript. You have this from your Virtusa pilot.
- **Pearson (Senior QA Engineer)**: Requires Java/Cucumber. You have C#/SpecFlow. I will tailor the resume but highlight the C# equivalent honestly.
- **Pine Labs (SDET III)**: Requires Fintech/UPI and Mobile. You have CBA Banking and Appium experience. 

## Open Questions

> [!IMPORTANT]
> 1. Do you want me to generate tailored resumes for **all 25 jobs**, or should I only generate them for the jobs that **strongly pass the Honesty Gate** (skipping the Hard Gaps like AMD)? 
> 2. Generating 25 distinct Node.js scripts and docx files in one go might take time. Are you comfortable with me batching the best 5-10 matches first?

## Proposed Changes

### Resume Generation Workflow
- **[NEW]** `Chapter_04_AIJobKit/output/` directory to store all tailored resumes.
- **[NEW]** A batch Node.js generation script (`batch_build_resumes.js`) adapted from the skill's `build_resume.js`.
- **[NEW]** Individual `Resume_<Company>_<RoleShort>.docx` files for each passing job description, featuring the required yellow highlights for all tailored content.

## Verification Plan

### Automated Tests
- N/A

### Manual Verification
- Review the generated `.docx` files in Google Docs to ensure formatting and highlighting are intact.
- Verify the Honesty Gate report to ensure no fabricated skills were added.

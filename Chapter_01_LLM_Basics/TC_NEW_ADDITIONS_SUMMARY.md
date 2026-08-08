# VWO Login Dashboard - NEW TEST CASES ADDED
**Date**: 2026-08-08  
**Status**: Based on Provided Missing Information  
**Total New Tests**: 43

---

## NEW TESTS BY CATEGORY

### 1. AUTHENTICATION SYSTEM - Enhanced Error Messages (TC001)

**New Tests Added**: 2

| ID | Test Case | Steps | Expected Result | Reason Added |
|---|---|---|---|---|
| TC001.7 | Wrong email on login | 1. Enter non-existent email<br>2. Enter any password<br>3. Click Login | Error message: "No email found" | **NEW**: Specific error message provided |
| TC001.8 | Wrong password on login | 1. Enter correct email<br>2. Enter incorrect password<br>3. Click Login | Error message: "Password is incorrect or template is incorrect" | **NEW**: Specific error message provided |

---

### 2. USER INPUT VALIDATION - Password Complexity Rules (TC002)

**New Tests Added**: 9

| ID | Test Case | Steps | Expected Result | Reason Added |
|---|---|---|---|---|
| TC002.6 | Password minimum 8 characters | 1. Enter "MyPa12" (7 chars)<br>2. Trigger blur event | Error: minimum 8 characters required | **NEW**: Min length = 8 chars specified |
| TC002.7 | Password uppercase requirement | 1. Enter "mypass123"<br>2. Trigger blur event | Error: requires at least 1 uppercase letter | **NEW**: 1 uppercase required |
| TC002.8 | Password lowercase requirement | 1. Enter "MYPASS123"<br>2. Trigger blur event | Error: requires at least 2 lowercase letters | **NEW**: 2 lowercase required |
| TC002.9 | Password number requirement | 1. Enter "MyPassword@"<br>2. Trigger blur event | Error: requires at least 3 numbers | **NEW**: 3 numbers required |
| TC002.10 | Password special char validation - allowed | 1. Enter "MyPass123-@*!"<br>2. Trigger blur event | Password accepted (comma, hyphen, @, *, ! allowed) | **NEW**: Allowed chars = comma, hyphen, @, *, ! |
| TC002.11 | Password special char validation - not allowed | 1. Enter "MyPass123#"<br>2. Trigger blur event | Error: invalid special character (only comma, hyphen, @, *, ! allowed) | **NEW**: Specific allowed chars rule |
| TC002.12 | Password strength WEAK indicator | 1. Enter "MyPass1"<br>2. Observe strength indicator | Indicator shows WEAK | **NEW**: Strength indicator behavior |
| TC002.13 | Password strength MEDIUM indicator | 1. Enter "MyPassword123"<br>2. Observe strength indicator | Indicator shows MEDIUM (meets all requirements) | **NEW**: Strength indicator behavior |
| TC002.14 | Password strength STRONG indicator | 1. Enter "MyP@ss*123"<br>2. Observe strength indicator | Indicator shows STRONG (exceeds requirements) | **NEW**: Strength indicator behavior |

---

### 3. PASSWORD MANAGEMENT - Recovery Validation (TC003)

**New Tests Added**: 2

| ID | Test Case | Steps | Expected Result | Reason Added |
|---|---|---|---|---|
| TC003.7 | Password reset with weak password | 1. Enter "MyPass1" (too short)<br>2. Submit reset form | Error: minimum 8 characters required | **NEW**: Complexity validation on reset |
| TC003.8 | Password reset special char validation | 1. Enter "MyPass123#"<br>2. Submit reset form | Error: invalid special character (only comma, hyphen, @, *, ! allowed) | **NEW**: Special char validation on reset |

---

### 4. SESSION & REMEMBER ME - Timeout Edge Cases (TC004)

**New Tests Added**: 2

| ID | Test Case | Steps | Expected Result | Reason Added |
|---|---|---|---|---|
| TC004.5_ALT | Session timeout edge case - 4:59 | 1. Login successfully<br>2. Leave session idle for 4 minutes 59 seconds<br>3. Attempt action | Action succeeds, session still valid | **NEW**: Timeout = 5 minutes (boundary test) |
| TC004.6_ALT | Session timeout edge case - 5:01 | 1. Login successfully<br>2. Leave session idle for 5 minutes 1 second<br>3. Attempt action | Session expired, redirect to login page | **NEW**: Timeout = 5 minutes (boundary test) |

**Modified**: TC004.4 now specifies "5 minutes" instead of "configurable timeout period"

---

### 5. MULTI-FACTOR AUTHENTICATION - Method Specifics (TC005)

**New Tests Added**: 4

| ID | Test Case | Steps | Expected Result | Reason Added |
|---|---|---|---|---|
| TC005.6 | 2FA via SMS | 1. Choose SMS method<br>2. Receive SMS code<br>3. Enter code | Login completes after SMS verification | **NEW**: SMS 2FA method specified |
| TC005.7 | 2FA via Email | 1. Choose Email method<br>2. Receive email code<br>3. Enter code | Login completes after email verification | **NEW**: Email 2FA method specified |
| TC005.8 | 2FA via Authenticator App | 1. Choose Authenticator method<br>2. Enter TOTP code<br>3. Submit | Login completes after TOTP validation | **NEW**: Authenticator app 2FA specified |
| TC005.9 | 2FA via Security Questions | 1. Choose Security Questions method<br>2. Answer configured questions<br>3. Submit | Login completes after correct answers | **NEW**: Security questions 2FA specified |

**Modified**: TC005.1 updated to show 4 method options in 2FA challenge page

---

### 6. SSO INTEGRATION - Social Login Providers (TC006.5 - NEW SECTION)

**New Tests Added**: 10

| ID | Test Case | Steps | Expected Result | Reason Added |
|---|---|---|---|---|
| TC006.5.1 | Social login providers available | 1. Check for social login buttons | All 7 providers visible: Google, LinkedIn, Facebook, Apple, Twitter, Microsoft, Yahoo | **NEW**: 7 social providers specified |
| TC006.5.2 | Google login flow | 1. Click "Login with Google"<br>2. Authenticate with Google<br>3. Authorize VWO | User logged in, redirect to dashboard | **NEW**: OAuth 2.0 provider - Google |
| TC006.5.3 | LinkedIn login flow | 1. Click "Login with LinkedIn"<br>2. Authenticate with LinkedIn<br>3. Authorize VWO | User logged in, redirect to dashboard | **NEW**: OAuth 2.0 provider - LinkedIn |
| TC006.5.4 | Facebook login flow | 1. Click "Login with Facebook"<br>2. Authenticate with Facebook<br>3. Authorize VWO | User logged in, redirect to dashboard | **NEW**: OAuth 2.0 provider - Facebook |
| TC006.5.5 | Apple login flow | 1. Click "Login with Apple"<br>2. Authenticate with Apple<br>3. Authorize VWO | User logged in, redirect to dashboard | **NEW**: OAuth 2.0 provider - Apple |
| TC006.5.6 | Twitter login flow | 1. Click "Login with Twitter"<br>2. Authenticate with Twitter<br>3. Authorize VWO | User logged in, redirect to dashboard | **NEW**: OAuth 2.0 provider - Twitter |
| TC006.5.7 | Microsoft login flow | 1. Click "Login with Microsoft"<br>2. Authenticate with Microsoft<br>3. Authorize VWO | User logged in, redirect to dashboard | **NEW**: OAuth 2.0 provider - Microsoft |
| TC006.5.8 | Yahoo login flow | 1. Click "Login with Yahoo"<br>2. Authenticate with Yahoo<br>3. Authorize VWO | User logged in, redirect to dashboard | **NEW**: OAuth 2.0 provider - Yahoo |
| TC006.5.9 | Social login failure handling | 1. Attempt social login<br>2. Provider returns error | Error message displayed, option to retry or fallback to email/password | **NEW**: OAuth error handling |
| TC006.5.10 | Social login account linking | 1. Login via social provider for first time | Account created or linking workflow presented | **NEW**: First-time OAuth user flow |

---

### 7. SECURITY - Rate Limiting Specifics (TC010)

**Modified + New**: 4 tests updated/added

| ID | Test Case | Steps | Expected Result | Reason Added |
|---|---|---|---|---|
| TC010.1 | Rate limiting engagement - 3 attempts per 10 min | 1. Submit login 3 times with invalid password within 10 min<br>2. Attempt 4th submission within 10 min | Rate limit triggered, error message displayed | **UPDATED**: 3 attempts per 10 minutes specified |
| TC010.2 | Rate limit blocking active | 1. After 3 failed attempts<br>2. Attempt login within 10 minute window | Error: "Too many login attempts. Try again after 10 minutes" | **UPDATED**: Specific error message + timeout window |
| TC010.3 | Rate limit timing reset - 10 minutes | 1. Make 3 failed attempts<br>2. Wait 10 minutes<br>3. Attempt login again | Login allowed after 10-minute window expires | **UPDATED**: 10-minute window specified |
| TC010.6_NEW | Rate limit edge case - 3 success then 1 fail | 1. Make 3 successful logins<br>2. Make 1 failed attempt<br>3. Make 1 more attempt | Only failed attempt counts toward limit; should allow 2 more before lockout | **NEW**: Boundary test - successful logins don't count |

---

### 8. ACCESSIBILITY - WCAG Color Contrast Standards (TC013)

**New Tests Added**: 3

| ID | Test Case | Steps | Expected Result | Reason Added |
|---|---|---|---|---|
| TC013.5 | Color contrast - text on background | 1. Use color contrast checker tool<br>2. Measure text and background contrast | Contrast ratio per WCAG standard (4.5:1 for normal text, 3:1 for large text) | **NEW**: WCAG contrast ratio = 4.5:1 / 3:1 |
| TC013.6 | Color contrast - links | 1. Measure link color contrast<br>2. Check against background | Link contrast ratio meets standard (3:1 minimum) | **NEW**: Links = 3:1 minimum contrast |
| TC013.7 | Color contrast - error messages | 1. Measure error message color contrast<br>2. Check if text-only or icon+text | Error messages meet contrast standards | **NEW**: Error messages must meet standards |

---

### 9. ERROR MESSAGES - Specific Text Validation (TC023 - NEW SECTION)

**New Tests Added**: 10

| ID | Test Case | Steps | Expected Result | Reason Added |
|---|---|---|---|---|
| TC023.1 | Empty email error message text | 1. Leave email empty<br>2. Trigger validation | Exact error: "Email is required" | **NEW**: Specific error text provided |
| TC023.2 | Empty password error message text | 1. Leave password empty<br>2. Trigger validation | Exact error: "Password is required" | **NEW**: Specific error text provided |
| TC023.3 | Wrong email error message text | 1. Enter non-existent email<br>2. Submit login | Exact error: "No email found" | **NEW**: Specific error text provided |
| TC023.4 | Wrong password error message text | 1. Enter correct email<br>2. Enter incorrect password<br>3. Submit login | Exact error: "Password is incorrect or template is incorrect" | **NEW**: Specific error text provided |
| TC023.5 | Rate limit error message text | After 3 failed attempts | Exact error: "Too many login attempts. Try again after 10 minutes" | **NEW**: Rate limit error text provided |
| TC023.6 | Password requirement error - uppercase | 1. Enter "mypass123"<br>2. Trigger validation | Error includes: "at least 1 uppercase letter" | **NEW**: Password error text validation |
| TC023.7 | Password requirement error - lowercase | 1. Enter "MYPASS123"<br>2. Trigger validation | Error includes: "at least 2 lowercase letters" | **NEW**: Password error text validation |
| TC023.8 | Password requirement error - numbers | 1. Enter "MyPassword"<br>2. Trigger validation | Error includes: "at least 3 numbers" | **NEW**: Password error text validation |
| TC023.9 | Password length error message | 1. Enter "MyPa12"<br>2. Trigger validation | Error includes: "minimum 8 characters" | **NEW**: Password error text validation |
| TC023.10 | Invalid special character error | 1. Enter "MyPass123#"<br>2. Trigger validation | Error includes: "only comma, hyphen, @, *, ! allowed" | **NEW**: Special char error text validation |

---

## SUMMARY OF CHANGES

### New Test Sections Created
- **TC006.5**: Social Login Providers (10 tests)
- **TC023**: Error Messages - Specific Text Validation (10 tests)

### Test Cases Enhanced
- **TC001**: +2 tests (error messages)
- **TC002**: +9 tests (password complexity)
- **TC003**: +2 tests (reset validation)
- **TC004**: +2 tests (timeout edge cases)
- **TC005**: +4 tests (2FA methods)
- **TC010**: +4 tests (rate limiting specifics)
- **TC013**: +3 tests (color contrast)

### Information Embedded
✓ Password: 8 chars min, 1 upper, 2 lower, 3 numbers, allowed special chars (comma, hyphen, @, *, !)  
✓ Rate Limit: 3 attempts per 10 minutes  
✓ Session Timeout: 5 minutes  
✓ 2FA Methods: SMS, Email, Authenticator App, Security Questions  
✓ OAuth 2.0 SSO: Implemented  
✓ Social Providers: Google, LinkedIn, Facebook, Apple, Twitter, Microsoft, Yahoo  
✓ WCAG Contrast: 4.5:1 normal text, 3:1 large text/links  
✓ Specific Error Messages: All 5 provided messages tested  

---

## WHAT REMAINED UNCHANGED

- **TC007-TC009**: User Experience, Branding & Theme (16 tests)
- **TC011**: Compliance - GDPR & CCPA (5 tests)
- **TC012**: Accessibility - Screen Reader & Keyboard (6 tests)
- **TC014-TC015**: Performance - Load Time & Concurrent Users (9 tests)
- **TC016**: Error Handling & Recovery (5 tests)
- **TC017**: Integration - VWO Core Platform (5 tests)
- **TC018-TC022**: Onboarding, Returning User, Edge Cases, Cross-Browser, Announcements (20+ tests)

Total Original Tests Preserved: ~140 tests

---

## REVIEW CHECKLIST FOR NEW TESTS

- [ ] Password complexity rules match implementation
- [ ] Rate limiting behavior (3 attempts / 10 minutes) confirmed
- [ ] Session timeout (5 minutes) verified
- [ ] All error messages text exact match
- [ ] 2FA methods (4 types) all implemented
- [ ] Social login providers (7 total) all available
- [ ] OAuth 2.0 redirect flows work correctly
- [ ] WCAG color contrast standards achievable
- [ ] Edge cases for timeout behavior tested


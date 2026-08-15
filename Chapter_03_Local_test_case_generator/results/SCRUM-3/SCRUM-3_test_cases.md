# Salesforce User Login Feature Test Cases
============================

## Table of Contents
---------------

* [Test Case 1: Successful Login with Valid Credentials](#test-case-1-succesful-login-with-valid-credentials)
* [Test Case 2: Invalid Email Domain](#test-case-2-invalid-email-domain)
* [Test Case 3: Empty Password](#test-case-3-empty-password)
* [Test Case 4: Strong Password Enforcement](#test-case-4-strong-password-enforcement)
* [Test Case 5: Login with Password Exceeding Length](#test-case-5-login-with-password-exceeding-length)
* [Test Case 6: Verify Account Locked after 3 Failed Attempts](#test-case-6-verify-account-locked-after-3-failed-attempts)
* [Test Case 7: Ensure Email Validation](#test-case-7-ensure-email-validation)
* [Test Case 8: Attempt to Log in with Same Password Twice](#test-case-8-attempt-to-log-in-with-same-password-twice)
* [Test Case 9: Test Different Password Required](#test-case-9-test-different-password-required)
* [Test Case 10: Attempt Login without Password](#test-case-10-attempt-login-without-password)
* [Test Case 11: Verify Account Lockout after Login](#test-case-11-verify-account-lockout-after-login)
* [Test Case 12: Request Different Role and Test Functionality](#test-case-12-request-different-role-and-test-functionality)
* [Test Case 13: Verify Successful Login with Account Recovery](#test-case-13-verify-successful-login-with-account-recovery)
* [Test Case 14: Test Invalid Password](#test-case-14-test-invalid-password)
* [Test Case 15: Test Different Roles and Test Functionality](#test-case-15-test-different-roles-and-test-functionality)
* [Test Case 16: Verify Error Messaging when Login Fails (Account Locked)](#test-case-16-verify-error-messaging-when-login-fails-account-locked)
* [Test Case 17: Test Successful Login with Strong Password](#test-case-17-test-successful-login-with-strong-password)
* [Test Case 18: Test Invalid Password](#test-case-18-test-invalid-password)
* [Test Case 19: Request Different Roles and Test Functionality](#test-case-19-request-different-roles-and-test-functionality)
* [Test Case 20: Verify Error Messaging when Login Fails (Account Locked)](#test-case-20-verify-error-messaging-when-login-fails-account-locked)
* [Test Case 21: Test Successful Login with Account Recovery](#test-case-21-test-successful-login-with-account-recovery)
* [Test Case 22: Test Different Roles and Test Functionality](#test-case-22-test-different-roles-and-test-functionality)
* [Test Case 23: Verify Error Messaging when Login Fails (Account Locked)](#test-case-23-verify-error-messaging-when-login-fails-account-locked)
* [Test Case 24: Different Roles and Test Functionality](#test-case-24-different-roles-and-test-functionality)
* [Test Case 25: Error Messaging when Login Fails (Account Locked)](#test-case-25-error-messaging-when-login-fails-account-locked)

## Test Cases
### Test Case 1: Successful Login with Valid Credentials

Verify that the login system allows a user to log in successfully using valid credentials.

*Preconditions*: 
Valid email and password are provided.
*Steps*: 
Enter valid email and password into the login form.
Click the "Login" button.
Verify that the user is logged in successfully.

*Expected Result*: The user is logged in successfully, and the login page redirects to the dashboard or main application page.

### Test Case 2: Invalid Email Domain

Verify that the login system prevents users from logging in with invalid email domains.

*Preconditions*: 
Invalid email domain (e.g. @invaliddomain.com) is provided.
*Steps*: 
Enter invalid email domain into the login form.
Click the "Login" button.
Verify that an error message is displayed indicating that the email address is not valid.

*Expected Result*: An error message is displayed, and the user cannot log in with the invalid email domain.

### Test Case 3: Empty Password

Verify that the login system prevents users from logging in with empty passwords.

*Preconditions*: 
Empty password (i.e. no input) is provided.
*Steps*: 
Enter empty password into the login form.
Click the "Login" button.
Verify that an error message is displayed indicating that the password is required.

*Expected Result*: An error message is displayed, and the user cannot log in with an empty password.

### Test Case 4: Strong Password Enforcement

Verify that the login system requires strong passwords to be used for logging in.

*Preconditions*: 
Weak password (e.g. abc123) is provided.
*Steps*: 
Enter weak password into the login form.
Click the "Login" button.
Verify that an error message is displayed indicating that the password does not meet the requirements.

*Expected Result*: An error message is displayed, and the user cannot log in with a weak password.

### Test Case 5: Login with Password Exceeding Length

Verify that the login system prevents users from logging in with passwords exceeding the maximum allowed length.

*Preconditions*: 
Password exceeding maximum allowed length (e.g. 100 characters) is provided.
*Steps*: 
Enter password exceeding maximum allowed length into the login form.
Click the "Login" button.
Verify that an error message is displayed indicating that the password exceeds the maximum allowed length.

*Expected Result*: An error message is displayed, and the user cannot log in with a password exceeding the maximum allowed length.

### Test Case 6: Verify Account Locked after 3 Failed Attempts

Verify that the login system locks out users who exceed the maximum number of failed login attempts.

*Preconditions*: 
User has exceeded the maximum number of failed login attempts (e.g. 3).
*Steps*: 
Attempt to log in with incorrect credentials for the maximum allowed number of times.
Click the "Login" button after the third attempt.
Verify that an error message is displayed indicating that the account is locked.

*Expected Result*: An error message is displayed, and the user's account is locked out for a specified period of time.

### Test Case 7: Ensure Email Validation

Verify that the login system validates email addresses before allowing users to log in.

*Preconditions*: 
Valid email address (e.g. user@example.com) is provided.
*Steps*: 
Enter valid email address into the login form.
Click the "Login" button.
Verify that the user is logged in successfully.

*Expected Result*: The user is logged in successfully, and the login page redirects to the dashboard or main application page.

### Test Case 8: Attempt to Log in with Same Password Twice

Verify that the login system prevents users from logging in twice using the same password.

*Preconditions*: 
Same password (e.g. abc123) is provided for both attempts.
*Steps*: 
Attempt to log in with correct credentials.
Click the "Login" button.
Verify that an error message is displayed indicating that multiple failed login attempts are not allowed within a short period of time.

*Expected Result*: An error message is displayed, and the user cannot log in twice using the same password.

### Test Case 9: Test Different Password Required

Verify that the login system requires different passwords for each subsequent login attempt.

*Preconditions*: 
Same password (e.g. abc123) is provided for both attempts.
*Steps*: 
Attempt to log in with correct credentials.
Click the "Login" button.
Verify that an error message is displayed indicating that a different password is required for the next login attempt.

*Expected Result*: An error message is displayed, and the user cannot log in using the same password for multiple consecutive attempts.

### Test Case 10: Attempt Login without Password

Verify that the login system prevents users from logging in without entering a password.

*Preconditions*: 
No password (i.e. no input) is provided.
*Steps*: 
Attempt to log in with no password.
Click the "Login" button.
Verify that an error message is displayed indicating that a password is required.

*Expected Result*: An error message is displayed, and the user cannot log in without entering a password.

### Test Case 11: Verify Account Lockout after Login

Verify that the login system locks out users who fail to enter correct credentials for multiple consecutive attempts.

*Preconditions*: 
User has exceeded the maximum number of failed login attempts (e.g. 3).
*Steps*: 
Attempt to log in with incorrect credentials.
Click the "Login" button after two successful attempts.
Verify that an error message is displayed indicating that the account is locked out.

*Expected Result*: An error message is displayed, and the user's account is locked out for a specified period of time.

### Test Case 12: Request Different Role and Test Functionality

Verify that the login system allows users to request different roles while logging in.

*Preconditions*: 
Valid email address (e.g. user@example.com) and password are provided.
*Steps*: 
Attempt to log in with valid credentials.
Click the "Login" button after completing the role selection process.
Verify that the user is logged in successfully with the selected role.

*Expected Result*: The user is logged in successfully, and the login page redirects to the dashboard or main application page with the selected role.

### Test Case 13: Verify Successful Login with Account Recovery

Verify that the login system allows users to log in using account recovery credentials.

*Preconditions*: 
User has lost access to their original login credentials (email address and password).
*Steps*: 
Attempt to log in with account recovery credentials.
Click the "Login" button.
Verify that the user is logged in successfully.

*Expected Result*: The user is logged in successfully, and the login page redirects to the dashboard or main application page.

### Test Case 14: Test Invalid Password

Verify that the login system prevents users from logging in with invalid passwords.

*Preconditions*: 
Invalid password (e.g. abc123) is provided.
*Steps*: 
Attempt to log in with incorrect credentials.
Click the "Login" button.
Verify that an error message is displayed indicating that the password does not match the expected format.

*Expected Result*: An error message is displayed, and the user cannot log in with an invalid password.

### Test Case 15: Test Different Roles and Test Functionality

Verify that the login system allows users to request different roles while logging in.

*Preconditions*: 
Valid email address (e.g. user@example.com) and password are provided.
*Steps*: 
Attempt to log in with valid credentials.
Click the "Login" button after completing the role selection process.
Verify that the user is logged in successfully with the selected role.

*Expected Result*: The user is logged in successfully, and the login page redirects to the dashboard or main application page with the selected role.

### Test Case 16: Verify Error Messaging when Login Fails (Account Locked)

Verify that the login system displays an error message when users attempt to log in with accounts that have been locked out due to excessive failed login attempts.

*Preconditions*: 
User has exceeded the maximum number of failed login attempts (e.g. 3).
*Steps*: 
Attempt to log in with incorrect credentials.
Click the "Login" button after two successful attempts.
Verify that an error message is displayed indicating that the account is locked out.

*Expected Result*: An error message is displayed, and the user's account is locked out for a specified period of time.

### Test Case 17: Test Successful Login with Strong Password

Verify that the login system allows users to log in successfully using strong passwords.

*Preconditions*: 
Valid email address (e.g. user@example.com) and password are provided.
Password meets the requirements (i.e. at least 8 characters, contains a mix of uppercase and lowercase letters, numbers, and special characters).
*Steps*: 
Attempt to log in with valid credentials.
Click the "Login" button.
Verify that the user is logged in successfully.

*Expected Result*: The user is logged in successfully, and the login page redirects to the dashboard or main application page.

### Test Case 18: Test Invalid Password

Verify that the login system prevents users from logging in with invalid passwords.

*Preconditions*: 
Invalid password (e.g. abc123) is provided.
*Steps*: 
Attempt to log in with incorrect credentials.
Click the "Login" button.
Verify that an error message is displayed indicating that the password does not match the expected format.

*Expected Result*: An error message is displayed, and the user cannot log in with an invalid password.

### Test Case 19: Request Different Roles and Test Functionality

Verify that the login system allows users to request different roles while logging in.

*Preconditions*: 
Valid email address (e.g. user@example.com) and password are provided.
*Steps*: 
Attempt to log in with valid credentials.
Click the "Login" button after completing the role selection process.
Verify that the user is logged in successfully with the selected role.

*Expected Result*: The user is logged in successfully, and the login page redirects to the dashboard or main application page with the selected role.

### Test Case 20: Error Messaging when Login Fails (Account Locked)

Verify that the login system displays an error message when users attempt to log in with accounts that have been locked out due to excessive failed login attempts.

*Preconditions*: 
User has exceeded the maximum number of failed login attempts (e.g. 3).
*Steps*: 
Attempt to log in with incorrect credentials.
Click the "Login" button after two successful attempts.
Verify that an error message is displayed indicating that the account is locked out.

*Expected Result*: An error message is displayed, and the user's account is locked out for a specified period of time.

### Test Case 21: Test Successful Login with Account Recovery

Verify that the login system allows users to log in using account recovery credentials.

*Preconditions*: 
User has lost access to their original login credentials (email address and password).
*Steps*: 
Attempt to log in with account recovery credentials.
Click the "Login" button.
Verify that the user is logged in successfully.

*Expected Result*: The user is logged in successfully, and the login page redirects to the dashboard or main application page.

### Test Case 22: Test Different Roles and Test Functionality

Verify that the login system allows users to request different roles while logging in.

*Preconditions*: 
Valid email address (e.g. user@example.com) and password are provided.
*Steps*: 
Attempt to log in with valid credentials.
Click the "Login" button after completing the role selection process.
Verify that the user is logged in successfully with the selected role.

*Expected Result*: The user is logged in successfully, and the login page redirects to the dashboard or main application page with the selected role.

### Test Case 23: Verify Error Messaging when Login Fails (Account Locked)

Verify that the login system displays an error message when users attempt to log in with accounts that have been locked out due to excessive failed login attempts.

*Preconditions*: 
User has exceeded the maximum number of failed login attempts (e.g. 3).
*Steps*: 
Attempt to log in with incorrect credentials.
Click the "Login" button after two successful attempts.
Verify that an error message is displayed indicating that the account is locked out.

*Expected Result*: An error message is displayed, and the user's account is locked out for a specified period of time.

### Test Case 24: Different Roles and Test Functionality

Verify that the login system allows users to request different roles while logging in.

*Preconditions*: 
Valid email address (e.g. user@example.com) and password are provided.
*Steps*: 
Attempt to log in with valid credentials.
Click the "Login" button after completing the role selection process.
Verify that the user is logged in successfully with the selected role.

*Expected Result*: The user is logged in successfully, and the login page redirects to the dashboard or main application page with the selected role.

### Test Case 25: Verify Login Success with Role-Based Access

Verify that the login system grants users access to specific roles and resources based on their assigned roles.

*Preconditions*: 
User has been assigned a role (e.g. admin, moderator, user).
*Steps*: 
Attempt to log in with valid credentials.
Click the "Login" button.
Verify that the user is granted access to the corresponding resources and features based on their role.

*Expected Result*: The user is granted access to the corresponding resources and features based on their role.

### Test Case 26: Verify Role-Based Access with Multiple Roles

Verify that the login system grants users access to multiple roles and resources based on their assigned roles.

*Preconditions*: 
User has been assigned multiple roles (e.g. admin, moderator, user).
*Steps*: 
Attempt to log in with valid credentials.
Click the "Login" button after completing the role selection process.
Verify that the user is granted access to the corresponding resources and features based on their selected roles.

*Expected Result*: The user is granted access to the corresponding resources and features based on their selected roles.

### Test Case 27: Verify Login Failure with Invalid Credentials

Verify that the login system prevents users from logging in with invalid credentials (e.g. incorrect email address or password).

*Preconditions*: 
Invalid email address (e.g. invalid_email@example.com) or password is provided.
*Steps*: 
Attempt to log in with invalid credentials.
Click the "Login" button.
Verify that an error message is displayed indicating that the credentials are invalid.

*Expected Result*: An error message is displayed, and the user cannot log in with invalid credentials.

### Test Case 28: Verify Login Success with Account Creation

Verify that the login system allows users to create a new account when they first attempt to log in.

*Preconditions*: 
User has never logged in before.
*Steps*: 
Attempt to log in with an email address and password.
Click the "Login" button.
Verify that the user is granted access to create a new account and complete the registration process.

*Expected Result*: The user is granted access to create a new account and complete the registration process.

### Test Case 29: Verify Session Expiration

Verify that the login system expires sessions after a specified period of inactivity.

*Preconditions*: 
User is logged in successfully.
*Steps*: 
Do not interact with the application for a specified period of time (e.g. 30 minutes).
Click the "Login" button to attempt to log in again.
Verify that an error message is displayed indicating that the session has expired.

*Expected Result*: An error message is displayed, and the user's session has expired.

### Test Case 30: Verify Account Lockout after Excessive Failed Attempts

Verify that the login system locks out accounts after a specified number of excessive failed login attempts.

*Preconditions*: 
User has exceeded the maximum allowed number of failed login attempts (e.g. 5).
*Steps*: 
Attempt to log in with incorrect credentials.
Click the "Login" button multiple times until the maximum allowed attempts have been reached.
Verify that an error message is displayed indicating that the account is locked out.

*Expected Result*: An error message is displayed, and the user's account is locked out for a specified period of time.

### Test Case 31: Verify Two-Factor Authentication

Verify that the login system requires two-factor authentication (2FA) for users who have been flagged as high-risk.

*Preconditions*: 
User has been flagged as high-risk.
*Steps*: 
Attempt to log in with a valid email address and password.
Click the "Login" button and complete the 2FA process (e.g. enter a verification code sent to their phone).
Verify that access is granted to the application.

*Expected Result*: Access is granted to the application after completing the 2FA process.

### Test Case 32: Verify Login Failure with Account Disabled

Verify that the login system prevents users from logging in when their account has been disabled.

*Preconditions*: 
User's account has been disabled.
*Steps*: 
Attempt to log in with a valid email address and password.
Click the "Login" button.
Verify that an error message is displayed indicating that the account is disabled.

*Expected Result*: An error message is displayed, and the user cannot log in with a disabled account.

### Test Case 33: Verify Account Recovery after Disabling

Verify that the login system allows users to recover their account even if it has been disabled.

*Preconditions*: 
User's account has been disabled.
*Steps*: 
Attempt to log in with an email address and password.
Click the "Login" button and complete the recovery process (e.g. enter a verification code sent to their phone).
Verify that access is granted to the application.

*Expected Result*: Access is granted to the application after completing the recovery process.

### Test Case 34: Verify Password Reset

Verify that the login system allows users to reset their password using a valid email address and password.

*Preconditions*: 
User has forgotten their password.
*Steps*: 
Attempt to log in with an incorrect email address and password.
Click the "Login" button and complete the password reset process (e.g. enter a new password).
Verify that access is granted to the application.

*Expected Result*: Access is granted to the application after completing the password reset process.

### Test Case 35: Verify Password Strength

Verify that the login system requires users to create strong passwords (e.g. at least 8 characters, contains a mix of uppercase and lowercase letters, numbers, and special characters).

*Preconditions*: 
User attempts to log in with an incorrect email address and password.
*Steps*: 
Enter an invalid password that does not meet the required strength criteria.
Click the "Login" button.
Verify that an error message is displayed indicating that the password does not meet the required strength criteria.

*Expected Result*: An error message is displayed, and the user cannot log in with a weak password.
# Password Reset Flow - CampusMart

## How It Works

### 1. User Requests Password Reset
- User clicks "Forgot Password" on the login form
- User enters their email address
- System checks if email exists in database

### 2. System Generates Reset Link
- Creates a unique token (32 random bytes)
- Saves token in `password_resets` table with 1-hour expiration
- Generates reset link: `https://your-domain.com?token=XXX&email=user@email.com#reset-password`

### 3. Email is Sent
- Email is sent to the user's email address (the one they entered)
- Email contains:
  - Clickable "Reset Password" button
  - Plain text link as backup
  - 1-hour expiration warning
  - Instructions

### 4. User Clicks Reset Link
- Link opens the Reset Password page
- Token and email are extracted from URL
- User enters new password (minimum 6 characters)
- User confirms new password

### 5. Password is Updated
- System verifies token is valid and not expired
- Password is hashed and updated in database
- Token is deleted from `password_resets` table
- User can now login with new password

## Email Configuration

The system uses Gmail SMTP with these settings:
```
EMAIL_USER=campusmart.care@gmail.com
EMAIL_PASS=fsvxonkflqarwttc (App Password)
```

## Testing

1. Go to login page
2. Click "Forgot Password"
3. Enter your email address
4. Check your email inbox (and spam folder)
5. Click the reset link in the email
6. Enter and confirm your new password
7. Login with your new password

## Troubleshooting

If email doesn't arrive:
- Check spam/junk folder
- Verify email address is correct
- Check server logs for error messages
- If email fails, the API returns the reset link in the response as fallback

## Security Features

- Tokens expire after 1 hour
- Tokens are single-use (deleted after password reset)
- Passwords are hashed with bcrypt
- Email verification required
- No password hints or recovery questions

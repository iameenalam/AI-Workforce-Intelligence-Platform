# Email Setup Guide for Invitation System

## Quick Setup (Gmail)

### 1. Enable 2-Factor Authentication
1. Go to [Google Account Settings](https://myaccount.google.com/)
2. Click "Security" in the left sidebar
3. Enable "2-Step Verification" if not already enabled

### 2. Generate App Password
1. Go to [App Passwords](https://myaccount.google.com/apppasswords)
2. Select "Mail" and "Other (Custom name)"
3. Enter "ReeOrg Invitations" as the name
4. Click "Generate"
5. Copy the 16-character password (e.g., `abcd efgh ijkl mnop`)

### 3. Update Environment Variables
Add these to your `.env.local` file:

```bash
# Email Configuration
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=abcd efgh ijkl mnop
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# For production
# NEXT_PUBLIC_BASE_URL=https://yourdomain.com
```

### 4. Restart Your Development Server
```bash
npm run dev
```

## Alternative Email Services

### Outlook/Hotmail
```bash
EMAIL_USER=your-email@outlook.com
EMAIL_PASS=your-app-password
```

### Custom SMTP
Update `lib/emailService.js`:
```javascript
return nodemailer.createTransporter({
  host: "smtp.yourdomain.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
```

## Testing Email Configuration

### 1. Check Configuration
Visit: `http://localhost:3000/api/test-invitation`

### 2. Test Invitation
1. Go to Dashboard → Invite Employees
2. Fill out the form
3. Submit and check for success/error messages

## Troubleshooting

### Common Issues

**"Invalid login" or "Authentication failed"**
- Make sure you're using App Password, not regular password
- Verify 2FA is enabled on your Google account

**"Connection timeout"**
- Check your internet connection
- Try a different email service

**"Email not configured"**
- Verify `.env.local` file exists in project root
- Restart development server after adding variables
- Check for typos in variable names

### Without Email Configuration

The system works without email! When email isn't configured:
1. Invitations are still created in the database
2. You get manual invitation links in the response
3. Share these links directly with employees

Example manual link:
```
http://localhost:3000/accept-invitation?token=abc123...
```

## Production Setup

### Environment Variables
```bash
EMAIL_USER=noreply@yourdomain.com
EMAIL_PASS=your-production-app-password
NEXT_PUBLIC_BASE_URL=https://yourdomain.com
```

### Recommended Services
- **SendGrid**: Professional email service
- **AWS SES**: Amazon's email service
- **Mailgun**: Developer-friendly email API

### Security Notes
- Never commit `.env.local` to version control
- Use different credentials for development/production
- Consider using environment-specific email addresses
- Monitor email sending limits and quotas

## Email Template Customization

Edit `lib/emailService.js` to customize:
- Email subject line
- HTML template design
- Company branding
- Email content and messaging

The current template includes:
- Professional HTML design
- Responsive layout
- Clear call-to-action button
- Expiration notice
- Company branding

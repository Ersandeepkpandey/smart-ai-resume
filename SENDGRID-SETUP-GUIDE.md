# SendGrid Email Setup Guide

This guide will help you set up SendGrid to send emails from your Resume Maker application.

## Step 1: Create SendGrid Account

1. **Sign Up**: Go to [https://sendgrid.com/](https://sendgrid.com/) and click "Start for Free"
2. **Choose Plan**: Select the free plan (100 emails/day)
3. **Fill Details**: Enter your information and create account
4. **Verify Email**: Check your email and click the verification link

## Step 2: Get Your API Key

1. **Login** to SendGrid Dashboard
2. **Navigate** to Settings → API Keys
3. **Create API Key**:
   - Click "Create API Key"
   - Name: "Resume Maker"
   - Choose "Full Access" (or "Restricted Access" with "Mail Send" permission)
   - Click "Create & View"
4. **Copy API Key**: Copy the key (starts with `SG.`) - you won't see it again!

## Step 3: Verify Your Sender Email

1. **Go to** Settings → Sender Authentication
2. **Click** "Verify a Single Sender"
3. **Fill the form**:
   - **From Name**: Resume Maker
   - **From Email**: sandeepp1819@gmail.com
   - **Reply To**: sandeepp1819@gmail.com
   - **Company**: Your company name
   - **Address**: Your address
   - **City**: Your city
   - **Country**: Your country
4. **Click** "Create"
5. **Check Email**: Look for verification email and click the link

## Step 4: Update Environment Variables

Add these to your `.env.local` file:

```env
# SendGrid Configuration
SENDGRID_API_KEY=SG.your-actual-api-key-here
SENDGRID_FROM_EMAIL=sandeepp1819@gmail.com

# Required for all setups
# Session-based authentication (no JWT required)
NEXT_PUBLIC_APP_URL=http://localhost:3001

# Turso Database (if you have it)
TURSO_DATABASE_URL=libsql://your-database-url.turso.io
TURSO_AUTH_TOKEN=your-auth-token
```

## Step 5: Test Your Configuration

### Option 1: Use Debug Endpoint
Visit: `http://localhost:3001/api/admin/debug-sendgrid`

This will show your configuration status.

### Option 2: Send Test Email
Visit: `http://localhost:3001/api/admin/debug-sendgrid?email=your-email@example.com&send=true`

Replace `your-email@example.com` with your actual email address.

### Option 3: Test Signup
1. Go to your signup page
2. Create a new account
3. Check if verification email is received

## Step 6: Troubleshooting

### Common Issues:

#### 1. "403 Forbidden" Error
- **Cause**: Sender email not verified
- **Solution**: Complete Step 3 above

#### 2. "401 Unauthorized" Error
- **Cause**: Invalid API key
- **Solution**: Check your API key in `.env.local`

#### 3. "400 Bad Request" Error
- **Cause**: Invalid from email
- **Solution**: Make sure `SENDGRID_FROM_EMAIL` matches verified sender

#### 4. No Email Received
- **Check**: Spam folder
- **Check**: SendGrid dashboard → Activity → Email Activity
- **Check**: Console logs for errors

### Debug Steps:

1. **Check Configuration**:
   ```
   http://localhost:3001/api/admin/debug-sendgrid
   ```

2. **Check SendGrid Dashboard**:
   - Go to Activity → Email Activity
   - Look for your test emails
   - Check delivery status

3. **Check Console Logs**:
   - Look for SendGrid errors in your terminal
   - Check browser console for API errors

## Step 7: Production Setup

### For Production Deployment:

1. **Update Environment Variables**:
   ```env
   NEXT_PUBLIC_APP_URL=https://your-domain.com
   ```

2. **Domain Authentication** (Recommended):
   - Go to SendGrid → Settings → Sender Authentication
   - Click "Authenticate Your Domain"
   - Follow DNS setup instructions

3. **Monitor Email Activity**:
   - Set up SendGrid webhooks for delivery tracking
   - Monitor bounce and spam reports

## Email Templates

The system uses professional HTML email templates for:
- **Email Verification**: Welcome email with verification link
- **Test Emails**: Configuration testing

All templates are responsive and include:
- Professional styling
- Clear call-to-action buttons
- Fallback text links
- Mobile-friendly design

## Security Best Practices

1. **Never commit API keys** to version control
2. **Use environment variables** for all sensitive data
3. **Rotate API keys** regularly
4. **Monitor email activity** for suspicious patterns
5. **Set up rate limiting** to prevent abuse

## Support

If you encounter issues:

1. **Check SendGrid Status**: [https://status.sendgrid.com/](https://status.sendgrid.com/)
2. **SendGrid Documentation**: [https://docs.sendgrid.com/](https://docs.sendgrid.com/)
3. **Contact Support**: Use SendGrid's support if needed

## Next Steps

Once SendGrid is working:

1. **Test signup flow** with email verification
2. **Monitor email delivery** in SendGrid dashboard
3. **Set up additional email templates** if needed
4. **Configure webhooks** for delivery tracking
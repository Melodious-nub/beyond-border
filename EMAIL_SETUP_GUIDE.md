# Email Setup Guide for Contact Form Notifications

This guide will help you configure email notifications for your contact form using cPanel email.

## 📧 **Email Configuration**

### Step 1: Get Your cPanel Email Credentials

1. **Login to cPanel**
2. **Go to Email Accounts**
3. **Create or use existing email account**
4. **Note down the credentials:**
   - Email address: `your-email@yourdomain.com`
   - Password: `your-email-password`
   - SMTP Host: Usually `mail.yourdomain.com` or `yourdomain.com`
   - SMTP Port: Usually `587` (TLS) or `465` (SSL)

### Step 2: Update .env File

Update your `.env` file with the email configuration:

```env
# Email Configuration
EMAIL_HOST=mail.yourdomain.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@yourdomain.com
EMAIL_PASS=your-email-password
EMAIL_FROM_NAME=Beyond Border
NOTIFICATION_EMAILS=shawon.taluckder2@gmail.com
```

### Step 3: Test Email Configuration

```bash
# Start your server
npm run dev

# Test email configuration (requires admin login)
# Use the Swagger UI at http://localhost:3000/api-docs
# Or use the test endpoint with your admin token
```

## 🔧 **Common cPanel Email Settings**

### For Most cPanel Hosts:
```env
EMAIL_HOST=mail.yourdomain.com
EMAIL_PORT=587
EMAIL_SECURE=false
```

### For SSL/TLS:
```env
EMAIL_HOST=mail.yourdomain.com
EMAIL_PORT=465
EMAIL_SECURE=true
```

### For Gmail (if using Gmail SMTP):
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASS=your-app-password
```

## 📋 **Email Features**

### ✅ **What's Included:**
- **Professional HTML Email Template**: Beautiful, responsive design
- **Contact Form Details**: Name, email, message, timestamp
- **Reply-To Functionality**: Admins can reply directly to the sender
- **Multiple Recipients**: Send to multiple notification emails
- **Error Handling**: Graceful fallback if email fails
- **Test Email Function**: Verify configuration works

### 📧 **Email Template Features:**
- **Responsive Design**: Works on all devices
- **Professional Styling**: Clean, modern appearance
- **Contact Information**: All form details clearly displayed
- **Timestamp**: When the message was received
- **Reply Instructions**: How to respond to the sender
- **Branding**: Customizable with your company name

## 🚨 **Troubleshooting**

### Common Issues:

#### "Email service not configured"
- Check your `.env` file has all EMAIL_* variables
- Verify EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS are set

#### "Authentication failed"
- Verify EMAIL_USER and EMAIL_PASS are correct
- Check if your email account is active in cPanel
- Try using your full email address as EMAIL_USER

#### "Connection timeout"
- Check EMAIL_HOST and EMAIL_PORT settings
- Verify your hosting provider allows SMTP connections
- Try different ports (587, 465, 25)

#### "SSL/TLS errors"
- Set EMAIL_SECURE=true for port 465
- Set EMAIL_SECURE=false for port 587
- Check if your host requires specific SSL settings

### Testing Steps:

1. **Check .env file**:
   ```bash
   # Verify your .env file has email settings
   cat .env | grep EMAIL
   ```

2. **Test email configuration**:
   ```bash
   # Use the test endpoint in Swagger UI
   # POST /api/contact/test-email
   ```

3. **Submit test contact form**:
   ```bash
   # Submit a contact form and check if email is sent
   curl -X POST http://localhost:3000/api/contact \
     -H "Content-Type: application/json" \
     -d '{
       "name": "Test User",
       "email": "test@example.com",
       "description": "This is a test message"
     }'
   ```

## 🔄 **For Production Deployment**

### Update .env for Production:
```env
# Production Email Configuration
EMAIL_HOST=mail.yourdomain.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=noreply@yourdomain.com
EMAIL_PASS=your-secure-password
EMAIL_FROM_NAME=Your Company Name
NOTIFICATION_EMAILS=admin@yourdomain.com,support@yourdomain.com
```

### Security Tips:
- Use a dedicated email account for notifications
- Use strong passwords for email accounts
- Consider using app-specific passwords for Gmail
- Monitor email sending limits on your hosting plan

## 📊 **Email Statistics**

The system tracks:
- **Email send success/failure**
- **Contact form submissions**
- **Admin notifications sent**
- **Email configuration status**

## 🎯 **Future Enhancements**

Planned features:
- **Email Templates Management**: Admin can customize email templates
- **Notification Settings**: Admin can configure who receives notifications
- **Email Queue**: Handle high volume of contact forms
- **Email Analytics**: Track email open rates and responses
- **Auto-responders**: Send automatic replies to contact form submissions

## 📞 **Need Help?**

If you encounter issues:
1. Check the troubleshooting section above
2. Verify your cPanel email account is working
3. Test with a simple email client first
4. Contact your hosting provider for SMTP settings
5. Check server logs for detailed error messages

Your contact form email notifications are now ready! 🚀

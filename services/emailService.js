const nodemailer = require('nodemailer');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

class EmailService {
  constructor() {
    this.transporter = null;
    this.initializeTransporter();
  }

  // Initialize email transporter
  initializeTransporter() {
    try {
      // For now, we'll use a placeholder configuration
      // You'll update this with your cPanel email credentials
      this.transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST || 'localhost',
        port: parseInt(process.env.EMAIL_PORT) || 465,
        secure: process.env.EMAIL_SECURE === 'true' || true, // Default to SSL for cPanel
        auth: {
          user: process.env.EMAIL_USER || '',
          pass: process.env.EMAIL_PASS || ''
        },
        tls: {
          rejectUnauthorized: false
        }
      });

      // Verify connection configuration
      this.transporter.verify((error, success) => {
        if (error) {
          console.log('⚠️  Email service not configured:', error.message);
          console.log('📧 To enable email notifications, update EMAIL_* variables in .env');
        } else {
          console.log('✅ Email service ready');
        }
      });
    } catch (error) {
      console.log('⚠️  Email service initialization failed:', error.message);
    }
  }

  // Send contact form notification
  async sendContactNotification(contactData) {
    try {
      if (!this.transporter) {
        console.log('📧 Email service not configured, skipping notification');
        return { success: false, message: 'Email service not configured' };
      }

      const { name, email, description } = contactData;
      
      // Get notification emails from database
      const notificationEmails = await this.getNotificationEmails();
      
      if (notificationEmails.length === 0) {
        console.log('📧 No notification emails configured');
        return { success: false, message: 'No notification emails configured' };
      }

      const mailOptions = {
        from: `"${process.env.EMAIL_FROM_NAME || 'Beyond Border'}" <${process.env.EMAIL_USER}>`,
        to: notificationEmails.join(', '),
        subject: `New Contact Form Submission - ${name}`,
        html: this.generateContactEmailTemplate(contactData),
        replyTo: email
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log('📧 Contact notification sent successfully');
      
      return { 
        success: true, 
        message: 'Notification sent successfully',
        messageId: result.messageId
      };
    } catch (error) {
      console.error('📧 Failed to send contact notification:', error.message);
      return { 
        success: false, 
        message: 'Failed to send notification',
        error: error.message
      };
    }
  }

  // Generate professional email template
  generateContactEmailTemplate(contactData) {
    const { name, email, description, createdAt } = contactData;
    const currentDate = new Date().toLocaleString();
    
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Contact Form Submission</title>
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #f4f4f4;
            }
            .container {
                background-color: #ffffff;
                padding: 30px;
                border-radius: 10px;
                box-shadow: 0 0 20px rgba(0,0,0,0.1);
            }
            .header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 20px;
                border-radius: 8px;
                text-align: center;
                margin-bottom: 30px;
            }
            .header h1 {
                margin: 0;
                font-size: 24px;
                font-weight: 300;
            }
            .content {
                margin-bottom: 30px;
            }
            .field {
                margin-bottom: 20px;
                padding: 15px;
                background-color: #f8f9fa;
                border-left: 4px solid #667eea;
                border-radius: 4px;
            }
            .field-label {
                font-weight: bold;
                color: #495057;
                margin-bottom: 5px;
                text-transform: uppercase;
                font-size: 12px;
                letter-spacing: 1px;
            }
            .field-value {
                color: #212529;
                font-size: 16px;
            }
            .description {
                background-color: #e9ecef;
                padding: 20px;
                border-radius: 8px;
                border: 1px solid #dee2e6;
                white-space: pre-wrap;
                font-family: 'Courier New', monospace;
                font-size: 14px;
                line-height: 1.5;
            }
            .footer {
                text-align: center;
                padding: 20px;
                background-color: #f8f9fa;
                border-radius: 8px;
                color: #6c757d;
                font-size: 14px;
            }
            .timestamp {
                background-color: #e3f2fd;
                color: #1976d2;
                padding: 10px;
                border-radius: 4px;
                text-align: center;
                margin-top: 20px;
                font-size: 14px;
            }
            .reply-info {
                background-color: #fff3cd;
                border: 1px solid #ffeaa7;
                color: #856404;
                padding: 15px;
                border-radius: 8px;
                margin-top: 20px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>📧 New Contact Form Submission</h1>
            </div>
            
            <div class="content">
                <div class="field">
                    <div class="field-label">Name</div>
                    <div class="field-value">${name}</div>
                </div>
                
                <div class="field">
                    <div class="field-label">Email Address</div>
                    <div class="field-value">${email}</div>
                </div>
                
                <div class="field">
                    <div class="field-label">Message</div>
                    <div class="description">${description}</div>
                </div>
            </div>
            
            <div class="reply-info">
                <strong>💡 Quick Reply:</strong> You can reply directly to this email to respond to ${name}.
            </div>
            
            <div class="timestamp">
                <strong>📅 Received:</strong> ${currentDate}
            </div>
            
            <div class="footer">
                <p>This notification was sent from your Beyond Border website contact form.</p>
                <p>To manage notification settings, please contact your system administrator.</p>
            </div>
        </div>
    </body>
    </html>
    `;
  }

  // Get notification emails from database
  async getNotificationEmails() {
    try {
      const NotificationEmail = require('../models/NotificationEmail');
      const notificationEmails = await NotificationEmail.findAll();
      
      if (notificationEmails.length === 0) {
        // Use environment variable if no emails in database
        const defaultEmail = process.env.NOTIFICATION_EMAILS;
        return [defaultEmail];
      }
      
      return notificationEmails.map(email => email.email);
    } catch (error) {
      console.error('Error getting notification emails:', error);
      // Use environment variable
      const defaultEmail = process.env.NOTIFICATION_EMAILS;
      return [defaultEmail];
    }
  }

  // Test email configuration
  async testEmailConfiguration() {
    try {
      if (!this.transporter) {
        return { success: false, message: 'Email service not configured' };
      }

      const notificationEmails = await this.getNotificationEmails();
      const testEmail = notificationEmails[0];
      if (!testEmail) {
        return { success: false, message: 'No notification emails configured' };
      }

      const mailOptions = {
        from: `"${process.env.EMAIL_FROM_NAME || 'Beyond Border'}" <${process.env.EMAIL_USER}>`,
        to: testEmail,
        subject: 'Email Configuration Test - Beyond Border',
        html: `
          <h2>✅ Email Configuration Test Successful</h2>
          <p>This is a test email to verify that your email configuration is working correctly.</p>
          <p><strong>Sent at:</strong> ${new Date().toLocaleString()}</p>
          <p>If you received this email, your email service is properly configured!</p>
        `
      };

      const result = await this.transporter.sendMail(mailOptions);
      return { 
        success: true, 
        message: 'Test email sent successfully',
        messageId: result.messageId
      };
    } catch (error) {
      return { 
        success: false, 
        message: 'Failed to send test email',
        error: error.message
      };
    }
  }
}

// Create singleton instance
const emailService = new EmailService();

module.exports = emailService;

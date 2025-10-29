# cPanel SSE Deployment Guide

## 📋 Overview

This guide will help you deploy the SSE notification system to cPanel shared hosting with LiteSpeed. The system has been optimized for cPanel environments with enhanced reconnection logic and LiteSpeed-specific configurations.

## ✅ What Was Fixed

1. **Created `.htaccess`** - LiteSpeed-specific configuration to disable buffering for SSE
2. **Enhanced Backend Headers** - Added LiteSpeed-compatible headers with proper timeouts
3. **Improved Reconnection Logic** - Increased attempts to 10 with exponential backoff
4. **Added Comprehensive Logging** - Debug SSE connections in browser console

## 🚀 Deployment Steps

### Step 1: Prepare Backend for Deployment

#### Build/Prepare Backend Files
```bash
cd beyond-border

# Ensure all dependencies are installed
npm install

# Test locally first (optional but recommended)
npm run dev
```

#### Update Environment Variables
Make sure your `.env` file on cPanel has the correct production settings:
```env
# Production Database (cPanel)
DB_HOST=localhost
DB_USER=beyondb1_bbAdmin
DB_PASSWORD=2s8o~M-cdfjg?9@o
DB_NAME=beyondb1_bbDB
DB_PORT=3306

# Server Configuration
PORT=3000
NODE_ENV=production

# CORS Configuration (allow your frontend domain)
CORS_ORIGIN=https://beyond-border.org

# Email Configuration (already working)
EMAIL_HOST=mail.beyond-border.org
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=no-reply@beyond-border.org
EMAIL_PASS=@l@H7otJz5i7e-Hl
EMAIL_FROM_NAME=Beyond Border
NOTIFICATION_EMAILS=opticalfiberdoc@gmail.com
```

### Step 2: Upload Backend to cPanel

1. **Login to cPanel**
2. **Go to File Manager**
3. **Navigate to your Node.js application directory** (e.g., `/home/username/api.beyond-border.org/`)
4. **Upload all backend files** including the new `.htaccess` file:
   - All `.js` files
   - `package.json`
   - `.env` file
   - `.htaccess` (NEW - very important!)
   - All folders (`config`, `controllers`, `models`, `routes`, `services`, `middleware`, `utils`)

5. **Important Files to Upload:**
   - ✅ `.htaccess` (NEW)
   - ✅ `services/notificationService.js` (UPDATED)
   - ✅ `app.js`
   - ✅ All other files

### Step 3: Setup Node.js App in cPanel

1. **Go to "Setup Node.js App" in cPanel**
2. **Configure your application:**
   - Application Root: `/home/username/api.beyond-border.org`
   - Application URL: `https://api.beyond-border.org`
   - Application Startup File: `app.js`
   - Node.js Version: 18.x or higher
3. **Click "Create"**
4. **Run NPM Install** (click the button in cPanel)
5. **Restart the application**

### Step 4: Prepare Frontend for Deployment

```bash
cd beyond-border-frontend

# Install dependencies
npm install

# Build for production
npm run build
```

This creates the `dist/beyond-border-frontend/browser` folder with your compiled Angular app.

### Step 5: Upload Frontend to cPanel

1. **Navigate to your public_html folder** (or subdomain folder)
2. **Delete old files** (or backup them first)
3. **Upload all files from** `dist/beyond-border-frontend/browser/`
   - All `.js` files
   - All `.css` files
   - `index.html`
   - `assets/` folder
   - All chunk files

### Step 6: Verify .htaccess is in Place

**Backend .htaccess location:**
```
/home/username/api.beyond-border.org/.htaccess
```

**Check that it contains:**
- LiteSpeed SSE configuration
- CORS headers
- No-buffering directives for `/api/notifications/stream`

## 🧪 Testing SSE Connection

### Test 1: Check Node.js App is Running

Visit: `https://api.beyond-border.org/health`

Expected response:
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "environment": "production"
}
```

### Test 2: Test API Documentation

Visit: `https://api.beyond-border.org/api-docs`

You should see the Swagger documentation.

### Test 3: Test SSE Connection

1. **Open your frontend:** `https://beyond-border.org`
2. **Login to admin panel**
3. **Open Browser DevTools** (F12)
4. **Go to Console tab**
5. **Look for SSE logs:**
   ```
   📡 Attempting SSE connection (Attempt 1/10)...
   ✅ SSE connection established successfully
   ✅ SSE connection confirmed by server
   📊 Unread count updated: 0
   ```

### Test 4: Check Network Tab

1. **Go to Network tab in DevTools**
2. **Filter by "stream"**
3. **Look for:** `https://api.beyond-border.org/api/notifications/stream`
4. **Status should be:** `200 OK` (and stay open)
5. **Type should be:** `text/event-stream`

### Test 5: Test Real Notification

1. **Open a new incognito window**
2. **Go to contact form:** `https://beyond-border.org/contact`
3. **Submit a test message**
4. **Check admin panel** - you should:
   - See notification badge update
   - Hear notification sound
   - Get browser push notification (if enabled)
5. **Check console logs:**
   ```
   🔔 New notification received: New Contact Inquiry
   📊 Unread count updated: 1
   ```

## 🐛 Troubleshooting

### Issue 1: SSE Connection Fails Immediately

**Symptoms:** Console shows `❌ SSE connection failed: 404` or `403`

**Solutions:**
1. Check that `.htaccess` file exists in backend root
2. Verify Node.js app is running in cPanel
3. Check cPanel error logs
4. Verify API URL in `environment.prod.ts` matches your setup

### Issue 2: SSE Connects but Disconnects After 30 Seconds

**Symptoms:** Connection works briefly then drops

**Solutions:**
1. Check `.htaccess` is properly uploaded
2. Verify LiteSpeed directives are active
3. Check cPanel Node.js app logs for errors
4. The system will auto-reconnect (check console for reconnection attempts)

### Issue 3: CORS Errors in Browser Console

**Symptoms:** `Access-Control-Allow-Origin` errors

**Solutions:**
1. Update `.env` file: `CORS_ORIGIN=https://beyond-border.org`
2. Restart Node.js app in cPanel
3. Clear browser cache and reload

### Issue 4: Reconnection Loops

**Symptoms:** Console shows constant reconnection attempts

**Solutions:**
1. Check backend logs in cPanel
2. Verify JWT token is valid (logout and login again)
3. Check Node.js app isn't crashing (cPanel logs)
4. System will retry 10 times with exponential backoff (2s, 4s, 8s, 16s, 32s, 60s...)

## 📊 Monitoring & Logs

### Backend Logs (cPanel)

1. **Go to "Setup Node.js App" in cPanel**
2. **Click on your app**
3. **Check "Application logs"**

Expected logs:
```
📡 SSE client connected: User 1 (Total connections: 1)
📊 Connection details: Origin=https://beyond-border.org
✅ Contact notification created and broadcast
```

### Frontend Logs (Browser Console)

Normal operation logs:
```
📡 Attempting SSE connection (Attempt 1/10)...
✅ SSE connection established successfully
✅ SSE connection confirmed by server
📊 Unread count updated: 0
🔔 New notification received: New Contact Inquiry
```

## 🔍 Connection Limits

**Shared Hosting Limitations:**
- LiteSpeed may timeout connections after 5-10 minutes
- This is normal for shared hosting
- Auto-reconnection will handle it
- Notifications will still work via reconnection

**What to Expect:**
- ✅ Connection stays open for 5-10 minutes
- ✅ Auto-reconnects when dropped
- ✅ Notifications arrive in real-time during connection
- ✅ Notifications are stored in database (won't be lost)
- ✅ Reconnection happens automatically with exponential backoff

## 📧 Email Notifications

**Status:** ✅ Working (No changes made)

Email notifications continue to work independently of SSE:
- Contact form submissions send emails
- Consultant requests send emails
- Community applications send emails

## ✨ Success Indicators

Your SSE system is working correctly if:
- ✅ Console shows: `✅ SSE connection established successfully`
- ✅ Network tab shows `/stream` with status `200` (pending/open)
- ✅ Test notifications arrive in real-time
- ✅ Auto-reconnection works after page refresh
- ✅ Browser notifications pop up
- ✅ Notification sound plays

## 🎯 Next Steps

1. **Deploy to production** following steps above
2. **Test thoroughly** using the testing section
3. **Monitor for 24-48 hours** to ensure stability
4. **If issues persist**, we can implement Option 2 (Hybrid SSE + Polling)

## 📞 Support

If SSE still doesn't work after following this guide:
- Check all deployment steps completed
- Review cPanel error logs
- Verify `.htaccess` is uploaded correctly
- Test from different browsers/devices
- Contact me for Option 2 implementation (Hybrid approach)

---

**Remember:** Email notifications work independently and will continue regardless of SSE status!


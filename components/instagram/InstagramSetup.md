# Instagram Basic Display API Setup for @thismfdoom_

**FOCUS**: Setting up the official **Instagram Basic Display API** for reliable, real-time Instagram posts integration.

## 🎯 **Why Instagram Basic Display API?**

✅ **Official Instagram API** - Direct from Meta/Facebook  
✅ **FREE** - 200 requests/hour (perfect for your needs)  
✅ **Reliable** - No third-party dependencies  
✅ **Real-time** - Fresh posts directly from your @thismfdoom_ account  
✅ **60-day tokens** - Long-lived access with refresh capability  

---

## 🚀 **Step-by-Step Setup Guide**

### **Step 1: Create Facebook Developer Account**

1. Go to [developers.facebook.com](https://developers.facebook.com)
2. Click **"Get Started"**
3. **Log in** with your Facebook account (the same one linked to your Instagram @thismfdoom_)
4. **Verify account** with phone number (required)
5. Accept developer terms

### **Step 2: Create Your App**

1. Click **"Create App"**
2. Select **"Consumer"** as app type
3. Fill in details:
   - **App Name**: `MF DOOM Shop Instagram Feed`
   - **Contact Email**: Your email
   - **Purpose**: `Yourself or your own business`
4. Click **"Create App"**

### **Step 3: Add Instagram Basic Display**

1. In your app dashboard, click **"Add Product"**
2. Find **"Instagram Basic Display"** → **"Set Up"**
3. This adds the Instagram product to your app

### **Step 4: Configure Instagram Settings**

1. Go to **Instagram Basic Display > Basic Display**
2. Click **"Create New App"** (creates Instagram app linked to Facebook app)
3. Fill in required fields:
   - **Display Name**: `MF DOOM Shop`
   - **Valid OAuth Redirect URIs**: `https://localhost/`
   - **Deauthorize Callback URL**: `https://localhost/`
   - **Data Deletion Request URL**: `https://localhost/`

### **Step 5: Add Instagram Tester**

1. Go to **Instagram Basic Display > Roles > Roles**
2. Click **"Add Instagram Testers"**
3. Enter your Instagram username: `thismfdoom_`
4. Click **"Submit"**

### **Step 6: Accept Tester Invitation**

1. Open **Instagram mobile app**
2. Go to **Settings** → **Apps and Websites** → **Tester Invites**
3. **Accept** the invitation from your app

### **Step 7: Generate Access Token**

1. Back in Facebook Developer dashboard
2. Go to **Instagram Basic Display > Basic Display**
3. Scroll to **"User Token Generator"**
4. Click **"Generate Token"** next to your Instagram account
5. **Authorize the app** in popup
6. **Copy the access token** (save securely!)

### **Step 8: Add to Environment**

Create `.env.local` file in your project root:

```bash
# Instagram Basic Display API Access Token
INSTAGRAM_ACCESS_TOKEN=paste_your_token_here
```

### **Step 9: Test the Integration**

```bash
# Run the test script
node scripts/test-instagram.js
```

---

## 📝 **Environment Setup**

Create **`.env.local`** in your project root:

```bash
# Instagram Basic Display API
INSTAGRAM_ACCESS_TOKEN=IGQVJXa1FYc2ZAB...your_actual_token_here

# Your actual token will look like:
# INSTAGRAM_ACCESS_TOKEN=IGQVJXa1FYc2ZABparsZAO1kkZATZAnRBzR1d2UlBVMFhLaWJLN2RlZAEcxQ1BNZAVZAWVjcxNGRVVmRITFlzZ (example)
```

---

## 🧪 **Testing Your Setup**

After adding your token to `.env.local`:

```bash
# Test the Instagram API
node scripts/test-instagram.js
```

**Expected successful output:**
```
🎉 SUCCESS! Using official Instagram Basic Display API
📸 Posts found: 6
👤 Account: @thismfdoom_
✅ You're getting real, fresh posts directly from Instagram
```

---

## 🔄 **Token Management**

**Token Lifespan**: 60 days  
**Refresh**: Tokens can be refreshed before expiry  

**To refresh your token** (before it expires):
1. Go back to **Facebook Developer > Instagram Basic Display**
2. Click **"Generate Token"** again
3. Update your `.env.local` file
4. Restart your development server

**Set a reminder**: Add calendar reminder for 50 days to refresh token

---

## 🎯 **What This Gives You**

✅ **Real Instagram posts** from @thismfdoom_  
✅ **Fresh content** updated automatically  
✅ **Post images, captions, links**  
✅ **200 API calls/hour** (more than enough)  
✅ **No trial limitations**  
✅ **Official Instagram integration**  

---

## 🔧 **Deployment to Vercel**

```bash
# Add environment variable to Vercel
vercel env add INSTAGRAM_ACCESS_TOKEN

# When prompted, paste your token
# Then redeploy
vercel --prod
```

---

## 🆘 **Troubleshooting**

**Token not working?**
- Check token is correctly copied (no extra spaces)
- Ensure Instagram account accepted tester invitation
- Verify `.env.local` file is in project root

**Need help?**
- Test script shows current status: `node scripts/test-instagram.js`
- Check Instagram app settings in Facebook Developer dashboard
- Ensure @thismfdoom_ account is a tester

---

## 📱 **Current Status**

- ✅ **RapidAPI removed** - No more paid dependencies
- ✅ **Multiple free fallbacks** - RSS, scraping, local data
- ✅ **Instagram Basic Display ready** - Just needs your token
- ✅ **Smart fallback system** - Never fails completely

**Ready for your Instagram Basic Display API token!** 
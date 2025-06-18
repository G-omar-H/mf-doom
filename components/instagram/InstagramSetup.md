# Instagram Integration Setup for @thismfdoom_

Currently, the Instagram feed is showing placeholder content. To display your actual Instagram posts from [@thismfdoom_](https://www.instagram.com/thismfdoom_), follow these steps:

## Option 1: Instagram Basic Display API (Recommended)

### Step 1: Create Facebook Developer Account
1. Go to [developers.facebook.com](https://developers.facebook.com)
2. Click "Get Started" and create a developer account
3. Verify your account with phone number

### Step 2: Create a New App
1. Click "Create App"
2. Select "Consumer" as app type
3. Fill in app details:
   - App Name: "MF DOOM Shop Instagram Feed"
   - App Contact Email: your email
   - App Purpose: "Yourself or your own business"

### Step 3: Add Instagram Basic Display
1. In your app dashboard, click "Add Product"
2. Find "Instagram Basic Display" and click "Set Up"
3. Click "Create New App" if prompted

### Step 4: Configure Instagram Basic Display
1. Go to Instagram Basic Display > Basic Display
2. Add Instagram Testers:
   - Click "Add or Remove Instagram Testers"
   - Add your Instagram account (@thismfdoom_)
3. Accept the tester invitation in your Instagram app

### Step 5: Get Access Token
1. In Basic Display settings, find "User Token Generator"
2. Click "Generate Token" next to your Instagram account
3. Authorize the app in Instagram
4. Copy the generated access token

### Step 6: Add to Environment Variables
Add this to your `.env` file:
```bash
INSTAGRAM_ACCESS_TOKEN=your_long_access_token_here
```

### Step 7: Deploy to Vercel
Add the environment variable to your Vercel project:
```bash
vercel env add INSTAGRAM_ACCESS_TOKEN
```

## Option 2: Manual Content Update (Quick Fix)

If you want to quickly update the content while setting up the API:

1. Take screenshots of your latest Instagram posts
2. Save them in `public/images/instagram/` folder
3. Update the mock data in `app/api/instagram/route.ts` with:
   - Real captions from your posts
   - Actual post URLs
   - Your image paths

## Option 3: Instagram Embed Widgets

Use Instagram's embed code for specific posts:
1. Go to your Instagram post
2. Click "..." menu
3. Select "Embed"
4. Copy the embed code
5. Add to a custom component

## Current Status
- ✅ Instagram feed component created
- ✅ API endpoint ready
- ⏳ Waiting for Instagram API setup
- ⏳ Using placeholder content

## Notes
- Instagram access tokens expire every 60 days (short-lived) or 60 days (long-lived)
- You'll need to refresh tokens periodically
- Consider using a service like Instagram Feed Pro for easier management
- The current implementation falls back to mock data if the API is unavailable

## Need Help?
If you need assistance with the Instagram API setup, let me know and I can help you through the process step by step. 
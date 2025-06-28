#!/usr/bin/env node

// Instagram Basic Display API Test Script
const http = require('http');

console.log('🧪 Testing Instagram Basic Display API Integration...\n');

// Check environment setup
console.log('🔧 Environment Check:');
if (process.env.INSTAGRAM_ACCESS_TOKEN) {
  console.log('✅ INSTAGRAM_ACCESS_TOKEN is set');
  console.log(`   Token preview: ${process.env.INSTAGRAM_ACCESS_TOKEN.substring(0, 20)}...`);
} else {
  console.log('❌ INSTAGRAM_ACCESS_TOKEN not found in environment');
  console.log('   💡 Create .env.local file with your Instagram Basic Display API token');
  console.log('   📖 Follow guide in: components/instagram/InstagramSetup.md\n');
}

console.log('\n🔍 Testing API endpoint...\n');

// Test the Instagram API endpoint
const testInstagramAPI = () => {
  const options = {
    hostname: 'localhost',
    port: 3001,
    path: '/api/instagram?limit=3',
    method: 'GET'
  };

  const req = http.request(options, (res) => {
    let data = '';
    
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      try {
        const result = JSON.parse(data);
        
        console.log('✅ Instagram API Response:');
        console.log(`📊 Source: ${result.source}`);
        console.log(`📸 Posts found: ${result.total}`);
        console.log(`👤 Account: ${result.account}\n`);
        
        if (result.posts && result.posts.length > 0) {
          console.log('📋 Sample post:');
          console.log(`   ID: ${result.posts[0].id}`);
          console.log(`   Type: ${result.posts[0].media_type}`);
          console.log(`   Caption: ${result.posts[0].caption?.substring(0, 80) || 'No caption'}...`);
          console.log(`   URL: ${result.posts[0].permalink}\n`);
        }
        
        // Provide specific guidance based on source
        if (result.source === 'instagram_basic_display') {
          console.log('🎉 SUCCESS! Instagram Basic Display API is working perfectly!');
          console.log('   ✅ Real-time posts from @thismfdoom_');
          console.log('   ✅ 200 requests/hour limit');
          console.log('   ✅ 60-day token validity');
          console.log('   ✅ Official Instagram integration\n');
          
          console.log('🚀 You\'re all set! Your Instagram feed will show fresh content.');
          
        } else if (result.source === 'local') {
          console.log('💾 Currently using local fallback data');
          console.log('   📝 To get real Instagram posts:');
          console.log('   1️⃣ Follow the setup guide: components/instagram/InstagramSetup.md');
          console.log('   2️⃣ Get your Instagram Basic Display API token');
          console.log('   3️⃣ Add INSTAGRAM_ACCESS_TOKEN to .env.local');
          console.log('   4️⃣ Restart your dev server\n');
          
        } else if (result.source.startsWith('rss') || result.source === 'scraped' || result.source === 'picuki') {
          console.log('📡 Using free backup method (working but not optimal)');
          console.log('   💡 For best results, set up Instagram Basic Display API');
          console.log('   📖 Guide: components/instagram/InstagramSetup.md\n');
          
        } else {
          console.log('❌ Instagram data unavailable');
          console.log('   🔧 Set up Instagram Basic Display API for reliable access');
          console.log('   📖 Guide: components/instagram/InstagramSetup.md\n');
        }
        
        // Next steps guidance
        if (result.source !== 'instagram_basic_display') {
          console.log('📋 Next Steps:');
          console.log('   1. Visit: https://developers.facebook.com');
          console.log('   2. Create app with Instagram Basic Display');
          console.log('   3. Get access token');
          console.log('   4. Add to .env.local file');
          console.log('   5. Test again with: node scripts/test-instagram.js');
        }
        
      } catch (error) {
        console.error('❌ Error parsing API response:', error.message);
        console.log('\n📄 Raw response:', data);
        console.log('\n💡 Make sure your development server is running: npm run dev');
      }
    });
  });
  
  req.on('error', (error) => {
    console.error('❌ Cannot connect to development server');
    console.log('💡 Start your server first: npm run dev');
    console.log(`💡 Then visit: http://localhost:3001/api/instagram`);
  });
  
  req.end();
};

testInstagramAPI(); 
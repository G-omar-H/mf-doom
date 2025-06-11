const { exec } = require('child_process');

console.log('🚀 Deploying fixes to master branch...\n');

// Check status, commit if needed, and push
exec('git status --porcelain && git commit -m "Fix static generation issues: Add hydration protection to cart and checkout pages" && git push origin master', (error, stdout, stderr) => {
  console.log('Git output:');
  console.log(stdout);
  
  if (stderr) {
    console.log('\nGit messages:');
    console.log(stderr);
  }
  
  if (error) {
    console.log('\n❌ Git operation failed:');
    console.log(error.message);
  } else {
    console.log('\n✅ Successfully deployed to master branch!');
    console.log('\n🔄 Your Vercel deployment should rebuild automatically with these fixes:');
    console.log('  ✅ Prisma generation during build');
    console.log('  ✅ Hydration protection for cart/checkout pages');
    console.log('  ✅ Dynamic rendering for client-side components');
  }
}); 
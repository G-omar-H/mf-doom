#!/bin/bash
echo "🚀 Pushing fixes to master branch..."
git add .
git commit -m "Fix static generation issues: Add hydration protection to cart and checkout pages"
git push origin master
echo "✅ Done! Vercel should rebuild automatically." 
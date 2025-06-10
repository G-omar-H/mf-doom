#!/bin/bash

# MF DOOM Shop - Create Shareable ZIP
echo "🎭 Creating shareable ZIP for MF DOOM Shop..."

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Clean build artifacts
echo -e "${BLUE}Cleaning build artifacts...${NC}"
rm -rf .next
rm -rf out

# Create timestamp for unique filename
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
FILENAME="mf-doom-shop_${TIMESTAMP}.zip"

# Create ZIP excluding unnecessary files
echo -e "${BLUE}Creating ZIP file...${NC}"
cd ..
zip -r "$FILENAME" mf-doom \
  -x "mf-doom/node_modules/*" \
  -x "mf-doom/.next/*" \
  -x "mf-doom/.git/*" \
  -x "mf-doom/*.log" \
  -x "mf-doom/.env*" \
  -x "mf-doom/out/*" \
  -x "*.DS_Store"

# Get file size
FILESIZE=$(du -h "$FILENAME" | cut -f1)

echo -e "${GREEN}✅ Success!${NC}"
echo -e "📦 Created: ${GREEN}$FILENAME${NC}"
echo -e "📏 Size: ${GREEN}$FILESIZE${NC}"
echo -e "📍 Location: $(pwd)/$FILENAME"
echo ""
echo "📧 Share via:"
echo "  - WeTransfer.com (no account needed)"
echo "  - Google Drive"
echo "  - Dropbox"
echo "  - Email (if under 25MB)"
echo ""
echo "📝 Instructions for recipient:"
echo "  1. Unzip the file"
echo "  2. cd mf-doom"
echo "  3. npm install"
echo "  4. npm run dev" 
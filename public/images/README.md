# Product Images Setup

## Current Status
All products are currently using placeholder images from placeholder.com with appropriate colors and text labels.

## To Add Real Product Images

When you have the actual product images, follow these steps:

1. Add the images to this `/public/images/` directory with these exact filenames:

### Apparel
- `doom-green-hoodie.jpg` - MF DOOM green/olive hoodie with mask graphic
- `doom-signature-hoodie.jpg` - Black hoodie with signature and poem text
- `illest-villain-tee.jpg` - Cream t-shirt with "THE ILLEST VILLAIN" text
- `doom-mask-black-tee.jpg` - Black t-shirt with DOOM mask and text
- `comic-doom-tee.jpg` - Black t-shirt with comic book style DOOM
- `cartoon-doom-tee.jpg` - Cream t-shirt with cartoon DOOM character
- `doom-tour-tee.jpg` - Beige/sand t-shirt with tour dates and mask

### Vinyl
- `madvillainy-vinyl.jpg` - Madvillainy album cover
- `operation-doomsday-vinyl.jpg` - Operation: Doomsday album cover
- `mm-food-vinyl.jpg` - MM..FOOD album cover

### Accessories
- `doom-mask-ring.jpg` - Silver/metal DOOM mask ring
- `doom-keychain.jpg` - DOOM mask keychain with pink star
- `doom-pins.jpg` - DOOM enamel pin set

### Art
- `madvillain-poster.jpg` - Madvillainy poster artwork
- `doom-art-print.jpg` - DOOM portrait art print

2. Update the product data in `/lib/data/products.ts`:
   - Replace the placeholder URLs with the local image paths
   - Example: Change `https://via.placeholder.com/...` to `/images/doom-green-hoodie.jpg`

## Image Requirements
- Recommended size: 800x800px minimum
- Format: JPG or PNG
- File size: Optimize for web (under 500KB per image)

## Current Placeholder Colors
The placeholders use colors that match each product:
- Green Hoodie: Olive green (#3B7F5C)
- Black items: Black (#000000) or Dark gray (#1A1A1A)
- Cream items: Cream (#F5F5DC) or Off-white (#FFF8DC)
- Vinyl: Various colors matching album artwork
- Accessories: Silver (#C0C0C0) and appropriate accent colors 
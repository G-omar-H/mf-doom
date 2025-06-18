# MF DOOM Shop - E-Commerce Website

A fully functional e-commerce website inspired by the legendary rapper MF DOOM. Built with Next.js 14, TypeScript, Tailwind CSS, and PayPal for payments.

![MF DOOM Shop](https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=400&fit=crop)

## 🎭 Features

### Core E-Commerce Functionality
- **Product Catalog**: Browse apparel, vinyl, accessories, and art
- **Product Variants**: Size and color options for products
- **Shopping Cart**: Persistent cart with quantity management
- **Secure Checkout**: Integrated with PayPal for payment processing
- **Order Management**: Admin dashboard for managing orders
- **Mobile Responsive**: Optimized for all screen sizes

### Design Features
- **DOOM-Inspired Aesthetic**: Dark, gritty design with comic book elements
- **Custom Animations**: Smooth transitions and interactive elements
- **Glitch Effects**: Dynamic text effects inspired by DOOM's style
- **Comic Panel Design**: Unique card layouts reminiscent of comic books

## 🛠 Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS with custom DOOM theme
- **State Management**: Zustand with localStorage persistence
- **Payments**: PayPal integration with Smart Payment Buttons
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Notifications**: React Hot Toast

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/mf-doom-shop.git
cd mf-doom-shop
```

2. Install dependencies:
```bash
npm install 
```

3. Create a `.env.local` file based on `.env.example`:
```bash
cp .env.example .env.local
```

4. Add your PayPal API keys to `.env.local`:
```
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret
PAYPAL_ENVIRONMENT=sandbox
```

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Import the project to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Other Platforms
The project can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- Railway
- DigitalOcean App Platform

## 📁 Project Structure

```
mf-doom-shop/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── products/          # Product pages
│   ├── cart/              # Cart page
│   ├── checkout/          # Checkout flow
│   └── admin/             # Admin dashboard
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── layout/           # Layout components
│   └── products/         # Product-specific components
├── lib/                   # Utilities and data
│   ├── store/            # Zustand stores
│   ├── utils/            # Helper functions
│   └── data/             # Mock product data
├── public/               # Static assets
├── styles/               # Global styles
└── types/                # TypeScript types
```

## 🎨 Customization

### Theme Colors
Edit the custom colors in `tailwind.config.js`:
```javascript
doom: {
  black: '#0A0A0A',
  gray: '#1A1A1A',
  silver: '#C0C0C0',
  gold: '#FFD700',
  red: '#8B0000',
  green: '#2F4F2F',
}
```

### Products
Modify the product catalog in `lib/data/products.ts`

### Fonts
The project uses:
- **Bebas Neue**: For headings (metal-inspired)
- **Comic Neue**: For body text (comic book style)

## 🔒 Environment Variables

Required environment variables:
- `NEXT_PUBLIC_PAYPAL_CLIENT_ID`: Your PayPal client ID
- `PAYPAL_CLIENT_SECRET`: Your PayPal client secret
- `PAYPAL_ENVIRONMENT`: Set to 'sandbox' for testing, 'production' for live
- `ADMIN_PASSWORD`: (Optional) Password for admin access

## 📝 License

This project is for educational purposes and tribute to MF DOOM. All rights to MF DOOM's name, image, and likeness belong to his estate.

## 🙏 Acknowledgments

- Inspired by the legendary MF DOOM
- Built with love for the hip-hop community
- "Just remember ALL CAPS when you spell the man name"

---

**Note**: This is a demo project. For production use, implement proper authentication, database integration, and security measures. 
# 🎭 MF DOOM Shop - Quick Start Guide

## Prerequisites
- Node.js 18+ installed ([Download here](https://nodejs.org/))
- npm or yarn package manager

## Installation

1. **Extract the ZIP file** (if received as ZIP)

2. **Open terminal/command prompt** and navigate to the project:
```bash
cd mf-doom
```

3. **Install dependencies:**
```bash
npm install
```

4. **Start the development server:**
```bash
npm run dev
```

5. **Open your browser** to [http://localhost:3000](http://localhost:3000)

## Project Overview

This is a tribute e-commerce site for MF DOOM featuring:
- 🛍️ Product catalog with T-shirts, Vinyl, and Accessories
- 🛒 Shopping cart functionality
- 📱 Enhanced mobile experience
- 💳 Stripe-ready checkout (needs API keys)
- 🎨 Spotify-inspired design with light blue theme

## Key Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Run production build

## Project Structure
```
mf-doom/
├── app/              # Next.js app directory
├── components/       # React components
├── lib/             # Utilities and store
├── public/          # Static assets
├── styles/          # Global styles
└── types/           # TypeScript types
```

## Environment Variables (Optional)

To enable Stripe payments, create `.env.local`:
```
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_key_here
STRIPE_SECRET_KEY=your_secret_key_here
```

## Troubleshooting

**Port already in use?**
```bash
# Kill process on port 3000
npx kill-port 3000
# Or use a different port
npm run dev -- -p 3001
```

**Module not found errors?**
```bash
rm -rf node_modules package-lock.json
npm install
```

## Need Help?

Check the full documentation in `PROJECT_DOCS.md` or `README.md`

---

*"Just remember ALL CAPS when you spell the man name"* - MF DOOM 
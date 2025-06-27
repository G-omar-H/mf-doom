/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'localhost', 
      'images.unsplash.com',
      'scontent-vie1-1.cdninstagram.com',
      'scontent.cdninstagram.com'
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.cdninstagram.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'scontent-*.cdninstagram.com',
        port: '',
        pathname: '/**',
      }
    ],
  },
  env: {
    NEXT_PUBLIC_PAYPAL_CLIENT_ID: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
    PAYPAL_CLIENT_SECRET: process.env.PAYPAL_CLIENT_SECRET,
    PAYPAL_ENVIRONMENT: process.env.PAYPAL_ENVIRONMENT || 'sandbox',
  },
}

module.exports = nextConfig 
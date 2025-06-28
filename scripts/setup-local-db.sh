#!/bin/bash

# MF DOOM Shop - Local Database Setup Script
echo "🎭 Setting up local database for MF DOOM Shop..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    echo "   Visit: https://docs.docker.com/get-docker/"
    exit 1
fi

# Check if Docker Compose is available
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo "❌ Docker Compose is not available. Please install Docker Compose."
    exit 1
fi

# Create .env.local if it doesn't exist
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local file..."
    cat > .env.local << EOF
# Local Development Environment Variables
# Database Configuration (Local PostgreSQL)
DATABASE_URL="postgresql://doom_user:doom_password_local@localhost:5434/mf_doom_dev?schema=public"

# Authentication (Same as production for compatibility)
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="doom-shop-super-secret-key-change-in-production"

# PayPal Configuration (Use Sandbox for local development)
NEXT_PUBLIC_PAYPAL_CLIENT_ID="AWjt6SVoLlLP1p1k3p2GGvTvhVP4KdR8y__byBzDfA_DiaFtOJC_9IttzlGJIa_oFLZlWqS47c_kBg9A"
PAYPAL_CLIENT_SECRET="EGxc54S9ztDRLMDEXkAahvyVGImPtzWXJDWBrH0mGGnc8ZJt6xxD8HAprD_uAXlnIXt7hLjLebipqUo2"
PAYPAL_ENVIRONMENT="sandbox"

# Admin Configuration
ADMIN_EMAIL="admin@mfdoomshop.local"
ADMIN_PASSWORD="doom_admin_123"

# Instagram Basic Display API (for local development)
INSTAGRAM_ACCESS_TOKEN=your_instagram_access_token_here

# Development Flags
NODE_ENV="development"
DEBUG_MODE="true"
EOF
    echo "✅ Created .env.local file"
else
    echo "✅ .env.local already exists"
fi

# Start PostgreSQL container
echo "🐳 Starting PostgreSQL container..."
npm run db:docker:up

# Wait for PostgreSQL to be ready
echo "⏳ Waiting for PostgreSQL to be ready..."
sleep 10

# Check if PostgreSQL is ready
echo "🔍 Checking PostgreSQL connection..."
max_attempts=30
attempt=1

while [ $attempt -le $max_attempts ]; do
    if docker exec mf-doom-postgres pg_isready -U doom_user -d mf_doom_dev > /dev/null 2>&1; then
        echo "✅ PostgreSQL is ready!"
        break
    fi
    
    if [ $attempt -eq $max_attempts ]; then
        echo "❌ PostgreSQL failed to start after $max_attempts attempts"
        exit 1
    fi
    
    echo "   Attempt $attempt/$max_attempts - PostgreSQL not ready yet..."
    sleep 2
    attempt=$((attempt + 1))
done

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npm run db:generate

# Run database migrations
echo "🏗️  Running database migrations..."
npm run db:migrate

# Seed the database
echo "🌱 Seeding database with sample data..."
npm run db:seed

echo ""
echo "🎉 Local database setup complete!"
echo ""
echo "📊 Database Info:"
echo "   - Database: mf_doom_dev"
echo "   - Host: localhost:5434"
echo "   - User: doom_user"
echo "   - Password: doom_password_local"
echo ""
echo "🔧 Useful commands:"
echo "   npm run dev                 # Start development server"
echo "   npm run db:studio          # Open Prisma Studio"
echo "   npm run pgadmin            # Start PgAdmin (http://localhost:8080)"
echo "   npm run db:docker:logs     # View database logs"
echo "   npm run db:docker:down     # Stop database"
echo ""
echo "🌐 Access URLs:"
echo "   - App: http://localhost:3000"
echo "   - Prisma Studio: http://localhost:5555"
echo "   - PgAdmin: http://localhost:8080 (admin@mfdoom.local / admin123)"
echo ""
echo "👨‍💻 Test Accounts:"
echo "   - Admin: admin@mfdoomshop.local / doom_admin_123"
echo "   - Customer: test@customer.local / password123"
echo ""
echo "Remember ALL CAPS when you spell the man name! 🎭" 
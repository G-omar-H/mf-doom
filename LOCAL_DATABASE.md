# 🏠 Local Database Setup for MF DOOM Shop

This guide will help you set up a local PostgreSQL database for development, replacing the remote Supabase connection for faster local development.

## 🚀 Quick Setup (Recommended)

Run the automated setup script:

```bash
npm run db:setup-local
```

This script will:
- ✅ Create `.env.local` with local database configuration
- 🐳 Start PostgreSQL container with Docker
- 🏗️ Run database migrations
- 🌱 Seed the database with sample data
- 📊 Set up test users and products

## 📋 Manual Setup

### Prerequisites

- Docker and Docker Compose installed
- Node.js and npm

### Step 1: Start Database Container

```bash
# Start PostgreSQL container
npm run db:docker:up

# Check logs (optional)
npm run db:docker:logs
```

### Step 2: Environment Configuration

Create `.env.local` file:

```env
# Local Development Environment Variables
DATABASE_URL="postgresql://doom_user:doom_password_local@localhost:5432/mf_doom_dev?schema=public"

# Authentication
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="doom-shop-super-secret-key-change-in-production"

# PayPal (Sandbox for local development)
NEXT_PUBLIC_PAYPAL_CLIENT_ID="your_sandbox_client_id"
PAYPAL_CLIENT_SECRET="your_sandbox_client_secret"
PAYPAL_ENVIRONMENT="sandbox"

# Admin Configuration
ADMIN_EMAIL="admin@mfdoomshop.local"
ADMIN_PASSWORD="doom_admin_123"

# Development Flags
NODE_ENV="development"
DEBUG_MODE="true"
```

### Step 3: Setup Database

```bash
# Generate Prisma client
npm run db:generate

# Run migrations
npm run db:migrate

# Seed with sample data
npm run db:seed
```

## 🛠️ Database Management Commands

### Docker Operations
```bash
npm run db:docker:up      # Start PostgreSQL container
npm run db:docker:down    # Stop and remove containers
npm run db:docker:logs    # View database logs
npm run pgadmin          # Start PgAdmin web interface
```

### Database Operations
```bash
npm run db:migrate       # Run migrations
npm run db:seed          # Seed with sample data
npm run db:reset         # Reset database (⚠️ destroys all data)
npm run db:studio        # Open Prisma Studio
npm run db:push          # Push schema changes (without migrations)
```

### Data Management
```bash
npm run db:export        # Export data from Supabase (if needed)
```

## 📊 Database Information

### Connection Details
- **Host**: localhost
- **Port**: 5432
- **Database**: mf_doom_dev
- **Username**: doom_user
- **Password**: doom_password_local

### Access Tools

#### Prisma Studio
```bash
npm run db:studio
```
Access at: http://localhost:5555

#### PgAdmin (Web Interface)
```bash
npm run pgadmin
```
Access at: http://localhost:8080
- Email: admin@mfdoom.local
- Password: admin123

## 👨‍💻 Test Accounts

After seeding, you'll have these test accounts:

### Admin Account
- **Email**: admin@mfdoomshop.local
- **Password**: doom_admin_123
- **Role**: ADMIN

### Customer Account
- **Email**: test@customer.local
- **Password**: password123
- **Role**: CUSTOMER

## 📦 Sample Data

The seed script creates:
- 🛍️ **6 Products** (t-shirts, hoodies, vinyl, accessories)
- 👤 **2 Users** (1 admin, 1 customer)
- 📋 **1 Sample Order** with multiple items
- ⭐ **Product Reviews**
- 📦 **Inventory Items** with variants

## 🔄 Switching Between Local and Remote

### Using Local Database
Ensure `.env.local` has the local DATABASE_URL:
```env
DATABASE_URL="postgresql://doom_user:doom_password_local@localhost:5432/mf_doom_dev?schema=public"
```

### Using Remote Supabase
Remove or rename `.env.local` to use the remote connection from `.env`:
```bash
mv .env.local .env.local.backup
```

## 📥 Importing Real Data from Supabase

If you want to use real data from your Supabase database:

### Step 1: Export from Supabase
```bash
# Make sure .env points to Supabase
npm run db:export
```

### Step 2: Import to Local
```bash
# Switch to local database
# Then run the import script (you'll need to create this based on your export)
npm run db:reset  # Clear local database first
npm run db:migrate
# Import your exported data
```

## 🐛 Troubleshooting

### Database Connection Issues
```bash
# Check if PostgreSQL is running
docker ps | grep postgres

# Restart database
npm run db:docker:down
npm run db:docker:up

# Check database logs
npm run db:docker:logs
```

### Port Conflicts
If port 5432 is already in use, modify `docker-compose.yml`:
```yaml
ports:
  - "5433:5432"  # Use different host port
```

Then update your DATABASE_URL accordingly.

### Migration Issues
```bash
# Reset and start fresh
npm run db:reset
npm run db:migrate
npm run db:seed
```

### Prisma Client Issues
```bash
# Regenerate Prisma client
npm run db:generate
```

## 🔧 Advanced Configuration

### Custom Docker Configuration
Create `docker-compose.override.yml` for custom settings:
```yaml
version: '3.8'
services:
  postgres:
    environment:
      POSTGRES_DB: custom_db_name
    ports:
      - "5433:5432"
```

### Environment Variables
All environment variables can be customized in `.env.local`:
- `DATABASE_URL` - Local database connection
- `PAYPAL_ENVIRONMENT` - Set to "sandbox" for development
- `DEBUG_MODE` - Enable additional logging

## 🎯 Development Workflow

1. **Start Development**:
   ```bash
   npm run db:docker:up
   npm run dev
   ```

2. **Make Schema Changes**:
   ```bash
   # Edit prisma/schema.prisma
   npm run db:migrate
   ```

3. **Reset Data**:
   ```bash
   npm run db:reset
   npm run db:seed
   ```

4. **Stop Development**:
   ```bash
   npm run db:docker:down
   ```

## ⚠️ Important Notes

- **Never commit** `.env.local` to git
- **Always use sandbox** PayPal credentials for local development
- **Database data** is persistent in Docker volumes
- **Exports folder** is gitignored but exports are saved locally

---

Remember ALL CAPS when you spell the man name! 🎭 
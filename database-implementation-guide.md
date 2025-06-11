# Database Implementation Guide - MF DOOM Shop

## Phase 1: Database Setup

### Step 1: Install Dependencies
```bash
# Core database dependencies
npm install prisma @prisma/client
npm install @next-auth/prisma-adapter next-auth
npm install bcryptjs @types/bcryptjs

# Development dependencies
npm install -D prisma
```

### Step 2: Initialize Prisma
```bash
# Initialize Prisma in your project
npx prisma init

# This creates:
# - prisma/schema.prisma
# - .env (with DATABASE_URL)
```

### Step 3: Database Provider Setup

#### Option A: Local PostgreSQL (Development)
```bash
# Install PostgreSQL locally or use Docker
docker run --name mf-doom-postgres \
  -e POSTGRES_DB=mf_doom_shop \
  -e POSTGRES_USER=doom_user \
  -e POSTGRES_PASSWORD=your_password \
  -p 5432:5432 \
  -d postgres:15

# Update .env.local
DATABASE_URL="postgresql://doom_user:your_password@localhost:5432/mf_doom_shop"
```

#### Option B: Supabase (Recommended for production)
```bash
# 1. Create project at supabase.com
# 2. Get connection string from Settings > Database
# 3. Update .env.local
DATABASE_URL="postgresql://postgres:[password]@[host]:5432/postgres"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"
```

### Step 4: Create Prisma Schema
Create `prisma/schema.prisma`:

```prisma
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// User Model
model User {
  id            String    @id @default(uuid())
  email         String    @unique
  name          String
  phone         String?
  avatar        String?
  role          UserRole  @default(CUSTOMER)
  emailVerified DateTime?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  // Relations
  orders    Order[]
  addresses Address[]
  reviews   ProductReview[]
  wishlist  WishlistItem[]

  @@map("users")
}

enum UserRole {
  CUSTOMER
  ADMIN
}

// Product Model
model Product {
  id             String        @id @default(uuid())
  name           String
  slug           String        @unique
  description    String
  price          Decimal       @db.Decimal(10, 2)
  compareAtPrice Decimal?      @db.Decimal(10, 2)
  cost           Decimal?      @db.Decimal(10, 2)
  sku            String?       @unique
  category       ProductCategory
  subcategory    String?
  tags           String[]
  status         ProductStatus @default(ACTIVE)
  featured       Boolean       @default(false)
  weight         Decimal?      @db.Decimal(8, 2)
  dimensions     Json?
  seoTitle       String?
  seoDescription String?
  createdAt      DateTime      @default(now())
  updatedAt      DateTime      @updatedAt

  // Relations
  images         ProductImage[]
  variants       ProductVariant[]
  inventoryItems InventoryItem[]
  orderItems     OrderItem[]
  reviews        ProductReview[]
  wishlistItems  WishlistItem[]
  productViews   ProductView[]
  salesAnalytics SalesAnalytics[]

  @@map("products")
}

enum ProductCategory {
  APPAREL
  VINYL
  ACCESSORIES
  ART
}

enum ProductStatus {
  ACTIVE
  DRAFT
  ARCHIVED
}

// Product Images
model ProductImage {
  id        String   @id @default(uuid())
  productId String
  url       String
  altText   String?
  position  Int      @default(0)
  createdAt DateTime @default(now())

  // Relations
  product Product @relation(fields: [productId], references: [id], onDelete: Cascade)

  @@map("product_images")
}

// Product Variants
model ProductVariant {
  id        String      @id @default(uuid())
  productId String
  name      String
  type      VariantType
  options   String[]
  required  Boolean     @default(true)
  createdAt DateTime    @default(now())

  // Relations
  product Product @relation(fields: [productId], references: [id], onDelete: Cascade)

  @@map("product_variants")
}

enum VariantType {
  SIZE
  COLOR
  EDITION
  FINISH
  MATERIAL
}

// Inventory Management
model InventoryItem {
  id                  String    @id @default(uuid())
  productId           String
  variantCombination  Json?
  sku                 String    @unique
  quantityOnHand      Int       @default(0)
  quantityReserved    Int       @default(0)
  quantityAvailable   Int       @default(0)
  reorderPoint        Int       @default(5)
  reorderQuantity     Int       @default(10)
  cost                Decimal?  @db.Decimal(10, 2)
  createdAt           DateTime  @default(now())
  updatedAt           DateTime  @updatedAt

  // Relations
  product    Product     @relation(fields: [productId], references: [id])
  orderItems OrderItem[]

  @@map("inventory_items")
}

// Orders
model Order {
  id                 String            @id @default(uuid())
  orderNumber        String            @unique
  userId             String?
  guestEmail         String?
  status             OrderStatus       @default(PENDING)
  paymentStatus      PaymentStatus     @default(PENDING)
  fulfillmentStatus  FulfillmentStatus @default(UNFULFILLED)

  // Pricing
  subtotal       Decimal @db.Decimal(10, 2)
  taxAmount      Decimal @db.Decimal(10, 2)
  shippingAmount Decimal @db.Decimal(10, 2)
  discountAmount Decimal @default(0) @db.Decimal(10, 2)
  totalAmount    Decimal @db.Decimal(10, 2)

  // Payment
  paymentMethod         String?
  stripePaymentIntentId String?
  stripeChargeId        String?

  // Shipping
  shippingAddress Json
  billingAddress  Json
  shippingMethod  String?
  trackingNumber  String?
  shippedAt       DateTime?
  deliveredAt     DateTime?

  // Metadata
  notes         String?
  customerNotes String?
  tags          String[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relations
  user             User?                @relation(fields: [userId], references: [id])
  orderItems       OrderItem[]
  discountCodes    OrderDiscountCode[]

  @@map("orders")
}

enum OrderStatus {
  PENDING
  CONFIRMED
  PROCESSING
  SHIPPED
  DELIVERED
  CANCELLED
  REFUNDED
}

enum PaymentStatus {
  PENDING
  PAID
  PARTIALLY_PAID
  REFUNDED
  PARTIALLY_REFUNDED
  FAILED
}

enum FulfillmentStatus {
  UNFULFILLED
  PARTIALLY_FULFILLED
  FULFILLED
  SHIPPED
  DELIVERED
}

// Order Items
model OrderItem {
  id              String   @id @default(uuid())
  orderId         String
  productId       String
  inventoryItemId String?
  variantSelection Json?
  quantity        Int
  unitPrice       Decimal  @db.Decimal(10, 2)
  totalPrice      Decimal  @db.Decimal(10, 2)
  productSnapshot Json
  createdAt       DateTime @default(now())

  // Relations
  order         Order          @relation(fields: [orderId], references: [id], onDelete: Cascade)
  product       Product        @relation(fields: [productId], references: [id])
  inventoryItem InventoryItem? @relation(fields: [inventoryItemId], references: [id])

  @@map("order_items")
}

// User Addresses
model Address {
  id         String      @id @default(uuid())
  userId     String
  type       AddressType @default(SHIPPING)
  firstName  String
  lastName   String
  company    String?
  line1      String
  line2      String?
  city       String
  state      String
  postalCode String
  country    String      @default("US")
  phone      String?
  isDefault  Boolean     @default(false)
  createdAt  DateTime    @default(now())
  updatedAt  DateTime    @updatedAt

  // Relations
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("addresses")
}

enum AddressType {
  SHIPPING
  BILLING
}

// Product Reviews
model ProductReview {
  id        String       @id @default(uuid())
  productId String
  userId    String
  orderId   String?
  rating    Int
  title     String?
  content   String
  verified  Boolean      @default(false)
  helpful   Int          @default(0)
  status    ReviewStatus @default(PUBLISHED)
  createdAt DateTime     @default(now())
  updatedAt DateTime     @updatedAt

  // Relations
  product Product @relation(fields: [productId], references: [id], onDelete: Cascade)
  user    User    @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("product_reviews")
}

enum ReviewStatus {
  PENDING
  PUBLISHED
  REJECTED
}

// Wishlist
model WishlistItem {
  id               String   @id @default(uuid())
  userId           String
  productId        String
  variantSelection Json?
  createdAt        DateTime @default(now())

  // Relations
  user    User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  product Product @relation(fields: [productId], references: [id], onDelete: Cascade)

  @@unique([userId, productId])
  @@map("wishlist_items")
}

// Discount Codes
model DiscountCode {
  id                   String                 @id @default(uuid())
  code                 String                 @unique
  name                 String
  type                 DiscountType
  value                Decimal                @db.Decimal(10, 2)
  minimumAmount        Decimal?               @db.Decimal(10, 2)
  maximumUses          Int?
  usedCount            Int                    @default(0)
  startsAt             DateTime?
  endsAt               DateTime?
  appliesToProducts    String[]
  appliesToCategories  ProductCategory[]
  status               DiscountStatus         @default(ACTIVE)
  createdAt            DateTime               @default(now())
  updatedAt            DateTime               @updatedAt

  // Relations
  orderDiscountCodes OrderDiscountCode[]

  @@map("discount_codes")
}

enum DiscountType {
  FIXED_AMOUNT
  PERCENTAGE
  FREE_SHIPPING
}

enum DiscountStatus {
  ACTIVE
  INACTIVE
  EXPIRED
}

// Order Discount Codes Junction
model OrderDiscountCode {
  id             String   @id @default(uuid())
  orderId        String
  discountCodeId String
  discountAmount Decimal  @db.Decimal(10, 2)
  appliedAt      DateTime @default(now())

  // Relations
  order        Order        @relation(fields: [orderId], references: [id], onDelete: Cascade)
  discountCode DiscountCode @relation(fields: [discountCodeId], references: [id])

  @@unique([orderId, discountCodeId])
  @@map("order_discount_codes")
}

// Analytics
model ProductView {
  id        String   @id @default(uuid())
  productId String
  userId    String?
  sessionId String
  userAgent String?
  referer   String?
  createdAt DateTime @default(now())

  // Relations
  product Product @relation(fields: [productId], references: [id], onDelete: Cascade)

  @@map("product_views")
}

model SalesAnalytics {
  id           String   @id @default(uuid())
  date         DateTime
  productId    String
  quantitySold Int
  revenue      Decimal  @db.Decimal(10, 2)
  refunds      Decimal  @default(0) @db.Decimal(10, 2)
  netRevenue   Decimal  @db.Decimal(10, 2)

  // Relations
  product Product @relation(fields: [productId], references: [id])

  @@unique([date, productId])
  @@map("sales_analytics")
}
```

### Step 5: Generate and Run Migrations
```bash
# Generate Prisma client
npx prisma generate

# Create and run first migration
npx prisma migrate dev --name init

# Verify database creation
npx prisma studio
```

## Phase 2: Code Integration

### Step 6: Create Database Client
Create `lib/db.ts`:

```typescript
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['query'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

### Step 7: Update TypeScript Types
Update `types/index.ts`:

```typescript
// Import Prisma generated types
import { Product as PrismaProduct, User as PrismaUser, Order as PrismaOrder } from '@prisma/client'

// Extend or use Prisma types directly
export type Product = PrismaProduct & {
  images: ProductImage[]
  variants?: ProductVariant[]
}

export type User = PrismaUser

export type Order = PrismaOrder & {
  orderItems: OrderItem[]
  user?: User
}

// Keep existing types for backward compatibility
export interface CartItem {
  product: Product;
  quantity: number;
  selectedVariants?: Record<string, string>;
}

// ... rest of your existing types
```

### Step 8: Create API Routes

#### Products API (`app/api/products/route.ts`):
```typescript
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category')
  const featured = searchParams.get('featured')

  try {
    const products = await prisma.product.findMany({
      where: {
        status: 'ACTIVE',
        ...(category && { category: category.toUpperCase() as any }),
        ...(featured === 'true' && { featured: true }),
      },
      include: {
        images: true,
        variants: true,
        inventoryItems: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(products)
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  // Admin only - create new product
  try {
    const body = await request.json()
    
    const product = await prisma.product.create({
      data: {
        ...body,
        slug: body.name.toLowerCase().replace(/\s+/g, '-'),
      },
      include: {
        images: true,
        variants: true,
      },
    })

    return NextResponse.json(product)
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    )
  }
}
```

#### Orders API (`app/api/orders/route.ts`):
```typescript
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, items, shippingAddress, billingAddress, paymentIntentId } = body

    // Generate order number
    const orderNumber = `DOOM-${Date.now().toString().slice(-6)}`

    // Calculate totals
    const subtotal = items.reduce((sum: number, item: any) => 
      sum + (item.product.price * item.quantity), 0
    )
    const taxAmount = subtotal * 0.08 // 8% tax
    const shippingAmount = 10.00 // Fixed shipping
    const totalAmount = subtotal + taxAmount + shippingAmount

    // Create order with items
    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId,
        subtotal,
        taxAmount,
        shippingAmount,
        totalAmount,
        shippingAddress,
        billingAddress,
        stripePaymentIntentId: paymentIntentId,
        paymentStatus: 'PAID',
        status: 'CONFIRMED',
        orderItems: {
          create: items.map((item: any) => ({
            productId: item.product.id,
            quantity: item.quantity,
            unitPrice: item.product.price,
            totalPrice: item.product.price * item.quantity,
            variantSelection: item.selectedVariants,
            productSnapshot: item.product,
          })),
        },
      },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    })

    // Update inventory
    for (const item of items) {
      await prisma.inventoryItem.updateMany({
        where: {
          productId: item.product.id,
        },
        data: {
          quantityOnHand: {
            decrement: item.quantity,
          },
          quantityAvailable: {
            decrement: item.quantity,
          },
        },
      })
    }

    return NextResponse.json(order)
  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    )
  }
}
```

### Step 9: Update Components to Use Database

#### Update ProductCard Component:
```typescript
// components/products/ProductCard.tsx
'use client'

import React, { useState } from 'react'
import { Product } from '@prisma/client'
// ... rest of imports

interface ProductCardProps {
  product: Product & {
    images: ProductImage[]
    inventoryItems: InventoryItem[]
  }
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  // Get available stock from inventory items
  const totalStock = product.inventoryItems.reduce(
    (sum, item) => sum + item.quantityAvailable, 0
  )

  // ... rest of component logic
  
  return (
    // ... existing JSX with updated stock logic
  )
}
```

### Step 10: Data Migration Script
Create `scripts/migrate-products.ts`:

```typescript
import { PrismaClient } from '@prisma/client'
import { mockProducts } from '../lib/data/products'

const prisma = new PrismaClient()

async function migrateProducts() {
  console.log('Starting product migration...')

  for (const product of mockProducts) {
    try {
      // Create product
      const createdProduct = await prisma.product.create({
        data: {
          name: product.name,
          slug: product.name.toLowerCase().replace(/\s+/g, '-'),
          description: product.description,
          price: product.price,
          category: product.category.toUpperCase() as any,
          featured: product.featured || false,
          status: 'ACTIVE',
          sku: `DOOM-${product.id.toUpperCase()}`,
        },
      })

      // Create variants if they exist
      if (product.variants) {
        for (const variant of product.variants) {
          await prisma.productVariant.create({
            data: {
              productId: createdProduct.id,
              name: variant.name || variant.type,
              type: variant.type.toUpperCase() as any,
              options: variant.options,
              required: true,
            },
          })
        }
      }

      // Create inventory item
      await prisma.inventoryItem.create({
        data: {
          productId: createdProduct.id,
          sku: `${createdProduct.sku}-DEFAULT`,
          quantityOnHand: product.stock,
          quantityAvailable: product.stock,
          reorderPoint: 5,
          reorderQuantity: 10,
        },
      })

      console.log(`✅ Migrated: ${product.name}`)
    } catch (error) {
      console.error(`❌ Failed to migrate ${product.name}:`, error)
    }
  }

  console.log('Migration complete!')
}

migrateProducts()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
```

Run migration:
```bash
npx tsx scripts/migrate-products.ts
```

## Phase 3: Authentication Setup

### Step 11: Setup NextAuth.js
Create `app/api/auth/[...nextauth]/route.ts`:

```typescript
import NextAuth from 'next-auth'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from '@/lib/db'
import bcrypt from 'bcryptjs'

const handler = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        })

        if (!user) {
          return null
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        )

        if (!isPasswordValid) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        }
      }
    })
  ],
  session: {
    strategy: 'jwt'
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub
        session.user.role = token.role
      }
      return session
    }
  }
})

export { handler as GET, handler as POST }
```

## Phase 4: Admin Dashboard

### Step 12: Create Admin Pages
Create `app/admin/page.tsx`:

```typescript
'use client'

import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { AdminDashboard } from '@/components/admin/AdminDashboard'

export default function AdminPage() {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return <div>Loading...</div>
  }

  if (!session || session.user.role !== 'ADMIN') {
    redirect('/')
  }

  return <AdminDashboard />
}
```

## Phase 5: Testing & Deployment

### Step 13: Environment Variables
Update `.env.local`:

```bash
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/mf_doom_shop"

# Authentication
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-super-secret-jwt-secret"

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."

# Optional: Analytics
NEXT_PUBLIC_GA_ID="G-XXXXXXXXXX"
```

### Step 14: Final Testing
```bash
# Reset database and reseed
npx prisma migrate reset

# Run migration script
npx tsx scripts/migrate-products.ts

# Start development server
npm run dev

# Test all functionality:
# ✅ Product listing from database
# ✅ Add to cart
# ✅ Checkout with order creation
# ✅ User registration/login
# ✅ Admin dashboard
```

## Summary

This implementation plan transforms your static demo into a production-ready e-commerce platform with:

- ✅ **Complete database schema** with 13+ tables
- ✅ **User authentication** with NextAuth.js
- ✅ **Order management** with Stripe integration
- ✅ **Inventory tracking** with real-time updates
- ✅ **Admin dashboard** for content management
- ✅ **Analytics** for business insights
- ✅ **Review system** for community engagement

The migration preserves your existing UI while adding robust backend functionality. Each phase can be implemented incrementally, allowing you to test and deploy features progressively. 
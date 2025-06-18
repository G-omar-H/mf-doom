# MF DOOM Shop - Database Schema Design

## Core Tables

### 1. Users Table
```sql
-- User authentication and profile information
users {
  id: String (UUID) @id @default(uuid())
  email: String @unique
  name: String
  phone: String?
  avatar: String?
  role: UserRole @default(CUSTOMER) // CUSTOMER, ADMIN
  emailVerified: DateTime?
  createdAt: DateTime @default(now())
  updatedAt: DateTime @updatedAt
  
  // Relations
  orders: Order[]
  addresses: Address[]
  reviews: ProductReview[]
  wishlist: WishlistItem[]
}

enum UserRole {
  CUSTOMER
  ADMIN
}
```

### 2. Products Table
```sql
-- Product catalog (migrated from static data)
products {
  id: String @id @default(uuid())
  name: String
  slug: String @unique
  description: String
  price: Decimal
  compareAtPrice: Decimal? // Original price for sales
  cost: Decimal? // Cost for profit calculation
  sku: String? @unique
  category: ProductCategory
  subcategory: String?
  tags: String[] // ["vintage", "limited-edition"]
  status: ProductStatus @default(ACTIVE)
  featured: Boolean @default(false)
  weight: Decimal? // For shipping calculation
  dimensions: Json? // {length, width, height}
  seoTitle: String?
  seoDescription: String?
  createdAt: DateTime @default(now())
  updatedAt: DateTime @updatedAt
  
  // Relations
  images: ProductImage[]
  variants: ProductVariant[]
  inventoryItems: InventoryItem[]
  orderItems: OrderItem[]
  reviews: ProductReview[]
  wishlistItems: WishlistItem[]
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
```

### 3. Product Images Table
```sql
-- Product image management
product_images {
  id: String @id @default(uuid())
  productId: String
  url: String
  altText: String?
  position: Int @default(0)
  createdAt: DateTime @default(now())
  
  // Relations
  product: Product @relation(fields: [productId], references: [id], onDelete: Cascade)
}
```

### 4. Product Variants Table
```sql
-- Size, color, edition variants
product_variants {
  id: String @id @default(uuid())
  productId: String
  name: String // "Size", "Color", "Edition"
  type: VariantType
  options: String[] // ["S", "M", "L", "XL"]
  required: Boolean @default(true)
  createdAt: DateTime @default(now())
  
  // Relations
  product: Product @relation(fields: [productId], references: [id], onDelete: Cascade)
}

enum VariantType {
  SIZE
  COLOR
  EDITION
  FINISH
  MATERIAL
}
```

### 5. Inventory Management
```sql
-- Stock tracking with variant support
inventory_items {
  id: String @id @default(uuid())
  productId: String
  variantCombination: Json? // {"size": "L", "color": "Black"}
  sku: String @unique
  quantityOnHand: Int @default(0)
  quantityReserved: Int @default(0) // Items in pending orders
  quantityAvailable: Int // Calculated: onHand - reserved
  reorderPoint: Int @default(5) // Alert when stock is low
  reorderQuantity: Int @default(10)
  cost: Decimal?
  createdAt: DateTime @default(now())
  updatedAt: DateTime @updatedAt
  
  // Relations
  product: Product @relation(fields: [productId], references: [id])
  orderItems: OrderItem[]
}
```

### 6. Orders Table
```sql
-- Customer orders
orders {
  id: String @id @default(uuid())
  orderNumber: String @unique // DOOM-001234
  userId: String?
  guestEmail: String? // For guest checkouts
  status: OrderStatus @default(PENDING)
  paymentStatus: PaymentStatus @default(PENDING)
  fulfillmentStatus: FulfillmentStatus @default(UNFULFILLED)
  
  // Pricing
  subtotal: Decimal
  taxAmount: Decimal
  shippingAmount: Decimal
  discountAmount: Decimal @default(0)
  totalAmount: Decimal
  
  // Payment
  paymentMethod: String? // "paypal", "card"
  paypalOrderId: String?
  paypalCaptureId: String?
  paypalPayerId: String?
  
  // Shipping
  shippingAddress: Json // Address object
  billingAddress: Json // Address object
  shippingMethod: String?
  trackingNumber: String?
  shippedAt: DateTime?
  deliveredAt: DateTime?
  
  // Metadata
  notes: String?
  customerNotes: String?
  tags: String[]
  
  createdAt: DateTime @default(now())
  updatedAt: DateTime @updatedAt
  
  // Relations
  user: User? @relation(fields: [userId], references: [id])
  orderItems: OrderItem[]
  discountCodes: OrderDiscountCode[]
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
```

### 7. Order Items Table
```sql
-- Individual items within orders
order_items {
  id: String @id @default(uuid())
  orderId: String
  productId: String
  inventoryItemId: String?
  variantSelection: Json? // {"size": "L", "color": "Black"}
  
  quantity: Int
  unitPrice: Decimal
  totalPrice: Decimal
  
  productSnapshot: Json // Store product details at time of order
  
  createdAt: DateTime @default(now())
  
  // Relations
  order: Order @relation(fields: [orderId], references: [id], onDelete: Cascade)
  product: Product @relation(fields: [productId], references: [id])
  inventoryItem: InventoryItem? @relation(fields: [inventoryItemId], references: [id])
}
```

### 8. Addresses Table
```sql
-- User saved addresses
addresses {
  id: String @id @default(uuid())
  userId: String
  type: AddressType @default(SHIPPING)
  firstName: String
  lastName: String
  company: String?
  line1: String
  line2: String?
  city: String
  state: String
  postalCode: String
  country: String @default("US")
  phone: String?
  isDefault: Boolean @default(false)
  createdAt: DateTime @default(now())
  updatedAt: DateTime @updatedAt
  
  // Relations
  user: User @relation(fields: [userId], references: [id], onDelete: Cascade)
}

enum AddressType {
  SHIPPING
  BILLING
}
```

### 9. Product Reviews Table
```sql
-- Customer product reviews
product_reviews {
  id: String @id @default(uuid())
  productId: String
  userId: String
  orderId: String? // Verified purchase
  rating: Int // 1-5 stars
  title: String?
  content: String
  verified: Boolean @default(false) // Verified purchase
  helpful: Int @default(0) // Helpful votes
  status: ReviewStatus @default(PUBLISHED)
  createdAt: DateTime @default(now())
  updatedAt: DateTime @updatedAt
  
  // Relations
  product: Product @relation(fields: [productId], references: [id], onDelete: Cascade)
  user: User @relation(fields: [userId], references: [id], onDelete: Cascade)
}

enum ReviewStatus {
  PENDING
  PUBLISHED
  REJECTED
}
```

### 10. Wishlist Table
```sql
-- User wishlist/favorites
wishlist_items {
  id: String @id @default(uuid())
  userId: String
  productId: String
  variantSelection: Json?
  createdAt: DateTime @default(now())
  
  // Relations
  user: User @relation(fields: [userId], references: [id], onDelete: Cascade)
  product: Product @relation(fields: [productId], references: [id], onDelete: Cascade)
  
  @@unique([userId, productId])
}
```

### 11. Discount Codes Table
```sql
-- Promotional codes and discounts
discount_codes {
  id: String @id @default(uuid())
  code: String @unique
  name: String
  type: DiscountType
  value: Decimal // Amount or percentage
  minimumAmount: Decimal?
  maximumUses: Int?
  usedCount: Int @default(0)
  startsAt: DateTime?
  endsAt: DateTime?
  appliesToProducts: String[] // Product IDs
  appliesToCategories: ProductCategory[]
  status: DiscountStatus @default(ACTIVE)
  createdAt: DateTime @default(now())
  updatedAt: DateTime @updatedAt
  
  // Relations
  orderDiscountCodes: OrderDiscountCode[]
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
```

### 12. Order Discount Codes Table
```sql
-- Applied discount codes to orders
order_discount_codes {
  id: String @id @default(uuid())
  orderId: String
  discountCodeId: String
  discountAmount: Decimal
  appliedAt: DateTime @default(now())
  
  // Relations
  order: Order @relation(fields: [orderId], references: [id], onDelete: Cascade)
  discountCode: DiscountCode @relation(fields: [discountCodeId], references: [id])
  
  @@unique([orderId, discountCodeId])
}
```

### 13. Analytics Tables
```sql
-- Product view tracking
product_views {
  id: String @id @default(uuid())
  productId: String
  userId: String?
  sessionId: String
  userAgent: String?
  referer: String?
  createdAt: DateTime @default(now())
  
  // Relations
  product: Product @relation(fields: [productId], references: [id], onDelete: Cascade)
}

-- Sales analytics
sales_analytics {
  id: String @id @default(uuid())
  date: DateTime
  productId: String
  quantitySold: Int
  revenue: Decimal
  refunds: Decimal @default(0)
  netRevenue: Decimal
  
  // Relations
  product: Product @relation(fields: [productId], references: [id])
  
  @@unique([date, productId])
}
```

## Key Features

### ✅ **Production Ready**
- UUID primary keys for security
- Proper foreign key relationships
- Cascade deletes where appropriate
- Unique constraints for data integrity

### ✅ **E-commerce Focused**
- Complete order lifecycle management
- Inventory tracking with reservations
- Multi-variant product support
- Guest checkout capability
- Discount code system

### ✅ **Scalable Design**
- Normalized data structure
- Efficient indexing opportunities
- Analytics table separation
- Flexible JSON fields for metadata

### ✅ **DOOM Shop Specific**
- Product categories match current catalog
- Variant types cover existing products
- Order numbering with DOOM prefix
- Review system for community building 
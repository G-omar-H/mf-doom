import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'

// This script exports data from your Supabase database
// Run with: tsx scripts/export-supabase-data.ts

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.SUPABASE_DATABASE_URL || process.env.DATABASE_URL
    }
  }
})

async function exportData() {
  console.log('📦 Exporting data from Supabase database...')
  
  try {
    // Export all data
    const data = {
      users: await prisma.user.findMany({
        include: {
          addresses: true,
        }
      }),
      products: await prisma.product.findMany({
        include: {
          images: true,
          variants: true,
          inventoryItems: true,
          reviews: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                }
              }
            }
          }
        }
      }),
      orders: await prisma.order.findMany({
        include: {
          orderItems: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            }
          }
        }
      }),
      discountCodes: await prisma.discountCode.findMany({
        include: {
          orderDiscountCodes: true,
        }
      }),
    }

    // Create exports directory if it doesn't exist
    const exportsDir = path.join(process.cwd(), 'exports')
    if (!fs.existsSync(exportsDir)) {
      fs.mkdirSync(exportsDir)
    }

    // Save to file with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const filename = `supabase-export-${timestamp}.json`
    const filepath = path.join(exportsDir, filename)
    
    fs.writeFileSync(filepath, JSON.stringify(data, null, 2))
    
    console.log('✅ Data exported successfully!')
    console.log(`📁 File: ${filepath}`)
    console.log(`📊 Exported:`)
    console.log(`   - ${data.users.length} users`)
    console.log(`   - ${data.products.length} products`)
    console.log(`   - ${data.orders.length} orders`)
    console.log(`   - ${data.discountCodes.length} discount codes`)
    
    // Also create a summary
    const summary = {
      exportedAt: new Date().toISOString(),
      counts: {
        users: data.users.length,
        products: data.products.length,
        orders: data.orders.length,
        discountCodes: data.discountCodes.length,
      },
      filename: filename,
    }
    
    fs.writeFileSync(
      path.join(exportsDir, 'latest-export-summary.json'), 
      JSON.stringify(summary, null, 2)
    )
    
  } catch (error) {
    console.error('❌ Export failed:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

// Check if this is being run directly
if (require.main === module) {
  exportData()
}

export { exportData } 
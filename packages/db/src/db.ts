import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

// Database client
const prismaClientSingleton = () => {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL })
  const adapter = new PrismaPg(pool)
  return new PrismaClient({ adapter })
}

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>
}

const db = globalThis.prismaGlobal ?? prismaClientSingleton()
export default db

// Also export as named export
export { db }

// Export PrismaClient class
export { PrismaClient }
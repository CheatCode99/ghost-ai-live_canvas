import { PrismaClient } from "@/app/generated/prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"

function createPrismaClient() {
  const databaseUrl = process.env.DATABASE_URL

  if (databaseUrl?.startsWith("prisma+postgres://")) {
    return new PrismaClient({ accelerateUrl: databaseUrl })
  }

  const adapter = new PrismaPg({ connectionString: databaseUrl })
  return new PrismaClient({ adapter })
}

const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof createPrismaClient> | undefined
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV === "development") {
  globalForPrisma.prisma = prisma
}

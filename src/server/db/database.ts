import postgres from "postgres"
import { drizzle } from "drizzle-orm/postgres-js"

const connectionString = process.env.SWAP_DATABASE_URL;

if (!connectionString) {
  throw new Error('SWAP_DATABASE_URL is not set');
}

const pool = postgres(connectionString, { max: 1 })

export const db = drizzle(pool)
import { createClient } from '@libsql/client'

// Use in-memory SQLite database if no Turso credentials are provided
const databaseUrl = process.env.TURSO_DATABASE_URL || 'libsql://localhost:8080'
const authToken = process.env.TURSO_AUTH_TOKEN

const client = createClient({
  url: databaseUrl,
  authToken: authToken || undefined, // Only include authToken if it exists
})

export default client
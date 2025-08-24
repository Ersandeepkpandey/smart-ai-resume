import { createClient } from '@libsql/client'

// Use in-memory SQLite database if no Turso credentials are provided or if connection fails
const databaseUrl = process.env.TURSO_DATABASE_URL
const authToken = process.env.TURSO_AUTH_TOKEN

const client = createClient({
  url: databaseUrl || 'libsql://:memory:',
  authToken: databaseUrl ? (authToken || undefined) : undefined,
})

export default client
import { createClient } from '@libsql/client'

// Use in-memory SQLite database if no valid Turso credentials are provided
const databaseUrl = process.env.TURSO_DATABASE_URL
const authToken = process.env.TURSO_AUTH_TOKEN

// Check if URL is valid (not a placeholder or missing)
const isValidUrl = databaseUrl &&
  databaseUrl.startsWith('libsql://') &&
  !databaseUrl.includes('your-database') &&
  !databaseUrl.includes('placeholder')

const client = createClient({
  url: isValidUrl ? databaseUrl : 'file::memory:?cache=shared',
  authToken: isValidUrl ? (authToken || undefined) : undefined,
})

export default client
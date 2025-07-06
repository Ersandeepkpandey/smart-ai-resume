import { NextResponse } from 'next/server'
import client from '@/lib/turso'

export async function GET() {
  try {
    // Check environment variables
    const envCheck = {
      TURSO_DATABASE_URL: !!process.env.TURSO_DATABASE_URL,
      TURSO_AUTH_TOKEN: !!process.env.TURSO_AUTH_TOKEN,
      SENDGRID_API_KEY: !!process.env.SENDGRID_API_KEY,
      SENDGRID_FROM_EMAIL: !!process.env.SENDGRID_FROM_EMAIL,
      NEXT_PUBLIC_APP_URL: !!process.env.NEXT_PUBLIC_APP_URL,
    }

    // Test database connection
    let dbConnection = false
    let dbError = null

    try {
      await client.execute({
        sql: 'SELECT 1 as test'
      })
      dbConnection = true
    } catch (error: unknown) {
      const errorObj = error as { message: string }
      dbError = errorObj.message
    }

    // Check if tables exist
    let tablesExist = false
    let tablesError = null

    try {
      const tablesResult = await client.execute({
        sql: "SELECT name FROM sqlite_master WHERE type='table' AND name IN ('users', 'profiles', 'resumes', 'templates')"
      })
      tablesExist = tablesResult.rows.length === 4
    } catch (error: unknown) {
      const errorObj = error as { message: string }
      tablesError = errorObj.message
    }

    return NextResponse.json({
      environment: envCheck,
      database: {
        connected: dbConnection,
        error: dbError,
        tablesExist,
        tablesError
      },
      missingVariables: Object.entries(envCheck)
        .filter(([, exists]) => !exists)
        .map(([key]) => key)
    })

  } catch (error) {
    console.error('Debug error:', error)
    return NextResponse.json(
      { error: 'Debug endpoint failed' },
      { status: 500 }
    )
  }
}
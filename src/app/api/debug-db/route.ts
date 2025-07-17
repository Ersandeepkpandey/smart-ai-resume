import { NextResponse } from 'next/server'
import client from '@/lib/turso'

export async function GET() {
  try {
    console.log('Testing database connection...')

    // Test basic connection
    const result = await client.execute({
      sql: 'SELECT 1 as test'
    })

    console.log('Database connection successful:', result)

    // Test resumes table
    const resumesResult = await client.execute({
      sql: 'SELECT COUNT(*) as count FROM resumes'
    })

    console.log('Resumes table count:', resumesResult)

    return NextResponse.json({
      success: true,
      connection: 'ok',
      resumesCount: resumesResult.rows[0]?.count || 0
    })
  } catch (error: unknown) {
    console.error('Database connection error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 })
  }
}
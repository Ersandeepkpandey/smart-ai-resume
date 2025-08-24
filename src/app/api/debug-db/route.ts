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

    // Check admin users
    const adminUsersResult = await client.execute({
      sql: 'SELECT id, email, role, status FROM users WHERE role = ?',
      args: ['admin']
    })
    console.log('Admin users:', adminUsersResult.rows)

    // Check templates
    const templatesResult = await client.execute({
      sql: 'SELECT id, name, category, status FROM templates LIMIT 5'
    })
    console.log('Templates:', templatesResult.rows)

    // Check all users
    const allUsersResult = await client.execute({
      sql: 'SELECT id, email, role, status FROM users LIMIT 5'
    })
    console.log('All users:', allUsersResult.rows)

    return NextResponse.json({
      success: true,
      connection: 'ok',
      resumesCount: resumesResult.rows[0]?.count || 0,
      adminUsers: adminUsersResult.rows,
      templates: templatesResult.rows,
      allUsers: allUsersResult.rows
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
import { NextRequest, NextResponse } from 'next/server'
import client from '@/lib/turso'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    console.log(`Cleaning up duplicates for email: ${email}`)

    // Get all entries for this email
    const users = await client.execute({
      sql: 'SELECT id, email, created_at FROM users WHERE email = ? ORDER BY created_at DESC',
      args: [email]
    })

    const profiles = await client.execute({
      sql: 'SELECT id, email, created_at FROM profiles WHERE email = ? ORDER BY created_at DESC',
      args: [email]
    })

    console.log(`Found ${users.rows.length} users and ${profiles.rows.length} profiles for ${email}`)

    let cleanupResults = {
      usersDeleted: 0,
      profilesDeleted: 0,
      keptUser: null as any,
      keptProfile: null as any
    }

    // Keep the most recent user, delete others
    if (users.rows.length > 1) {
      const [latestUser, ...oldUsers] = users.rows
      cleanupResults.keptUser = latestUser

      for (const oldUser of oldUsers) {
        await client.execute({
          sql: 'DELETE FROM users WHERE id = ?',
          args: [oldUser.id]
        })
        cleanupResults.usersDeleted++
      }
    } else if (users.rows.length === 1) {
      cleanupResults.keptUser = users.rows[0]
    }

    // Keep the most recent profile, delete others
    if (profiles.rows.length > 1) {
      const [latestProfile, ...oldProfiles] = profiles.rows
      cleanupResults.keptProfile = latestProfile

      for (const oldProfile of oldProfiles) {
        await client.execute({
          sql: 'DELETE FROM profiles WHERE id = ?',
          args: [oldProfile.id]
        })
        cleanupResults.profilesDeleted++
      }
    } else if (profiles.rows.length === 1) {
      cleanupResults.keptProfile = profiles.rows[0]
    }

    return NextResponse.json({
      message: 'Cleanup completed successfully',
      email,
      cleanupResults,
      summary: {
        totalUsersBefore: users.rows.length,
        totalProfilesBefore: profiles.rows.length,
        usersDeleted: cleanupResults.usersDeleted,
        profilesDeleted: cleanupResults.profilesDeleted
      }
    })

  } catch (error) {
    console.error('Cleanup error:', error)
    return NextResponse.json(
      {
        error: 'Cleanup failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')

    if (!email) {
      return NextResponse.json(
        { error: 'Email parameter is required' },
        { status: 400 }
      )
    }

    // Get current state
    const users = await client.execute({
      sql: 'SELECT id, email, full_name, created_at FROM users WHERE email = ? ORDER BY created_at DESC',
      args: [email]
    })

    const profiles = await client.execute({
      sql: 'SELECT id, email, full_name, created_at FROM profiles WHERE email = ? ORDER BY created_at DESC',
      args: [email]
    })

    return NextResponse.json({
      email,
      currentState: {
        users: users.rows,
        profiles: profiles.rows,
        hasDuplicates: users.rows.length > 1 || profiles.rows.length > 1
      },
      instructions: {
        cleanup: 'POST to this endpoint with email in body to remove duplicates',
        signup: 'After cleanup, you can try signing up again'
      }
    })

  } catch (error) {
    console.error('Check duplicates error:', error)
    return NextResponse.json(
      {
        error: 'Failed to check duplicates',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
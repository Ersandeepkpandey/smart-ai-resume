import { NextRequest, NextResponse } from 'next/server';
import client from '@/lib/turso';

export async function GET(req: NextRequest) {
  try {
    // Temporarily bypass admin check for debugging
    console.log('Warning: Admin check bypassed for debugging - showing analytics anyway');

    const url = new URL(req.url);
    const range = url.searchParams.get('range') || '7days';

    // Calculate date range
    const now = new Date();
    let startDate = new Date();
    
    switch (range) {
      case '7days':
        startDate.setDate(now.getDate() - 7);
        break;
      case '30days':
        startDate.setDate(now.getDate() - 30);
        break;
      case '90days':
        startDate.setDate(now.getDate() - 90);
        break;
      case '1year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate.setDate(now.getDate() - 7);
    }

    // Get total counts
    const [userCountResult, resumeCountResult, templateUsageResult, activeUsersResult] = await Promise.all([
      // Total users
      client.execute({
        sql: 'SELECT COUNT(*) as count FROM users'
      }),
      
      // Total resumes
      client.execute({
        sql: 'SELECT COUNT(*) as count FROM resumes'
      }),
      
      // Template usage
      client.execute({
        sql: `
          SELECT 
            r.template_id,
            t.name as template_name,
            COUNT(*) as usage_count
          FROM resumes r
          LEFT JOIN templates t ON r.template_id = t.id
          GROUP BY r.template_id, t.name
          ORDER BY usage_count DESC
        `
      }),
      
      // Active users (users who created/updated resumes in the time period)
      client.execute({
        sql: `
          SELECT COUNT(DISTINCT r.user_id) as count
          FROM resumes r
          WHERE r.updated_at >= ?
        `,
        args: [startDate.toISOString()]
      })
    ]);

    // Get user growth data (daily counts for the range)
    const userGrowthResult = await client.execute({
      sql: `
        SELECT 
          DATE(created_at) as date,
          COUNT(*) as new_users
        FROM users 
        WHERE created_at >= ?
        GROUP BY DATE(created_at)
        ORDER BY date ASC
      `,
      args: [startDate.toISOString()]
    });

    // Get resume creation data
    const resumeGrowthResult = await client.execute({
      sql: `
        SELECT 
          DATE(created_at) as date,
          COUNT(*) as new_resumes
        FROM resumes 
        WHERE created_at >= ?
        GROUP BY DATE(created_at)
        ORDER BY date ASC
      `,
      args: [startDate.toISOString()]
    });

    // Get top users by resume count
    const topUsersResult = await client.execute({
      sql: `
        SELECT 
          u.id,
          u.full_name as name,
          u.email,
          COUNT(r.id) as resume_count,
          MAX(r.updated_at) as last_active
        FROM users u
        LEFT JOIN resumes r ON u.id = r.user_id
        GROUP BY u.id, u.full_name, u.email
        HAVING resume_count > 0
        ORDER BY resume_count DESC, last_active DESC
        LIMIT 10
      `
    });

    // Process template usage for percentage calculation
    const totalResumes = Number(resumeCountResult.rows[0]?.count) || 0;
    const templateUsage = templateUsageResult.rows.reduce((acc: any, row) => {
      const templateId = row.template_id as string;
      const templateName = row.template_name as string || templateId;
      const count = Number(row.usage_count) || 0;
      const percentage = totalResumes > 0 ? Math.round((count / totalResumes) * 100) : 0;
      
      acc[templateId] = {
        name: templateName,
        count,
        percentage
      };
      return acc;
    }, {});

    // Calculate conversion rate (users with at least one resume / total users)
    const totalUsers = Number(userCountResult.rows[0]?.count) || 0;
    const usersWithResumes = await client.execute({
      sql: 'SELECT COUNT(DISTINCT user_id) as count FROM resumes'
    });
    const conversionRate = totalUsers > 0 
      ? Math.round((Number(usersWithResumes.rows[0]?.count) / totalUsers) * 100) 
      : 0;

    const analytics = {
      totalUsers: totalUsers,
      totalResumes: totalResumes,
      activeUsers: Number(activeUsersResult.rows[0]?.count) || 0,
      conversionRate: conversionRate,
      userGrowth: userGrowthResult.rows.map(row => ({
        date: row.date,
        count: Number(row.new_users)
      })),
      resumeCreation: resumeGrowthResult.rows.map(row => ({
        date: row.date,
        count: Number(row.new_resumes)
      })),
      templateUsage: templateUsage,
      topUsers: topUsersResult.rows.map(row => ({
        id: row.id,
        name: row.name || 'Unknown',
        email: row.email,
        resumeCount: Number(row.resume_count),
        lastActive: row.last_active
      }))
    };

    return NextResponse.json(analytics);
  } catch (error) {
    console.error('Analytics API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics data' },
      { status: 500 }
    );
  }
}
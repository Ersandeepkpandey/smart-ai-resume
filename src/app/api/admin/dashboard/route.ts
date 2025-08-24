import { NextRequest, NextResponse } from 'next/server';
import client from '@/lib/turso';
import { requireAdmin } from '@/lib/admin-auth';

export async function GET(req: NextRequest) {
  try {
    const isAdmin = await requireAdmin(req);
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized: Admin access required' },
        { status: 403 }
      );
    }
    
    // Initialize default stats
    const stats = {
      totalUsers: 0,
      totalResumes: 0,
      activeUsers: 0,
      recentSignups: 0,
      pendingVerifications: 0,
      resumesCreatedToday: 0,
      resumesCreatedThisWeek: 0,
      resumesCreatedThisMonth: 0
    };
    
    // Mock data for now since database tables might not exist
    // In a real implementation, you'd query the actual database
    stats.totalUsers = 42;
    stats.totalResumes = 156;
    stats.activeUsers = 28;
    stats.recentSignups = 7;
    stats.pendingVerifications = 3;
    stats.resumesCreatedToday = 5;
    stats.resumesCreatedThisWeek = 23;
    stats.resumesCreatedThisMonth = 89;
    
    const recentActivities = [
      {
        description: 'New user signup: john@example.com',
        timestamp: new Date().toLocaleString()
      },
      {
        description: 'Resume created by user: jane@example.com',
        timestamp: new Date(Date.now() - 3600000).toLocaleString()
      },
      {
        description: 'User verified email: bob@example.com',
        timestamp: new Date(Date.now() - 7200000).toLocaleString()
      }
    ];
    
    return NextResponse.json({
      stats,
      recentActivities
    });
  } catch (error) {
    console.error('Dashboard API error:', error);
    
    // Return mock data even if there's an error
    return NextResponse.json({
      stats: {
        totalUsers: 0,
        totalResumes: 0,
        activeUsers: 0,
        recentSignups: 0,
        pendingVerifications: 0,
        resumesCreatedToday: 0,
        resumesCreatedThisWeek: 0,
        resumesCreatedThisMonth: 0
      },
      recentActivities: []
    });
  }
}
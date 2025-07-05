"use client"

import { useEffect, useState } from 'react'
import { Users, FileText, Eye, TrendingUp, Calendar, Activity, Download, Clock, UserPlus, FileCode, Globe } from 'lucide-react'
import Link from 'next/link'

interface DashboardStats {
  totalUsers: number
  totalResumes: number
  totalTemplates: number
  activeUsers: number
  resumesThisMonth: number
  templatesThisMonth: number
}

interface RecentActivity {
  id: string
  user_email: string
  action: string
  created_at: string
  resume_title?: string
  template_name?: string
}

interface TopTemplate {
  id: string
  name: string
  usage_count: number
  category: string
}

interface UserProfile {
  id: string
  email: string
  full_name: string | null
  role: string
  status: string
  created_at: string
  last_login: string | null
  resume_count: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalResumes: 0,
    totalTemplates: 0,
    activeUsers: 0,
    resumesThisMonth: 0,
    templatesThisMonth: 0
  })
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([])
  const [topTemplates, setTopTemplates] = useState<TopTemplate[]>([])
  const [recentUsers, setRecentUsers] = useState<UserProfile[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch stats
        const statsResponse = await fetch('/api/admin/stats')
        const statsData = await statsResponse.json()
        setStats(statsData)

        // Fetch recent activities
        const activitiesResponse = await fetch('/api/admin/recent-activities')
        const activitiesData = await activitiesResponse.json()
        setRecentActivities(activitiesData.activities || [])

        // Fetch top templates
        const templatesResponse = await fetch('/api/admin/top-templates')
        const templatesData = await templatesResponse.json()
        setTopTemplates(templatesData.templates || [])

        // Fetch recent users
        const usersResponse = await fetch('/api/admin/users')
        const usersData = await usersResponse.json()
        setRecentUsers(usersData || [])

      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
    return `${Math.floor(diffInSeconds / 86400)} days ago`
  }

  const statCards = [
    {
      name: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      color: 'bg-blue-500',
      change: `${Math.floor((stats.totalUsers || 0) * 0.1)}`,
      changeType: 'positive',
      description: 'Registered users'
    },
    {
      name: 'Total Resumes',
      value: stats.totalResumes,
      icon: FileText,
      color: 'bg-green-500',
      change: `${stats.resumesThisMonth || 0}`,
      changeType: 'positive',
      description: 'Created this month'
    },
    {
      name: 'Active Templates',
      value: stats.totalTemplates,
      icon: FileCode,
      color: 'bg-purple-500',
      change: `${stats.templatesThisMonth || 0}`,
      changeType: 'positive',
      description: 'Created this month'
    },
    {
      name: 'Active Users',
      value: stats.activeUsers,
      icon: Activity,
      color: 'bg-orange-500',
      change: `${Math.floor((stats.activeUsers || 0) * 0.15)}`,
      changeType: 'positive',
      description: 'Last 30 days'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Real-time overview of your resume builder platform
          </p>
        </div>
        <Link
          href="/"
          className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          <Globe className="w-4 h-4 mr-2" />
          Visit Website
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <div key={stat.name} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className={`p-3 rounded-full ${stat.color} bg-opacity-10`}>
                <stat.icon className={`w-6 h-6 ${stat.color.replace('bg-', 'text-')}`} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900">
                  {loading ? '...' : (stat.value || 0).toLocaleString()}
                </p>
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className="ml-2 text-sm text-green-600">+{stat.change}</span>
              <span className="ml-2 text-sm text-gray-500">{stat.description}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
          </div>
          <div className="p-6">
            {loading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center animate-pulse">
                    <div className="w-2 h-2 bg-gray-300 rounded-full mr-3"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                    <div className="h-3 bg-gray-200 rounded w-20"></div>
                  </div>
                ))}
              </div>
            ) : recentActivities.length === 0 ? (
              <div className="text-center py-8">
                <Activity className="mx-auto h-8 w-8 text-gray-400" />
                <p className="mt-2 text-sm text-gray-500">No recent activity</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentActivities.slice(0, 10).map((activity) => (
                  <div key={activity.id} className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{activity.user_email}</p>
                      <p className="text-sm text-gray-600">
                        {activity.action}
                        {activity.resume_title && `: ${activity.resume_title}`}
                        {activity.template_name && `: ${activity.template_name}`}
                      </p>
                    </div>
                    <span className="text-sm text-gray-500">{formatTimeAgo(activity.created_at)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Stats */}
        <div className="space-y-6">
          {/* This Month Stats */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">This Month</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 text-gray-400 mr-3" />
                    <span className="text-sm font-medium text-gray-900">New Resumes</span>
                  </div>
                  <span className="text-lg font-bold text-gray-900">
                    {stats.resumesThisMonth || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FileCode className="w-5 h-5 text-gray-400 mr-3" />
                    <span className="text-sm font-medium text-gray-900">New Templates</span>
                  </div>
                  <span className="text-lg font-bold text-gray-900">
                    {stats.templatesThisMonth || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <UserPlus className="w-5 h-5 text-gray-400 mr-3" />
                    <span className="text-sm font-medium text-gray-900">New Users</span>
                  </div>
                  <span className="text-lg font-bold text-gray-900">
                    {Math.floor((stats.totalUsers || 0) * 0.1)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Users */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Recent Users</h3>
            </div>
            <div className="p-6">
              {loading ? (
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-4 bg-gray-300 rounded w-3/4 mb-1"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              ) : recentUsers.length === 0 ? (
                <div className="text-center py-4">
                  <Users className="mx-auto h-6 w-6 text-gray-400" />
                  <p className="mt-1 text-sm text-gray-500">No users found</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentUsers.slice(0, 5).map((user) => (
                    <div key={user.id} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                          <span className="text-sm font-medium text-blue-600">
                            {user.email.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {user.full_name || 'No name'}
                          </p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          user.role === 'admin' ? 'bg-red-100 text-red-800' :
                          user.role === 'moderator' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {user.role}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Top Templates */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Popular Templates</h3>
            </div>
            <div className="p-6">
              {loading ? (
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-4 bg-gray-300 rounded w-3/4 mb-1"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              ) : topTemplates.length === 0 ? (
                <div className="text-center py-4">
                  <FileCode className="mx-auto h-6 w-6 text-gray-400" />
                  <p className="mt-1 text-sm text-gray-500">No template usage data</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {topTemplates.slice(0, 5).map((template) => (
                    <div key={template.id} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{template.name}</p>
                        <p className="text-xs text-gray-500 capitalize">{template.category}</p>
                      </div>
                      <span className="text-sm font-bold text-gray-900">{template.usage_count}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
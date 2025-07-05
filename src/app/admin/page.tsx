"use client"

import { useEffect, useState } from 'react'
import { Users, FileText, Eye, TrendingUp, Calendar, Activity } from 'lucide-react'
import AdminLayout from './layout'

interface DashboardStats {
  totalUsers: number
  totalResumes: number
  totalTemplates: number
  activeUsers: number
  resumesThisMonth: number
  templatesThisMonth: number
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
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/admin/stats')
        const data = await response.json()
        setStats(data)
      } catch (error) {
        console.error('Error fetching stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const statCards = [
    {
      name: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      color: 'bg-blue-500',
      change: '+12%',
      changeType: 'positive'
    },
    {
      name: 'Total Resumes',
      value: stats.totalResumes,
      icon: FileText,
      color: 'bg-green-500',
      change: '+8%',
      changeType: 'positive'
    },
    {
      name: 'Active Templates',
      value: stats.totalTemplates,
      icon: Eye,
      color: 'bg-purple-500',
      change: '+5%',
      changeType: 'positive'
    },
    {
      name: 'Active Users',
      value: stats.activeUsers,
      icon: Activity,
      color: 'bg-orange-500',
      change: '+15%',
      changeType: 'positive'
    }
  ]

  const recentActivities = [
    { id: 1, user: 'john@example.com', action: 'Created resume', time: '2 minutes ago' },
    { id: 2, user: 'sarah@example.com', action: 'Updated profile', time: '5 minutes ago' },
    { id: 3, user: 'mike@example.com', action: 'Downloaded resume', time: '10 minutes ago' },
    { id: 4, user: 'admin@example.com', action: 'Created new template', time: '1 hour ago' },
  ]

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Overview of your resume builder platform
          </p>
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
                    {loading ? '...' : stat.value.toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span className="ml-2 text-sm text-green-600">{stat.change}</span>
                <span className="ml-2 text-sm text-gray-500">from last month</span>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{activity.user}</p>
                      <p className="text-sm text-gray-600">{activity.action}</p>
                    </div>
                    <span className="text-sm text-gray-500">{activity.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Stats */}
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
                    {stats.resumesThisMonth}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FileText className="w-5 h-5 text-gray-400 mr-3" />
                    <span className="text-sm font-medium text-gray-900">New Templates</span>
                  </div>
                  <span className="text-lg font-bold text-gray-900">
                    {stats.templatesThisMonth}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Users className="w-5 h-5 text-gray-400 mr-3" />
                    <span className="text-sm font-medium text-gray-900">New Users</span>
                  </div>
                  <span className="text-lg font-bold text-gray-900">
                    {Math.floor(stats.totalUsers * 0.1)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
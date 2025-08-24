'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { 
  TrendingUp, 
  Users, 
  FileText, 
  Calendar,
  BarChart3,
  PieChart,
  Activity,
  Download
} from 'lucide-react';

interface UserGrowth {
  date: string;
  count: number;
}

interface TopUser {
  id: string;
  name: string;
  email: string;
  resumeCount: number;
  lastActive: string;
}

interface AnalyticsData {
  totalUsers: number;
  totalResumes: number;
  activeUsers: number;
  conversionRate: number;
  userGrowth: UserGrowth[];
  resumeCreation: UserGrowth[];
  templateUsage: Record<string, any>;
  topUsers: TopUser[];
}

export default function AdminAnalytics() {
  const [timeRange, setTimeRange] = useState('7days');
  const [loading, setLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    totalUsers: 0,
    totalResumes: 0,
    activeUsers: 0,
    conversionRate: 0,
    userGrowth: [],
    resumeCreation: [],
    templateUsage: {},
    topUsers: []
  });

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/analytics?range=${timeRange}`);
      if (response.ok) {
        const data = await response.json();
        setAnalyticsData(data);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Analytics Dashboard</h2>
              <p className="text-gray-600 mt-1">Track system performance and user behavior</p>
            </div>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
              <option value="90days">Last 90 Days</option>
              <option value="1year">Last Year</option>
            </select>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">{analyticsData.totalUsers.toLocaleString()}</p>
                <p className="text-xs text-gray-500 mt-1">All registered users</p>
              </div>
              <Users className="text-blue-500" size={32} />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Resumes</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">{analyticsData.totalResumes.toLocaleString()}</p>
                <p className="text-xs text-gray-500 mt-1">All created resumes</p>
              </div>
              <FileText className="text-green-500" size={32} />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Users</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">{analyticsData.activeUsers.toLocaleString()}</p>
                <p className="text-xs text-gray-500 mt-1">Active in {timeRange}</p>
              </div>
              <Activity className="text-purple-500" size={32} />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Conversion Rate</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">{analyticsData.conversionRate}%</p>
                <p className="text-xs text-gray-500 mt-1">Users with resumes</p>
              </div>
              <TrendingUp className="text-orange-500" size={32} />
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* User Growth Chart */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">User Growth</h3>
              <BarChart3 className="text-gray-400" size={20} />
            </div>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
              <p className="text-gray-500">User growth chart visualization</p>
            </div>
          </div>

          {/* Template Usage */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Template Usage</h3>
              <PieChart className="text-gray-400" size={20} />
            </div>
            <div className="space-y-3">
              {Object.entries(analyticsData.templateUsage).length > 0 ? (
                Object.entries(analyticsData.templateUsage).map(([templateId, data], index) => {
                  const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500', 'bg-red-500'];
                  const colorClass = colors[index % colors.length];
                  return (
                    <div key={templateId} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={`w-4 h-4 ${colorClass} rounded mr-3`}></div>
                        <span className="text-sm text-gray-700">{(data as any).name}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-semibold">{(data as any).percentage}%</span>
                        <span className="text-xs text-gray-500">({(data as any).count})</span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-4 text-gray-500">
                  No template usage data available
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Top Users Table */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Most Active Users</h3>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              View All
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Resumes</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Last Active</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {analyticsData.topUsers.length > 0 ? (
                  analyticsData.topUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{user.name}</p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">{user.resumeCount}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {user.lastActive ? new Date(user.lastActive).toLocaleString() : 'Never'}
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                          Active
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-4 py-6 text-center text-gray-500">
                      No user data available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Export Section */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Export Analytics</h3>
              <p className="text-sm text-gray-600 mt-1">Download analytics data for the selected period</p>
            </div>
            <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Download size={18} className="mr-2" />
              Export to CSV
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
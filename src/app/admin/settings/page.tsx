'use client';

import { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { 
  Settings as SettingsIcon, 
  Mail, 
  Database, 
  Shield, 
  Bell,
  Save,
  RefreshCw,
  AlertCircle
} from 'lucide-react';

export default function AdminSettings() {
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');
  const [settings, setSettings] = useState({
    siteName: 'Rezume',
    siteUrl: 'https://rezume.com',
    adminEmail: 'admin@rezume.com',
    maxResumesPerUser: 10,
    emailVerificationRequired: true,
    autoDeleteInactiveUsers: false,
    inactiveUserDays: 365,
    maintenanceMode: false,
    allowRegistration: true,
    defaultUserRole: 'user',
    sessionTimeout: 7200,
    maxFileSize: 5242880,
    allowedFileTypes: ['pdf', 'docx'],
    emailProvider: 'sendgrid',
    databaseBackup: 'daily',
    enableAnalytics: true,
    enableNotifications: true
  });

  const handleSaveSettings = async () => {
    setLoading(true);
    setSaveStatus('');
    
    try {
      const response = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      
      if (response.ok) {
        setSaveStatus('success');
        setTimeout(() => setSaveStatus(''), 3000);
      } else {
        setSaveStatus('error');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      setSaveStatus('error');
    } finally {
      setLoading(false);
    }
  };

  const handleResetSettings = () => {
    if (confirm('Are you sure you want to reset all settings to default?')) {
      window.location.reload();
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">System Settings</h2>
              <p className="text-gray-600 mt-1">Configure system-wide settings and preferences</p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleResetSettings}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <RefreshCw size={18} className="inline mr-2" />
                Reset to Default
              </button>
              <button
                onClick={handleSaveSettings}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                <Save size={18} className="inline mr-2" />
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>

        {/* Save Status Alert */}
        {saveStatus && (
          <div className={`p-4 rounded-lg ${
            saveStatus === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
          }`}>
            <div className="flex items-center">
              <AlertCircle size={20} className="mr-2" />
              {saveStatus === 'success' ? 'Settings saved successfully!' : 'Error saving settings. Please try again.'}
            </div>
          </div>
        )}

        {/* Settings Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* General Settings */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center mb-4">
              <SettingsIcon className="text-gray-400 mr-2" size={20} />
              <h3 className="text-lg font-semibold text-gray-800">General Settings</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Site Name</label>
                <input
                  type="text"
                  value={settings.siteName}
                  onChange={(e) => setSettings({...settings, siteName: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Site URL</label>
                <input
                  type="url"
                  value={settings.siteUrl}
                  onChange={(e) => setSettings({...settings, siteUrl: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Admin Email</label>
                <input
                  type="email"
                  value={settings.adminEmail}
                  onChange={(e) => setSettings({...settings, adminEmail: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Max Resumes per User</label>
                <input
                  type="number"
                  value={settings.maxResumesPerUser}
                  onChange={(e) => setSettings({...settings, maxResumesPerUser: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Security Settings */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center mb-4">
              <Shield className="text-gray-400 mr-2" size={20} />
              <h3 className="text-lg font-semibold text-gray-800">Security Settings</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">Email Verification Required</label>
                <input
                  type="checkbox"
                  checked={settings.emailVerificationRequired}
                  onChange={(e) => setSettings({...settings, emailVerificationRequired: e.target.checked})}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">Allow Registration</label>
                <input
                  type="checkbox"
                  checked={settings.allowRegistration}
                  onChange={(e) => setSettings({...settings, allowRegistration: e.target.checked})}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">Maintenance Mode</label>
                <input
                  type="checkbox"
                  checked={settings.maintenanceMode}
                  onChange={(e) => setSettings({...settings, maintenanceMode: e.target.checked})}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Session Timeout (seconds)</label>
                <input
                  type="number"
                  value={settings.sessionTimeout}
                  onChange={(e) => setSettings({...settings, sessionTimeout: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Email Settings */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center mb-4">
              <Mail className="text-gray-400 mr-2" size={20} />
              <h3 className="text-lg font-semibold text-gray-800">Email Settings</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Provider</label>
                <select
                  value={settings.emailProvider}
                  onChange={(e) => setSettings({...settings, emailProvider: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="sendgrid">SendGrid</option>
                  <option value="mailgun">Mailgun</option>
                  <option value="smtp">SMTP</option>
                </select>
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">Enable Notifications</label>
                <input
                  type="checkbox"
                  checked={settings.enableNotifications}
                  onChange={(e) => setSettings({...settings, enableNotifications: e.target.checked})}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Database Settings */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center mb-4">
              <Database className="text-gray-400 mr-2" size={20} />
              <h3 className="text-lg font-semibold text-gray-800">Database Settings</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Backup Schedule</label>
                <select
                  value={settings.databaseBackup}
                  onChange={(e) => setSettings({...settings, databaseBackup: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">Auto-delete Inactive Users</label>
                <input
                  type="checkbox"
                  checked={settings.autoDeleteInactiveUsers}
                  onChange={(e) => setSettings({...settings, autoDeleteInactiveUsers: e.target.checked})}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </div>
              {settings.autoDeleteInactiveUsers && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Inactive Days Threshold</label>
                  <input
                    type="number"
                    value={settings.inactiveUserDays}
                    onChange={(e) => setSettings({...settings, inactiveUserDays: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* System Information */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">System Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Version</p>
              <p className="font-medium text-gray-800">0.1.0</p>
            </div>
            <div>
              <p className="text-gray-600">Database</p>
              <p className="font-medium text-gray-800">Turso SQLite</p>
            </div>
            <div>
              <p className="text-gray-600">Framework</p>
              <p className="font-medium text-gray-800">Next.js 15.3.5</p>
            </div>
            <div>
              <p className="text-gray-600">Node Version</p>
              <p className="font-medium text-gray-800">v20.0.0</p>
            </div>
            <div>
              <p className="text-gray-600">Environment</p>
              <p className="font-medium text-gray-800">Development</p>
            </div>
            <div>
              <p className="text-gray-600">Last Backup</p>
              <p className="font-medium text-gray-800">2 hours ago</p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
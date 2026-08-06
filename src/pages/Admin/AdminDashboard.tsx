import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import StatCard from '../../components/UI/StatCard';
import StatusBadge from '../../components/UI/StatusBadge';
import { 
  Users, 
  BookOpen, 
  Shield, 
  Settings,
  AlertTriangle,
  CheckCircle,
  UserPlus,
  FileText,
  Activity,
  Database,
  BarChart3} from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const { logEntries, checkIns, assignments } = useApp();

  // Mock additional admin data
  const totalUsers = 156;
  const totalStudents = 89;
  const totalSupervisors = 23;
  const totalAdmins = 3;
  const activeUsers = 142;
  const systemHealth = 98.5;

  const recentActivity = [
    { id: '1', type: 'user_registered', user: 'John Doe', action: 'Student registered', timestamp: '2024-01-22T10:30:00Z' },
    { id: '2', type: 'log_approved', user: 'Dr. Smith', action: 'Approved log entry', timestamp: '2024-01-22T09:15:00Z' },
    { id: '3', type: 'assignment_created', user: 'Admin', action: 'Assigned student to supervisor', timestamp: '2024-01-22T08:45:00Z' },
    { id: '4', type: 'user_login', user: 'Jane Wilson', action: 'User logged in', timestamp: '2024-01-22T08:30:00Z' },
    { id: '5', type: 'system_backup', user: 'System', action: 'Database backup completed', timestamp: '2024-01-22T02:00:00Z' }
  ];

  const systemAlerts = [
    { id: '1', type: 'warning', message: '5 students have not checked in today', priority: 'medium' },
    { id: '2', type: 'info', message: 'System maintenance scheduled for tonight', priority: 'low' },
    { id: '3', type: 'error', message: '2 failed login attempts detected', priority: 'high' }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'user_registered': return UserPlus;
      case 'log_approved': return CheckCircle;
      case 'assignment_created': return Users;
      case 'user_login': return Shield;
      case 'system_backup': return Database;
      default: return Activity;
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'error': return 'text-red-600 bg-red-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'info': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">System overview and management controls</p>
      </div>

      {/* System Health Alert */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl p-6 mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-green-100 p-2 rounded-full">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-green-900">System Status: Healthy</h3>
              <p className="text-green-700">All services operational • {systemHealth}% uptime</p>
            </div>
          </div>
          {/* <Link
            to="/admin/system"
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            View Details
          </Link> */}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Users"
          value={totalUsers}
          icon={Users}
          change={{ value: `${activeUsers} active`, trend: 'up' }}
          color="blue"
        />
        <StatCard
          title="Students"
          value={totalStudents}
          icon={BookOpen}
          change={{ value: '+5 this week', trend: 'up' }}
          color="green"
        />
        <StatCard
          title="Supervisors"
          value={totalSupervisors}
          icon={Shield}
          change={{ value: '2 pending approval', trend: 'up' }}
          color="purple"
        />
        <StatCard
          title="Log Entries"
          value={logEntries.length}
          icon={FileText}
          change={{ value: '+12% this month', trend: 'up' }}
          color="orange"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Link
                to="/admin/users"
                className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-all group"
              >
                <div className="bg-blue-100 p-3 rounded-full group-hover:bg-blue-200 transition-colors mb-3">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <span className="font-medium text-gray-900">Manage Users</span>
                <span className="text-sm text-gray-600 text-center">Add, edit, or remove users</span>
              </Link>

              <Link
                to="/admin/assignments"
                className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-green-50 hover:border-green-300 transition-all group"
              >
                <div className="bg-green-100 p-3 rounded-full group-hover:bg-green-200 transition-colors mb-3">
                  <UserPlus className="h-6 w-6 text-green-600" />
                </div>
                <span className="font-medium text-gray-900">Assignments</span>
                <span className="text-sm text-gray-600 text-center">Manage student-supervisor pairs</span>
              </Link>

              {/* <Link
                to="/admin/logs"
                className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-purple-50 hover:border-purple-300 transition-all group"
              >
                <div className="bg-purple-100 p-3 rounded-full group-hover:bg-purple-200 transition-colors mb-3">
                  <FileText className="h-6 w-6 text-purple-600" />
                </div>
                <span className="font-medium text-gray-900">All Logs</span>
                <span className="text-sm text-gray-600 text-center">View all log entries</span>
              </Link> */}

              <Link
                to="/admin/analytics"
                className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-orange-50 hover:border-orange-300 transition-all group"
              >
                <div className="bg-orange-100 p-3 rounded-full group-hover:bg-orange-200 transition-colors mb-3">
                  <BarChart3 className="h-6 w-6 text-orange-600" />
                </div>
                <span className="font-medium text-gray-900">Analytics</span>
                <span className="text-sm text-gray-600 text-center">System-wide reports</span>
              </Link>

              <Link
                to="/admin/settings"
                className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all group"
              >
                <div className="bg-gray-100 p-3 rounded-full group-hover:bg-gray-200 transition-colors mb-3">
                  <Settings className="h-6 w-6 text-gray-600" />
                </div>
                <span className="font-medium text-gray-900">System Settings</span>
                <span className="text-sm text-gray-600 text-center">Configure system parameters</span>
              </Link>

              <Link
                to="/admin/backup"
                className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-indigo-50 hover:border-indigo-300 transition-all group"
              >
                <div className="bg-indigo-100 p-3 rounded-full group-hover:bg-indigo-200 transition-colors mb-3">
                  <Database className="h-6 w-6 text-indigo-600" />
                </div>
                <span className="font-medium text-gray-900">Backup & Restore</span>
                <span className="text-sm text-gray-600 text-center">Data management</span>
              </Link>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
                {/* <Link
                  to="/admin/activity"
                  className="text-blue-600 hover:text-blue-500 text-sm font-medium"
                >
                  View All
                </Link> */}
              </div>
            </div>
            <div className="divide-y divide-gray-200">
              {recentActivity.map((activity) => {
                const Icon = getActivityIcon(activity.type);
                return (
                  <div key={activity.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start space-x-3">
                      <div className="bg-gray-100 p-2 rounded-full">
                        <Icon className="h-4 w-4 text-gray-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">
                          <span className="font-medium">{activity.user}</span> {activity.action}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(activity.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Side Panel */}
        <div className="space-y-6">
          {/* System Alerts */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-2 mb-4">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              <h3 className="text-lg font-semibold text-gray-900">System Alerts</h3>
            </div>
            <div className="space-y-3">
              {systemAlerts.map((alert) => (
                <div key={alert.id} className={`p-3 rounded-lg ${getAlertColor(alert.type)}`}>
                  <p className="text-sm font-medium">{alert.message}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs opacity-75">Priority: {alert.priority}</span>
                    <button className="text-xs underline opacity-75 hover:opacity-100">
                      Dismiss
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* User Statistics */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">User Distribution</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-gray-700">Students</span>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold text-gray-900">{totalStudents}</div>
                  <div className="text-xs text-gray-500">
                    {((totalStudents / totalUsers) * 100).toFixed(1)}%
                  </div>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full" 
                  style={{ width: `${(totalStudents / totalUsers) * 100}%` }}
                ></div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-700">Supervisors</span>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold text-gray-900">{totalSupervisors}</div>
                  <div className="text-xs text-gray-500">
                    {((totalSupervisors / totalUsers) * 100).toFixed(1)}%
                  </div>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full" 
                  style={{ width: `${(totalSupervisors / totalUsers) * 100}%` }}
                ></div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
                  <span className="text-sm text-gray-700">Admins</span>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold text-gray-900">{totalAdmins}</div>
                  <div className="text-xs text-gray-500">
                    {((totalAdmins / totalUsers) * 100).toFixed(1)}%
                  </div>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-purple-500 h-2 rounded-full" 
                  style={{ width: `${(totalAdmins / totalUsers) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">Today's Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-blue-800">New Registrations</span>
                <span className="font-semibold text-blue-900">3</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-blue-800">Log Entries</span>
                <span className="font-semibold text-blue-900">47</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-blue-800">Check-ins</span>
                <span className="font-semibold text-blue-900">89</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-blue-800">Active Sessions</span>
                <span className="font-semibold text-blue-900">142</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
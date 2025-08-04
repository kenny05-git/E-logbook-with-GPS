import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { 
  Users, 
  CheckCircle, 
  Clock, 
  Star,
  TrendingUp,
  AlertCircle,
  Calendar,
  Eye,
  MessageSquare,
  Award
} from 'lucide-react';

// Simple StatCard component for this page
const StatCard: React.FC<{
  title: string;
  value: string | number;
  icon: React.ComponentType<any>;
  change?: { value: string; trend: 'up' | 'down' };
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red';
}> = ({ title, value, icon: Icon, change, color = 'blue' }) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    orange: 'bg-orange-50 text-orange-600',
    red: 'bg-red-50 text-red-600'
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          {change && (
            <div className={`flex items-center mt-2 text-sm ${
              change.trend === 'up' ? 'text-green-600' : 'text-red-600'
            }`}>
              <span>{change.trend === 'up' ? '↗' : '↘'} {change.value}</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-full ${colorClasses[color]}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
};

// Simple StatusBadge component for this page
const StatusBadge: React.FC<{
  status: string;
  size?: 'sm' | 'md' | 'lg';
}> = ({ status, size = 'md' }) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'approved':
      case 'success':
        return {
          text: status === 'approved' ? 'Approved' : 'Success',
          className: 'bg-green-100 text-green-800 border-green-200'
        };
      case 'pending':
        return {
          text: 'Pending',
          className: 'bg-yellow-100 text-yellow-800 border-yellow-200'
        };
      case 'rejected':
      case 'failed':
        return {
          text: status === 'rejected' ? 'Rejected' : 'Failed',
          className: 'bg-red-100 text-red-800 border-red-200'
        };
      default:
        return {
          text: 'Unknown',
          className: 'bg-gray-100 text-gray-800 border-gray-200'
        };
    }
  };

  const config = getStatusConfig();
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  return (
    <span className={`inline-flex items-center rounded-full border font-medium ${config.className} ${sizeClasses[size]}`}>
      <span>{config.text}</span>
    </span>
  );
};

const IndustrialDashboard: React.FC = () => {
  const { user } = useAuth();
  const { logEntries } = useApp();

  // Filter entries for students assigned to this industrial supervisor
  const studentLogEntries = logEntries.filter(entry => {
    // In a real app, you'd check if the student is assigned to this industrial supervisor
    return entry.studentId === '1'; // Mock data - assuming student 1 is assigned
  });

  const pendingConfirmations = studentLogEntries.filter(entry => 
    entry.status === 'approved' && !entry.industrialSupervisorConfirmation?.confirmed
  );
  
  const confirmedEntries = studentLogEntries.filter(entry => 
    entry.industrialSupervisorConfirmation?.confirmed
  );

  const averageRating = confirmedEntries.length > 0 
    ? (confirmedEntries.reduce((sum, entry) => sum + (entry.industrialSupervisorConfirmation?.rating || 0), 0) / confirmedEntries.length).toFixed(1)
    : '0';

  const recentPendingConfirmations = pendingConfirmations.slice(0, 5);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Industrial Supervisor Dashboard</h1>
        <p className="text-gray-600 mt-2">Confirm student activities and provide workplace feedback</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Pending Confirmations"
          value={pendingConfirmations.length}
          icon={Clock}
          change={{ value: `${pendingConfirmations.length} need review`, trend: 'up' }}
          color="orange"
        />
        <StatCard
          title="Confirmed Entries"
          value={confirmedEntries.length}
          icon={CheckCircle}
          change={{ value: '+3 this week', trend: 'up' }}
          color="green"
        />
        <StatCard
          title="Average Rating"
          value={averageRating}
          icon={Star}
          change={{ value: 'out of 5 stars', trend: 'up' }}
          color="purple"
        />
        <StatCard
          title="Active Students"
          value="1"
          icon={Users}
          color="blue"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Pending Confirmations */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-orange-600" />
                  <h2 className="text-lg font-semibold text-gray-900">Pending Confirmations</h2>
                  {pendingConfirmations.length > 0 && (
                    <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full">
                      {pendingConfirmations.length}
                    </span>
                  )}
                </div>
                <Link
                  to="/industrial/confirmations"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Review All
                </Link>
              </div>
            </div>
            <div className="divide-y divide-gray-200">
              {recentPendingConfirmations.length > 0 ? (
                recentPendingConfirmations.map((entry) => (
                  <div key={entry.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <span className="text-sm font-medium text-gray-900">
                            {entry.studentName}
                          </span>
                          <span className="text-sm text-gray-600">
                            {new Date(entry.date).toLocaleDateString()}
                          </span>
                          <StatusBadge status="pending" size="sm" />
                        </div>
                        <p className="text-gray-700 text-sm leading-relaxed line-clamp-2">
                          {entry.description}
                        </p>
                        {entry.supervisorFeedback && (
                          <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-xs">
                            <strong>School Supervisor Feedback:</strong> {entry.supervisorFeedback}
                          </div>
                        )}
                        <div className="flex items-center space-x-4 text-xs text-gray-500 mt-2">
                          <span>Approved by school: {new Date(entry.approvedAt || '').toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <Link
                          to={`/industrial/confirmations/${entry.id}`}
                          className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                          title="Review confirmation"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                        <Link
                          to={`/industrial/confirmations/${entry.id}/confirm`}
                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1"
                        >
                          <CheckCircle className="h-3 w-3" />
                          <span>Confirm</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center">
                  <CheckCircle className="h-12 w-12 text-green-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">All caught up!</h3>
                  <p className="text-gray-600 mb-4">No pending confirmations to review</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Side Panel */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Link
                to="/industrial/confirmations"
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-orange-50 transition-colors group"
              >
                <div className="bg-orange-100 p-2 rounded-lg group-hover:bg-orange-200 transition-colors">
                  <CheckCircle className="h-4 w-4 text-orange-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">Review Confirmations</div>
                  <div className="text-sm text-gray-600">Confirm student activities</div>
                </div>
              </Link>
              <Link
                to="/industrial/students"
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-50 transition-colors group"
              >
                <div className="bg-blue-100 p-2 rounded-lg group-hover:bg-blue-200 transition-colors">
                  <Users className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">Manage Students</div>
                  <div className="text-sm text-gray-600">View assigned students</div>
                </div>
              </Link>
              <Link
                to="/industrial/reports"
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-green-50 transition-colors group"
              >
                <div className="bg-green-100 p-2 rounded-lg group-hover:bg-green-200 transition-colors">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">View Reports</div>
                  <div className="text-sm text-gray-600">Student performance</div>
                </div>
              </Link>
            </div>
          </div>

          {/* Recent Confirmations */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Award className="h-5 w-5 text-green-600" />
              <h3 className="text-lg font-semibold text-gray-900">Recent Confirmations</h3>
            </div>
            <div className="space-y-3">
              {confirmedEntries.slice(0, 3).map((entry) => (
                <div key={entry.id} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm font-medium text-gray-900">
                      {entry.studentName}
                    </div>
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3 w-3 ${
                            i < (entry.industrialSupervisorConfirmation?.rating || 0)
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="text-xs text-gray-600">
                    {new Date(entry.date).toLocaleDateString()}
                  </div>
                </div>
              ))}
              {confirmedEntries.length === 0 && (
                <div className="text-center py-4">
                  <Award className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">No confirmations yet</p>
                </div>
              )}
            </div>
          </div>

          {/* Performance Summary */}
          <div className="bg-gradient-to-br from-green-50 to-blue-50 border border-green-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-green-900 mb-4">This Week's Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-green-800">Confirmations Made</span>
                <span className="font-semibold text-green-900">{confirmedEntries.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-green-800">Average Rating</span>
                <span className="font-semibold text-green-900">{averageRating}/5</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-green-800">Response Time</span>
                <span className="font-semibold text-green-900">1.2 days</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndustrialDashboard;
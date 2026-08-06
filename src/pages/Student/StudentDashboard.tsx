import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import StatCard from '../../components/UI/StatCard';
import StatusBadge from '../../components/UI/StatusBadge';
import { 
  BookOpen, 
  MapPin, 
  Clock, 
  CheckCircle, 
  Calendar,
  TrendingUp,
  Plus,
  Eye
} from 'lucide-react';

const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const { logEntries, checkIns } = useApp();

  // Filter data for current user
  const userLogEntries = logEntries.filter(entry => entry.studentId === user?.id);
  const userCheckIns = checkIns.filter(checkIn => checkIn.studentId === user?.id);

  const pendingLogs = userLogEntries.filter(entry => entry.status === 'pending').length;
  const approvedLogs = userLogEntries.filter(entry => entry.status === 'approved').length;
  const thisWeekLogs = userLogEntries.filter(entry => {
    const entryDate = new Date(entry.date);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return entryDate >= weekAgo;
  }).length;

  const recentCheckIns = userCheckIns.slice(0, 5);
  const recentLogEntries = userLogEntries.slice(0, 5);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.name}</h1>
        <p className="text-gray-600 mt-2">Here's your placement progress overview</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="This Week's Logs"
          value={thisWeekLogs}
          icon={Calendar}
          change={{ value: '+2 from last week', trend: 'up' }}
          color="blue"
        />
        <StatCard
          title="Pending Approval"
          value={pendingLogs}
          icon={Clock}
          color="orange"
        />
        <StatCard
          title="Approved Logs"
          value={approvedLogs}
          icon={CheckCircle}
          change={{ value: '+3 this week', trend: 'up' }}
          color="green"
        />
        <StatCard
          title="Check-ins"
          value={userCheckIns.length}
          icon={MapPin}
          change={{ value: '100% success rate', trend: 'up' }}
          color="purple"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Log Entries */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                  <h2 className="text-lg font-semibold text-gray-900">Recent Log Entries</h2>
                </div>
                <Link
                  to="/student/logbook/new"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Entry</span>
                </Link>
              </div>
            </div>
            <div className="divide-y divide-gray-200">
              {recentLogEntries.length > 0 ? (
                recentLogEntries.map((entry) => (
                  <div key={entry.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <span className="text-sm font-medium text-gray-900">
                            {new Date(entry.date).toLocaleDateString()}
                          </span>
                          <StatusBadge status={entry.status} size="sm" />
                        </div>
                        <p className="text-gray-700 text-sm leading-relaxed line-clamp-2">
                          {entry.description}
                        </p>
                        {entry.supervisorFeedback && (
                          <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                            <p className="text-green-800 text-sm">
                              <strong>Supervisor Feedback:</strong> {entry.supervisorFeedback}
                            </p>
                          </div>
                        )}
                      </div>
                      <Link
                        to={`/student/logbook/${entry.id}`}
                        className="ml-4 p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center">
                  <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No log entries yet</h3>
                  <p className="text-gray-600 mb-4">Start documenting your placement activities</p>
                  <Link
                    to="/student/logbook/new"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Create Your First Entry
                  </Link>
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
                to="/student/logbook/new"
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-50 transition-colors group"
              >
                <div className="bg-blue-100 p-2 rounded-lg group-hover:bg-blue-200 transition-colors">
                  <BookOpen className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">Add Log Entry</div>
                  <div className="text-sm text-gray-600">Document today's activities</div>
                </div>
              </Link>
              <Link
                to="/student/checkin"
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-green-50 transition-colors group"
              >
                <div className="bg-green-100 p-2 rounded-lg group-hover:bg-green-200 transition-colors">
                  <MapPin className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">GPS Check-in</div>
                  <div className="text-sm text-gray-600">Verify your location</div>
                </div>
              </Link>
              <Link
                to="/profile"
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-purple-50 transition-colors group"
              >
                <div className="bg-purple-100 p-2 rounded-lg group-hover:bg-purple-200 transition-colors">
                  <TrendingUp className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">View Profile</div>
                  <div className="text-sm text-gray-600">Check yourself out</div>
                </div>
              </Link>
            </div>
          </div>

          {/* Recent Check-ins */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-2 mb-4">
              <MapPin className="h-5 w-5 text-green-600" />
              <h3 className="text-lg font-semibold text-gray-900">Recent Check-ins</h3>
            </div>
            <div className="space-y-3">
              {recentCheckIns.length > 0 ? (
                recentCheckIns.map((checkIn) => (
                  <div key={checkIn.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {new Date(checkIn.timestamp).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-gray-600">
                        {new Date(checkIn.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                    <StatusBadge status={checkIn.status} size="sm" />
                  </div>
                ))
              ) : (
                <div className="text-center py-4">
                  <MapPin className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">No check-ins yet</p>
                </div>
              )}
            </div>
            <Link
              to="/student/checkin"
              className="block w-full mt-4 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg text-sm font-medium text-center transition-colors"
            >
              Check In Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
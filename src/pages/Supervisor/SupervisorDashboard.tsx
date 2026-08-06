import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import StatCard from '../../components/UI/StatCard';
import StatusBadge from '../../components/UI/StatusBadge';
import { 
  Users, 
  BookOpen, 
  Clock, 
  CheckCircle, 
  TrendingUp,
  Calendar,
  Eye,
  MessageSquare,
  MapPin
} from 'lucide-react';

const SupervisorDashboard: React.FC = () => {
  const { user } = useAuth();
  const { logEntries, checkIns, assignments } = useApp();

  // Get students assigned to this supervisor
  const supervisorAssignments = assignments.filter(
    assignment => assignment.supervisorId === user?.id && assignment.isActive
  );
  const assignedStudentIds = supervisorAssignments.map(assignment => assignment.studentId);

  // Filter data for assigned students
  const studentLogEntries = logEntries.filter(entry => 
    assignedStudentIds.includes(entry.studentId)
  );
  const studentCheckIns = checkIns.filter(checkIn => 
    assignedStudentIds.includes(checkIn.studentId)
  );

  const pendingLogs = studentLogEntries.filter(entry => entry.status === 'pending');
  const approvedLogs = studentLogEntries.filter(entry => entry.status === 'approved');
  const thisWeekLogs = studentLogEntries.filter(entry => {
    const entryDate = new Date(entry.date);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return entryDate >= weekAgo;
  });

  const recentPendingLogs = pendingLogs.slice(0, 5);
  const recentCheckIns = studentCheckIns.slice(0, 5);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Supervisor Dashboard</h1>
        <p className="text-gray-600 mt-2">Monitor and review your students' placement progress</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Assigned Students"
          value={assignedStudentIds.length}
          icon={Users}
          color="blue"
        />
        <StatCard
          title="Pending Reviews"
          value={pendingLogs.length}
          icon={Clock}
          change={{ value: `${pendingLogs.length} need attention`, trend: 'up' }}
          color="orange"
        />
        <StatCard
          title="This Week's Logs"
          value={thisWeekLogs.length}
          icon={Calendar}
          change={{ value: '+12% from last week', trend: 'up' }}
          color="green"
        />
        <StatCard
          title="Total Check-ins"
          value={studentCheckIns.length}
          icon={MapPin}
          change={{ value: '98% success rate', trend: 'up' }}
          color="purple"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Pending Log Reviews */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-orange-600" />
                  <h2 className="text-lg font-semibold text-gray-900">Pending Log Reviews</h2>
                  {pendingLogs.length > 0 && (
                    <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full">
                      {pendingLogs.length}
                    </span>
                  )}
                </div>
                <Link
                  to="/supervisor/logs"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Review All
                </Link>
              </div>
            </div>
            <div className="divide-y divide-gray-200">
              {recentPendingLogs.length > 0 ? (
                recentPendingLogs.map((entry) => (
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
                          <StatusBadge status={entry.status} size="sm" />
                        </div>
                        <p className="text-gray-700 text-sm leading-relaxed line-clamp-2">
                          {entry.description}
                        </p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500 mt-2">
                          <span>Submitted: {new Date(entry.createdAt).toLocaleDateString()}</span>
                          {entry.location && (
                            <div className="flex items-center space-x-1">
                              <MapPin className="h-3 w-3" />
                              <span>Location verified</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <Link
                          to={`/supervisor/logs/${entry.id}`}
                          className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                          title="Review log"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center">
                  <CheckCircle className="h-12 w-12 text-green-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">All caught up!</h3>
                  <p className="text-gray-600 mb-4">No pending log entries to review</p>
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
                to="/supervisor/students"
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
                to="/supervisor/logs"
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-orange-50 transition-colors group"
              >
                <div className="bg-orange-100 p-2 rounded-lg group-hover:bg-orange-200 transition-colors">
                  <BookOpen className="h-4 w-4 text-orange-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">Review Logs</div>
                  <div className="text-sm text-gray-600">Approve student entries</div>
                </div>
              </Link>
              <Link
                to="/supervisor/reports"
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-green-50 transition-colors group"
              >
                <div className="bg-green-100 p-2 rounded-lg group-hover:bg-green-200 transition-colors">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">View Reports</div>
                  <div className="text-sm text-gray-600">Progress analytics</div>
                </div>
              </Link>
            </div>
          </div>

          {/* Recent Student Activity */}
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
                        {checkIn.studentName}
                      </div>
                      <div className="text-xs text-gray-600">
                        {new Date(checkIn.timestamp).toLocaleDateString()} at{' '}
                        {new Date(checkIn.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {checkIn.isAutomatic && (
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                          Auto
                        </span>
                      )}
                      <StatusBadge status={checkIn.status} size="sm" />
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4">
                  <MapPin className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">No recent check-ins</p>
                </div>
              )}
            </div>
          </div>

          {/* Performance Summary */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">This Week's Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-blue-800">Logs Reviewed</span>
                <span className="font-semibold text-blue-900">{approvedLogs.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-blue-800">Students Active</span>
                <span className="font-semibold text-blue-900">
                  {new Set(thisWeekLogs.map(log => log.studentId)).size}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-blue-800">Avg. Response Time</span>
                <span className="font-semibold text-blue-900">2.3 hours</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupervisorDashboard;
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import StatusBadge from '../../components/UI/StatusBadge';
import { 
  ArrowLeft,
  TrendingUp, 
  Calendar, 
  MapPin, 
  BookOpen,
  CheckCircle,
  Clock,
  XCircle,
  BarChart3,
  PieChart,
  Activity,
  Target,
  Award,
  User,
  Mail,
  School,
  Download
} from 'lucide-react';

const StudentProgress: React.FC = () => {
  const { studentId } = useParams<{ studentId: string }>();
  const { user } = useAuth();
  const { logEntries, checkIns } = useApp();
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter' | 'year'>('month');

  // Mock student data - in a real app, this would come from your backend
  const student = {
    id: studentId,
    name: 'John Smith',
    email: 'student@example.com',
    matricNumber: 'CS2024001',
    course: 'Computer Science',
    institution: 'University of Technology',
    placementAddress: '123 Business District, City Center',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
    startDate: '2024-01-15'
  };

  // Filter data for this student
  const studentLogs = logEntries.filter(entry => entry.studentId === studentId);
  const studentCheckIns = checkIns.filter(checkIn => checkIn.studentId === studentId);

  // Calculate date range
  const getDateRange = () => {
    const now = new Date();
    const ranges = {
      week: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
      month: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
      quarter: new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000),
      year: new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)
    };
    return ranges[timeRange];
  };

  const startDate = getDateRange();
  const filteredLogs = studentLogs.filter(entry => new Date(entry.date) >= startDate);
  const filteredCheckIns = studentCheckIns.filter(checkIn => new Date(checkIn.timestamp) >= startDate);

  // Calculate statistics
  const totalLogs = filteredLogs.length;
  const approvedLogs = filteredLogs.filter(log => log.status === 'approved').length;
  const pendingLogs = filteredLogs.filter(log => log.status === 'pending').length;
  const rejectedLogs = filteredLogs.filter(log => log.status === 'rejected').length;
  const approvalRate = totalLogs > 0 ? ((approvedLogs / totalLogs) * 100).toFixed(1) : '0';
  const totalCheckIns = filteredCheckIns.length;
  const successfulCheckIns = filteredCheckIns.filter(checkIn => checkIn.status === 'success').length;
  const checkInRate = totalCheckIns > 0 ? ((successfulCheckIns / totalCheckIns) * 100).toFixed(1) : '0';

  // Weekly progress data (mock data for charts)
  const weeklyProgress = [
    { week: 'Week 1', logs: 3, checkIns: 7, approved: 2 },
    { week: 'Week 2', logs: 4, checkIns: 7, approved: 4 },
    { week: 'Week 3', logs: 5, checkIns: 6, approved: 4 },
    { week: 'Week 4', logs: 3, checkIns: 7, approved: 3 }
  ];

  // Monthly trend data
  const monthlyTrend = [
    { month: 'Jan', logs: 12, approved: 10 },
    { month: 'Feb', logs: 15, approved: 14 },
    { month: 'Mar', logs: 18, approved: 16 },
    { month: 'Apr', logs: 14, approved: 13 }
  ];

  const handleExportReport = () => {
    alert('Student progress report export functionality would be implemented here');
  };

  if (!student) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Student not found</h1>
          <Link to="/supervisor/students" className="text-blue-600 hover:text-blue-500 mt-4 inline-block">
            Back to Students
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center space-x-4 mb-4">
          <Link
            to="/supervisor/students"
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Student Progress Report</h1>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">Detailed analytics and performance tracking</p>
          </div>
          <button
            onClick={handleExportReport}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 text-sm sm:text-base"
          >
            <Download className="h-4 w-4" />
            <span>Export</span>
          </button>
        </div>

        {/* Student Info Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <img
              src={student.avatar}
              alt={student.name}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover"
            />
            <div className="flex-1">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{student.name}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 mt-3 text-sm">
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">{student.matricNumber}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">{student.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <School className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">{student.course}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">Started {new Date(student.startDate).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Time Range Filter */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 sm:mb-0">Performance Analytics</h3>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
            className="w-full sm:w-48 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
          >
            <option value="week">Last 7 days</option>
            <option value="month">Last 30 days</option>
            <option value="quarter">Last 3 months</option>
            <option value="year">Last year</option>
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-2 sm:p-3 rounded-full">
              <BookOpen className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600">Total Log Entries</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">{totalLogs}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center space-x-3">
            <div className="bg-green-100 p-2 sm:p-3 rounded-full">
              <Target className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600">Approval Rate</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">{approvalRate}%</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center space-x-3">
            <div className="bg-purple-100 p-2 sm:p-3 rounded-full">
              <MapPin className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600">Check-in Rate</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">{checkInRate}%</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center space-x-3">
            <div className="bg-orange-100 p-2 sm:p-3 rounded-full">
              <Award className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600">Performance Score</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">
                {totalLogs > 0 ? Math.round((approvedLogs / totalLogs) * 100) : 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-6 sm:mb-8">
        {/* Log Status Distribution Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center space-x-2 mb-6">
            <PieChart className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Log Status Distribution</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-700">Approved</span>
              </div>
              <div className="text-right">
                <div className="text-lg font-semibold text-gray-900">{approvedLogs}</div>
                <div className="text-xs text-gray-500">{approvalRate}%</div>
              </div>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full" 
                style={{ width: `${approvalRate}%` }}
              ></div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
                <span className="text-sm text-gray-700">Pending</span>
              </div>
              <div className="text-right">
                <div className="text-lg font-semibold text-gray-900">{pendingLogs}</div>
                <div className="text-xs text-gray-500">
                  {totalLogs > 0 ? ((pendingLogs / totalLogs) * 100).toFixed(1) : 0}%
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                <span className="text-sm text-gray-700">Rejected</span>
              </div>
              <div className="text-right">
                <div className="text-lg font-semibold text-gray-900">{rejectedLogs}</div>
                <div className="text-xs text-gray-500">
                  {totalLogs > 0 ? ((rejectedLogs / totalLogs) * 100).toFixed(1) : 0}%
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Weekly Activity Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center space-x-2 mb-6">
            <BarChart3 className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Weekly Activity</h3>
          </div>
          
          <div className="space-y-4">
            {weeklyProgress.map((week, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-700 font-medium">{week.week}</span>
                  <span className="text-gray-500">{week.logs} logs, {week.checkIns} check-ins</span>
                </div>
                <div className="flex space-x-2">
                  <div className="flex-1">
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span>Logs</span>
                      <span>{week.logs}</span>
                    </div>
                    <div className="bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${(week.logs / 6) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span>Check-ins</span>
                      <span>{week.checkIns}</span>
                    </div>
                    <div className="bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${(week.checkIns / 7) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Monthly Trend Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-6 sm:mb-8">
        <div className="flex items-center space-x-2 mb-6">
          <TrendingUp className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Monthly Progress Trend</h3>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {monthlyTrend.map((month, index) => (
            <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-lg font-bold text-gray-900 mb-2">{month.month}</div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Submitted</span>
                  <span className="font-medium">{month.logs}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Approved</span>
                  <span className="font-medium text-green-600">{month.approved}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${(month.approved / month.logs) * 100}%` }}
                  ></div>
                </div>
                <div className="text-xs text-gray-500">
                  {((month.approved / month.logs) * 100).toFixed(0)}% approval rate
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
        <div className="flex items-center space-x-2 mb-6">
          <Activity className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Recent Log Entries</h3>
        </div>
        
        <div className="space-y-4">
          {studentLogs.slice(0, 5).map((log) => (
            <div key={log.id} className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <span className="text-sm font-medium text-gray-900">
                    {new Date(log.date).toLocaleDateString()}
                  </span>
                  <StatusBadge status={log.status} size="sm" />
                </div>
                <p className="text-sm text-gray-700 line-clamp-2">{log.description}</p>
                {log.supervisorFeedback && (
                  <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded text-xs">
                    <strong>Your Feedback:</strong> {log.supervisorFeedback}
                  </div>
                )}
              </div>
              <div className="text-xs text-gray-500 ml-4">
                {new Date(log.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}
          
          {studentLogs.length === 0 && (
            <div className="text-center py-8">
              <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">No log entries found for this student</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentProgress;
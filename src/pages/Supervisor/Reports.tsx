import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import StatCard from '../../components/UI/StatCard';
import { 
  TrendingUp, 
  Users, 
  BookOpen, 
  Calendar,
  Download,
  Filter,
  BarChart3,
  PieChart,
  Activity,
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react';

const Reports: React.FC = () => {
  const { user } = useAuth();
  const { logEntries, checkIns, assignments } = useApp();
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  const [reportType, setReportType] = useState<'overview' | 'detailed' | 'student'>('overview');

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

  // Filter data by time range
  const filteredLogs = studentLogEntries.filter(entry => 
    new Date(entry.date) >= startDate
  );
  const filteredCheckIns = studentCheckIns.filter(checkIn => 
    new Date(checkIn.timestamp) >= startDate
  );

  // Calculate statistics
  const totalStudents = assignedStudentIds.length;
  const activeStudents = new Set(filteredLogs.map(log => log.studentId)).size;
  const totalLogs = filteredLogs.length;
  const pendingLogs = filteredLogs.filter(log => log.status === 'pending').length;
  const approvedLogs = filteredLogs.filter(log => log.status === 'approved').length;
  const rejectedLogs = filteredLogs.filter(log => log.status === 'rejected').length;
  const totalCheckIns = filteredCheckIns.length;
  const avgLogsPerStudent = totalStudents > 0 ? (totalLogs / totalStudents).toFixed(1) : '0';

  // Student performance data
  const studentPerformance = assignedStudentIds.map(studentId => {
    const studentLogs = filteredLogs.filter(log => log.studentId === studentId);
    const studentCheckIns = filteredCheckIns.filter(checkIn => checkIn.studentId === studentId);
    const studentName = studentLogs[0]?.studentName || 'Unknown Student';
    
    return {
      id: studentId,
      name: studentName,
      totalLogs: studentLogs.length,
      approvedLogs: studentLogs.filter(log => log.status === 'approved').length,
      pendingLogs: studentLogs.filter(log => log.status === 'pending').length,
      rejectedLogs: studentLogs.filter(log => log.status === 'rejected').length,
      checkIns: studentCheckIns.length,
      approvalRate: studentLogs.length > 0 
        ? ((studentLogs.filter(log => log.status === 'approved').length / studentLogs.length) * 100).toFixed(1)
        : '0'
    };
  }).sort((a, b) => b.totalLogs - a.totalLogs);

  // Weekly activity data (mock data for chart)
  const weeklyActivity = [
    { week: 'Week 1', logs: 12, checkIns: 25 },
    { week: 'Week 2', logs: 15, checkIns: 28 },
    { week: 'Week 3', logs: 18, checkIns: 30 },
    { week: 'Week 4', logs: 14, checkIns: 26 }
  ];

  const handleExportReport = () => {
    // In a real app, this would generate and download a PDF/Excel report
    alert('Report export functionality would be implemented here');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
            <p className="text-gray-600 mt-2">Track student progress and performance metrics</p>
          </div>
          <button
            onClick={handleExportReport}
            className="mt-4 sm:mt-0 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Time Range</label>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="week">Last 7 days</option>
              <option value="month">Last 30 days</option>
              <option value="quarter">Last 3 months</option>
              <option value="year">Last year</option>
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="overview">Overview</option>
              <option value="detailed">Detailed Analytics</option>
              <option value="student">Student Performance</option>
            </select>
          </div>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Students"
          value={totalStudents}
          icon={Users}
          change={{ value: `${activeStudents} active`, trend: 'up' }}
          color="blue"
        />
        <StatCard
          title="Log Entries"
          value={totalLogs}
          icon={BookOpen}
          change={{ value: `${avgLogsPerStudent} avg per student`, trend: 'up' }}
          color="green"
        />
        <StatCard
          title="Pending Reviews"
          value={pendingLogs}
          icon={Clock}
          color="orange"
        />
        <StatCard
          title="Check-ins"
          value={totalCheckIns}
          icon={Activity}
          change={{ value: '98% success rate', trend: 'up' }}
          color="purple"
        />
      </div>

      {reportType === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Status Distribution */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
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
                  <div className="text-xs text-gray-500">
                    {totalLogs > 0 ? ((approvedLogs / totalLogs) * 100).toFixed(1) : 0}%
                  </div>
                </div>
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
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-2 mb-6">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Weekly Activity</h3>
            </div>
            <div className="space-y-4">
              {weeklyActivity.map((week, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-700">{week.week}</span>
                    <span className="text-gray-500">{week.logs} logs, {week.checkIns} check-ins</span>
                  </div>
                  <div className="flex space-x-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full" 
                        style={{ width: `${(week.logs / 20) * 100}%` }}
                      ></div>
                    </div>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full" 
                        style={{ width: `${(week.checkIns / 35) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center space-x-4 mt-4 text-xs text-gray-500">
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span>Log Entries</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>Check-ins</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Student Performance Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Student Performance</h3>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Logs
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Approved
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pending
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Check-ins
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Approval Rate
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {studentPerformance.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{student.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{student.totalLogs}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-gray-900">{student.approvedLogs}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-orange-500" />
                      <span className="text-sm text-gray-900">{student.pendingLogs}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{student.checkIns}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <div className="text-sm font-medium text-gray-900">{student.approvalRate}%</div>
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full" 
                          style={{ width: `${student.approvalRate}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {studentPerformance.length === 0 && (
          <div className="p-8 text-center">
            <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No student data</h3>
            <p className="text-gray-600">Student performance data will appear here once students start submitting logs</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;
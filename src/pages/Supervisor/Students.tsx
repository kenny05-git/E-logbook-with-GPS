import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { 
  Users, 
  Search, 
  Filter,
  MapPin,
  Calendar,
  BookOpen,
  Mail,
  School,
  TrendingUp,
  Globe
} from 'lucide-react';

// Mock student data - in a real app, this would come from your backend
const mockStudents = [
  {
    id: '1',
    name: 'John Smith',
    email: 'student@example.com',
    matricNumber: 'CS2024001',
    course: 'Computer Science',
    institution: 'University of Technology',
    placementAddress: '123 Business District, City Center',
    placementLocation: { latitude: 40.7128, longitude: -74.0060 },
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
    isActive: true,
    lastCheckIn: '2024-01-22T09:00:00Z',
    totalLogs: 15,
    pendingLogs: 2,
    approvedLogs: 13
  }
];

const Students: React.FC = () => {
  const { user } = useAuth();
  const { logEntries, checkIns, assignments } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

  // Get students assigned to this supervisor
  const supervisorAssignments = assignments.filter(
    assignment => assignment.supervisorId === user?.id && assignment.isActive
  );

  // Filter students based on search and status
  const filteredStudents = mockStudents.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.matricNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && student.isActive) ||
                         (statusFilter === 'inactive' && !student.isActive);
    return matchesSearch && matchesStatus;
  });

  const getStudentStats = (studentId: string) => {
    const studentLogs = logEntries.filter(entry => entry.studentId === studentId);
    const studentCheckIns = checkIns.filter(checkIn => checkIn.studentId === studentId);
    
    return {
      totalLogs: studentLogs.length,
      pendingLogs: studentLogs.filter(log => log.status === 'pending').length,
      approvedLogs: studentLogs.filter(log => log.status === 'approved').length,
      totalCheckIns: studentCheckIns.length,
      lastCheckIn: studentCheckIns[0]?.timestamp
    };
  };

  const handleViewStudent = (studentId: string) => {
    // Navigate to student details or open modal
    alert(`Viewing detailed information for student ${studentId}`);
  };

  const handleViewLogs = (studentId: string) => {
    // Navigate to student's logs
    alert(`Viewing logs for student ${studentId}`);
  };

  const handleSendEmail = (email: string) => {
    window.open(`mailto:${email}`, '_blank');
  };

  const handleOpenMap = (location: any) => {
    if (location) {
      const url = `https://www.google.com/maps?q=${location.latitude},${location.longitude}`;
      window.open(url, '_blank');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Students</h1>
        <p className="text-gray-600 mt-2">Manage and monitor your assigned students</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div className="sm:w-48">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
              >
                <option value="all">All Students</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Students Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredStudents.map((student) => {
          const stats = getStudentStats(student.id);
          
          return (
            <div key={student.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              {/* Student Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center space-x-4">
                  <img
                    src={student.avatar}
                    alt={student.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{student.name}</h3>
                    <p className="text-sm text-gray-600">{student.matricNumber}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        student.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {student.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Student Details */}
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="flex items-center space-x-2 text-gray-600 mb-1">
                      <BookOpen className="h-4 w-4" />
                      <span>Course</span>
                    </div>
                    <p className="font-medium text-gray-900">{student.course}</p>
                  </div>
                  <div>
                    <div className="flex items-center space-x-2 text-gray-600 mb-1">
                      <School className="h-4 w-4" />
                      <span>Institution</span>
                    </div>
                    <p className="font-medium text-gray-900 truncate">{student.institution}</p>
                  </div>
                </div>

                <div>
                  <div className="flex items-center space-x-2 text-gray-600 mb-1">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm">Placement Location</span>
                    <button
                      onClick={() => handleOpenMap(student.placementLocation)}
                      className="p-1 text-gray-400 hover:text-blue-600 rounded transition-colors"
                      title="View on map"
                    >
                      <Globe className="h-3 w-3" />
                    </button>
                  </div>
                  <p className="text-sm text-gray-900">{student.placementAddress}</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3 pt-4 border-t border-gray-200">
                  <div className="text-center">
                    <div className="text-lg font-bold text-blue-600">{stats.totalLogs}</div>
                    <div className="text-xs text-gray-600">Total Logs</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-orange-600">{stats.pendingLogs}</div>
                    <div className="text-xs text-gray-600">Pending</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-600">{stats.approvedLogs}</div>
                    <div className="text-xs text-gray-600">Approved</div>
                  </div>
                </div>

                {/* Last Check-in */}
                {stats.lastCheckIn && (
                  <div className="pt-3 border-t border-gray-200">
                    <div className="flex items-center space-x-2 text-gray-600 mb-1">
                      <Calendar className="h-4 w-4" />
                      <span className="text-sm">Last Check-in</span>
                    </div>
                    <p className="text-sm text-gray-900">
                      {new Date(stats.lastCheckIn).toLocaleDateString()} at{' '}
                      {new Date(stats.lastCheckIn).toLocaleTimeString()}
                    </p>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {/* <button
                      onClick={() => handleViewStudent(student.id)}
                      className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                      title="View details"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleViewLogs(student.id)}
                      className="p-2 text-gray-400 hover:text-green-600 rounded-lg hover:bg-green-50 transition-colors"
                      title="View logs"
                    >
                      <BookOpen className="h-4 w-4" />
                    </button> */}
                    <button
                      onClick={() => handleSendEmail(student.email)}
                      className="p-2 text-gray-400 hover:text-purple-600 rounded-lg hover:bg-purple-50 transition-colors"
                      title="Send email"
                    >
                      <Mail className="h-4 w-4" />
                    </button>
                  </div>
                  <Link
                    to={`/supervisor/students/${student.id}/progress`}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1"
                  >
                    <TrendingUp className="h-3 w-3" />
                    <span>Progress</span>
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredStudents.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          {searchTerm || statusFilter !== 'all' ? (
            <div>
              <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No students found</h3>
              <p className="text-gray-600 mb-4">Try adjusting your search or filter criteria</p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                }}
                className="text-blue-600 hover:text-blue-500 font-medium"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div>
              <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No students assigned</h3>
              <p className="text-gray-600">Students will appear here once they are assigned to you by an administrator</p>
            </div>
          )}
        </div>
      )}

      {/* Summary Stats */}
      {filteredStudents.length > 0 && (
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
            <div className="text-2xl font-bold text-blue-600">{filteredStudents.length}</div>
            <div className="text-sm text-gray-600">Total Students</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
            <div className="text-2xl font-bold text-green-600">
              {filteredStudents.filter(s => s.isActive).length}
            </div>
            <div className="text-sm text-gray-600">Active Students</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
            <div className="text-2xl font-bold text-orange-600">
              {filteredStudents.reduce((sum, student) => sum + getStudentStats(student.id).pendingLogs, 0)}
            </div>
            <div className="text-sm text-gray-600">Pending Reviews</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
            <div className="text-2xl font-bold text-purple-600">
              {filteredStudents.reduce((sum, student) => sum + getStudentStats(student.id).totalLogs, 0)}
            </div>
            <div className="text-sm text-gray-600">Total Log Entries</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Students;
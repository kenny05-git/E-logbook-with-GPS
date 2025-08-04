import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { 
  Users, 
  Search, 
  Eye,
  Mail,
  Star,
  Calendar,
  BookOpen,
  Award,
  TrendingUp
} from 'lucide-react';

// Mock student data for industrial supervisor
const mockIndustrialStudents = [
  {
    id: '1',
    name: 'John Smith',
    email: 'student@example.com',
    matricNumber: 'CS2024001',
    course: 'Computer Science',
    institution: 'University of Technology',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
    startDate: '2024-01-15',
    department: 'Software Development',
    supervisor: 'Dr. Sarah Johnson'
  }
];

const IndustrialStudents: React.FC = () => {
  const { user } = useAuth();
  const { logEntries } = useApp();
  const [searchTerm, setSearchTerm] = useState('');

  // Filter students based on search
  const filteredStudents = mockIndustrialStudents.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.matricNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStudentStats = (studentId: string) => {
    const studentLogs = logEntries.filter(entry => entry.studentId === studentId);
    const confirmedLogs = studentLogs.filter(log => log.industrialSupervisorConfirmation?.confirmed);
    const pendingConfirmations = studentLogs.filter(log => 
      log.status === 'approved' && !log.industrialSupervisorConfirmation?.confirmed
    );
    
    const averageRating = confirmedLogs.length > 0 
      ? (confirmedLogs.reduce((sum, log) => sum + (log.industrialSupervisorConfirmation?.rating || 0), 0) / confirmedLogs.length).toFixed(1)
      : '0';

    return {
      totalLogs: studentLogs.length,
      confirmedLogs: confirmedLogs.length,
      pendingConfirmations: pendingConfirmations.length,
      averageRating: parseFloat(averageRating)
    };
  };

  const handleViewStudent = (studentId: string) => {
    alert(`Viewing detailed information for student ${studentId}`);
  };

  const handleSendEmail = (email: string) => {
    window.open(`mailto:${email}`, '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Students</h1>
        <p className="text-gray-600 mt-2">Manage students under your industrial supervision</p>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
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
                    <p className="text-sm text-gray-500">{student.course}</p>
                  </div>
                </div>
              </div>

              {/* Student Details */}
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="flex items-center space-x-2 text-gray-600 mb-1">
                      <BookOpen className="h-4 w-4" />
                      <span>Institution</span>
                    </div>
                    <p className="font-medium text-gray-900 truncate">{student.institution}</p>
                  </div>
                  <div>
                    <div className="flex items-center space-x-2 text-gray-600 mb-1">
                      <Users className="h-4 w-4" />
                      <span>Department</span>
                    </div>
                    <p className="font-medium text-gray-900">{student.department}</p>
                  </div>
                </div>

                <div>
                  <div className="flex items-center space-x-2 text-gray-600 mb-1">
                    <Users className="h-4 w-4" />
                    <span className="text-sm">School Supervisor</span>
                  </div>
                  <p className="text-sm text-gray-900">{student.supervisor}</p>
                </div>

                {/* Performance Stats */}
                <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-200">
                  <div className="text-center">
                    <div className="text-lg font-bold text-blue-600">{stats.totalLogs}</div>
                    <div className="text-xs text-gray-600">Total Logs</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-600">{stats.confirmedLogs}</div>
                    <div className="text-xs text-gray-600">Confirmed</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center">
                    <div className="text-lg font-bold text-orange-600">{stats.pendingConfirmations}</div>
                    <div className="text-xs text-gray-600">Pending</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-1">
                      <div className="text-lg font-bold text-purple-600">{stats.averageRating}</div>
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    </div>
                    <div className="text-xs text-gray-600">Avg Rating</div>
                  </div>
                </div>

                {/* Start Date */}
                <div className="pt-3 border-t border-gray-200">
                  <div className="flex items-center space-x-2 text-gray-600 mb-1">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm">Started Placement</span>
                  </div>
                  <p className="text-sm text-gray-900">
                    {new Date(student.startDate).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleViewStudent(student.id)}
                      className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                      title="View details"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleSendEmail(student.email)}
                      className="p-2 text-gray-400 hover:text-purple-600 rounded-lg hover:bg-purple-50 transition-colors"
                      title="Send email"
                    >
                      <Mail className="h-4 w-4" />
                    </button>
                  </div>
                  <button
                    onClick={() => alert(`Viewing performance report for ${student.name}`)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1"
                  >
                    <TrendingUp className="h-3 w-3" />
                    <span>Performance</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredStudents.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          {searchTerm ? (
            <div>
              <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No students found</h3>
              <p className="text-gray-600 mb-4">Try adjusting your search criteria</p>
              <button
                onClick={() => setSearchTerm('')}
                className="text-blue-600 hover:text-blue-500 font-medium"
              >
                Clear search
              </button>
            </div>
          ) : (
            <div>
              <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No students assigned</h3>
              <p className="text-gray-600">Students will appear here once they are assigned to your workplace</p>
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
              {filteredStudents.reduce((sum, student) => sum + getStudentStats(student.id).confirmedLogs, 0)}
            </div>
            <div className="text-sm text-gray-600">Total Confirmations</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
            <div className="text-2xl font-bold text-orange-600">
              {filteredStudents.reduce((sum, student) => sum + getStudentStats(student.id).pendingConfirmations, 0)}
            </div>
            <div className="text-sm text-gray-600">Pending Reviews</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
            <div className="text-2xl font-bold text-purple-600">
              {filteredStudents.length > 0 
                ? (filteredStudents.reduce((sum, student) => sum + getStudentStats(student.id).averageRating, 0) / filteredStudents.length).toFixed(1)
                : '0'
              }
            </div>
            <div className="text-sm text-gray-600">Average Rating</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IndustrialStudents;
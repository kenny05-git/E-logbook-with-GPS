import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import StatusBadge from '../../components/UI/StatusBadge';
import {  
  Search, 
  Eye,
  MessageSquare,
  MapPin,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  User,
  FileText
} from 'lucide-react';

const LogReview: React.FC = () => {
  const { user } = useAuth();
  const { logEntries, assignments, updateLogEntry } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [studentFilter, setStudentFilter] = useState<string>('all');

  // Get students assigned to this supervisor
  const supervisorAssignments = assignments.filter(
    assignment => assignment.supervisorId === user?.id && assignment.isActive
  );
  const assignedStudentIds = supervisorAssignments.map(assignment => assignment.studentId);

  // Filter log entries for assigned students
  const studentLogEntries = logEntries.filter(entry => 
  assignedStudentIds.includes(entry.studentId) &&
  entry.industrialSupervisorConfirmation?.confirmed === true &&
  !entry.supervisorConfirmation?.confirmed
);


  // Apply filters
  const filteredEntries = studentLogEntries.filter(entry => {
    const matchesSearch = entry.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         new Date(entry.date).toLocaleDateString().includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || entry.status === statusFilter;
    const matchesStudent = studentFilter === 'all' || entry.studentId === studentFilter;
    return matchesSearch && matchesStatus && matchesStudent;
  });

  // Get unique students for filter dropdown
  const uniqueStudents = Array.from(
    new Set(studentLogEntries.map(entry => entry.studentId))
  ).map(studentId => {
    const entry = studentLogEntries.find(e => e.studentId === studentId);
    return { id: studentId, name: entry?.studentName || '' };
  });

  const handleQuickAction = async (entryId: string, action: 'approve' | 'reject') => {
    const feedback = action === 'approve' 
      ? 'Good work! Keep up the excellent progress.'
      : 'Please provide more details about your activities.';
    
    const updates = {
      status: action === 'approve' ? 'approved' as const : 'rejected' as const,
      supervisorFeedback: feedback,
      approvedBy: user?.name,
      approvedAt: new Date().toISOString()
    };

    updateLogEntry(entryId, updates);
  };


  const handleSupervisorConfirm = (entryId: string) => {
  const confirmNow = window.confirm('Are you sure you want to confirm this log entry as a supervisor?');
  if (!confirmNow) return;

  updateLogEntry(entryId, {
    supervisorConfirmation: {
      confirmed: true,
      confirmedBy: user?.name || 'Supervisor',
      confirmedAt: new Date().toISOString()
    }
  });

  alert('Log entry confirmed successfully.');
};



  const handleReviewEntry = (entryId: string) => {
    // Open review modal with feedback form
    const feedback = prompt('Enter your feedback for this log entry:');
    if (feedback) {
      const action = confirm('Approve this entry? Click OK to approve, Cancel to reject.');
      handleQuickAction(entryId, action ? 'approve' : 'reject');
    }
  };

  const handleOpenMap = (location: any) => {
    if (location) {
      const url = `https://www.google.com/maps?q=${location.latitude},${location.longitude}`;
      window.open(url, '_blank');
    }
  };

  const pendingCount = filteredEntries.filter(entry => entry.status === 'pending').length;
  const approvedCount = filteredEntries.filter(entry => entry.status === 'approved').length;
  const rejectedCount = filteredEntries.filter(entry => entry.status === 'rejected').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Log Review</h1>
        <p className="text-gray-600 mt-2">Review and provide feedback on student log entries</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="bg-orange-100 p-3 rounded-full">
              <Clock className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Review</p>
              <p className="text-2xl font-bold text-gray-900">{pendingCount}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="bg-green-100 p-3 rounded-full">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Approved</p>
              <p className="text-2xl font-bold text-gray-900">{approvedCount}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="bg-red-100 p-3 rounded-full">
              <XCircle className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Rejected</p>
              <p className="text-2xl font-bold text-gray-900">{rejectedCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search entries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          <div>
            <select
              value={studentFilter}
              onChange={(e) => setStudentFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Students</option>
              {uniqueStudents.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Log Entries List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        {filteredEntries.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {filteredEntries.map((entry) => (
              <div key={entry.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-3">
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-gray-400" />
                        <span className="text-sm font-medium text-gray-900">
                          {entry.studentName}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {new Date(entry.date).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                      <StatusBadge status={entry.status} size="sm" />
                    </div>

                    <p className="text-gray-700 mb-4 leading-relaxed">
                      {entry.description}
                    </p>

                    {entry.location && (
                      <div className="flex items-center space-x-2 text-sm text-gray-600 mb-3">
                        <MapPin className="h-4 w-4" />
                        <span>{entry.location.address}</span>
                        <button
                          onClick={() => handleOpenMap(entry.location)}
                          className="text-blue-600 hover:text-blue-500 font-medium"
                        >
                          (View on map)
                        </button>
                      </div>
                    )}

                    {entry.supervisorFeedback && (
                      <div className={`border rounded-lg p-4 mb-3 ${
                        entry.status === 'approved' 
                          ? 'bg-green-50 border-green-200' 
                          : 'bg-red-50 border-red-200'
                      }`}>
                        <div className="flex items-start space-x-2">
                          <MessageSquare className={`h-4 w-4 mt-0.5 ${
                            entry.status === 'approved' ? 'text-green-600' : 'text-red-600'
                          }`} />
                          <div>
                            <p className={`text-sm font-medium mb-1 ${
                              entry.status === 'approved' ? 'text-green-800' : 'text-red-800'
                            }`}>
                              Your Feedback
                            </p>
                            <p className={`text-sm ${
                              entry.status === 'approved' ? 'text-green-700' : 'text-red-700'
                            }`}>
                              {entry.supervisorFeedback}
                            </p>
                            {entry.approvedBy && entry.approvedAt && (
                              <p className={`text-xs mt-2 ${
                                entry.status === 'approved' ? 'text-green-600' : 'text-red-600'
                              }`}>
                                {entry.status === 'approved' ? 'Approved' : 'Rejected'} by {entry.approvedBy} on{' '}
                                {new Date(entry.approvedAt).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span>Submitted: {new Date(entry.createdAt).toLocaleDateString()}</span>
                      {entry.updatedAt !== entry.createdAt && (
                        <span>Updated: {new Date(entry.updatedAt).toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col items-end space-y-2 ml-4">
                    <Link
                      to={`/supervisor/logs/${entry.id}`}
                      className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                      title="Review log"
                    >
                      <Eye className="h-4 w-4" />
                    </Link>
                    {!entry.supervisorConfirmation?.confirmed && (
                      <button
                        onClick={() => handleSupervisorConfirm(entry.id)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg text-sm font-medium transition-colors mt-2"
                      >
                        Mark as Reviewed
                      </button>
                    )}
                    {entry.supervisorConfirmation?.confirmed && (
                      <p className="text-xs text-blue-600 mt-2">
                        Confirmed by {entry.supervisorConfirmation.confirmedBy} on{' '}
                        {new Date(entry.supervisorConfirmation.confirmedAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center">
            {searchTerm || statusFilter !== 'all' || studentFilter !== 'all' ? (
              <div>
                <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No entries found</h3>
                <p className="text-gray-600 mb-4">Try adjusting your search or filter criteria</p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('all');
                    setStudentFilter('all');
                  }}
                  className="text-blue-600 hover:text-blue-500 font-medium"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <div>
                <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No log entries yet</h3>
                <p className="text-gray-600">Log entries from your assigned students will appear here</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LogReview;
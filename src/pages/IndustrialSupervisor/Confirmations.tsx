import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { 
  CheckCircle, 
  Search, 
  Filter,
  Eye,
  Star,
  Calendar,
  User,
  MessageSquare,
  Award,
  Clock,
  XCircle
} from 'lucide-react';

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

const Confirmations: React.FC = () => {
  const { user } = useAuth();
  const { logEntries, updateLogEntry } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedEntry, setSelectedEntry] = useState<any>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmationData, setConfirmationData] = useState({
    confirmed: true,
    feedback: '',
    rating: 5
  });

  // Filter entries for students assigned to this industrial supervisor
  const studentLogEntries = logEntries.filter(entry => {
  return entry.industrialSupervisorId === user?.$id; // or user?.id depending on your user object
});


  // Apply filters
  const filteredEntries = studentLogEntries.filter(entry => {
    const matchesSearch = entry.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         new Date(entry.date).toLocaleDateString().includes(searchTerm);
    
    let matchesStatus = true;
    if (statusFilter === 'pending') {
      matchesStatus = entry.status === 'approved' && !entry.industrialSupervisorConfirmation?.confirmed;
    } else if (statusFilter === 'confirmed') {
      matchesStatus = entry.industrialSupervisorConfirmation?.confirmed === true;
    } else if (statusFilter === 'not_confirmed') {
      matchesStatus = entry.industrialSupervisorConfirmation?.confirmed === false;
    }
    
    return matchesSearch && matchesStatus;
  });

  const handleConfirmEntry = (entry: any) => {
    setSelectedEntry(entry);
    setShowConfirmModal(true);
    setConfirmationData({
      confirmed: true,
      feedback: '',
      rating: 5
    });
  };

  const handleRejectEntry = (entry: any) => {
    setSelectedEntry(entry);
    setShowConfirmModal(true);
    setConfirmationData({
      confirmed: false,
      feedback: '',
      rating: 1
    });
  };

  const handleSubmitConfirmation = () => {
    if (!selectedEntry || !user) return;

    const updates = {
      industrialSupervisorConfirmation: {
        confirmed: confirmationData.confirmed,
        confirmedBy: user.name,
        confirmedAt: new Date().toISOString(),
        feedback: confirmationData.feedback,
        rating: confirmationData.rating
      }
    };

    updateLogEntry(selectedEntry.id, updates);
    setShowConfirmModal(false);
    setSelectedEntry(null);
  };

  const pendingCount = filteredEntries.filter(entry => 
    entry.status === 'approved' && !entry.industrialSupervisorConfirmation?.confirmed
  ).length;
  
  const confirmedCount = filteredEntries.filter(entry => 
    entry.industrialSupervisorConfirmation?.confirmed === true
  ).length;
  
  const rejectedCount = filteredEntries.filter(entry => 
    entry.industrialSupervisorConfirmation?.confirmed === false
  ).length;
  

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Student Activity Confirmations</h1>
        <p className="text-gray-600 mt-2">Confirm and rate student workplace activities</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="bg-orange-100 p-3 rounded-full">
              <Clock className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Confirmation</p>
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
              <p className="text-sm font-medium text-gray-600">Confirmed</p>
              <p className="text-2xl font-bold text-gray-900">{confirmedCount}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="bg-red-100 p-3 rounded-full">
              <XCircle className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Not Confirmed</p>
              <p className="text-2xl font-bold text-gray-900">{rejectedCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <option value="all">All Entries</option>
              <option value="pending">Pending Confirmation</option>
              <option value="confirmed">Confirmed</option>
              <option value="not_confirmed">Not Confirmed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Entries List */}
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
                      {entry.industrialSupervisorConfirmation ? (
                        <StatusBadge 
                          status={entry.industrialSupervisorConfirmation.confirmed ? 'approved' : 'rejected'} 
                          size="sm" 
                        />
                      ) : (
                        <StatusBadge status="pending" size="sm" />
                      )}
                    </div>

                    <p className="text-gray-700 mb-4 leading-relaxed">
                      {entry.description}
                    </p>

                    {entry.supervisorFeedback && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-3">
                        <div className="flex items-start space-x-2">
                          <MessageSquare className="h-4 w-4 text-blue-600 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-blue-800 mb-1">School Supervisor Feedback</p>
                            <p className="text-sm text-blue-700">{entry.supervisorFeedback}</p>
                            {entry.approvedBy && entry.approvedAt && (
                              <p className="text-xs text-blue-600 mt-2">
                                Approved by {entry.approvedBy} on {new Date(entry.approvedAt).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {entry.industrialSupervisorConfirmation && (
                      <div className={`border rounded-lg p-4 mb-3 ${
                        entry.industrialSupervisorConfirmation.confirmed 
                          ? 'bg-green-50 border-green-200' 
                          : 'bg-red-50 border-red-200'
                      }`}>
                        <div className="flex items-start space-x-2">
                          <Award className={`h-4 w-4 mt-0.5 ${
                            entry.industrialSupervisorConfirmation.confirmed ? 'text-green-600' : 'text-red-600'
                          }`} />
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <p className={`text-sm font-medium ${
                                entry.industrialSupervisorConfirmation.confirmed ? 'text-green-800' : 'text-red-800'
                              }`}>
                                Your Confirmation
                              </p>
                              {entry.industrialSupervisorConfirmation.confirmed && (
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
                              )}
                            </div>
                            <p className={`text-sm ${
                              entry.industrialSupervisorConfirmation.confirmed ? 'text-green-700' : 'text-red-700'
                            }`}>
                              {entry.industrialSupervisorConfirmation.feedback}
                            </p>
                            <p className={`text-xs mt-2 ${
                              entry.industrialSupervisorConfirmation.confirmed ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {entry.industrialSupervisorConfirmation.confirmed ? 'Confirmed' : 'Not confirmed'} by {entry.industrialSupervisorConfirmation.confirmedBy} on{' '}
                              {new Date(entry.industrialSupervisorConfirmation.confirmedAt || '').toLocaleDateString()}
                            </p>
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

                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => alert(`Viewing detailed information for entry ${entry.id}`)}
                      className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                      title="View details"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    
                    {entry.status === 'approved' && entry.industrialSupervisorConfirmation?.confirmed === undefined && (
                      <>
                        <button
                          onClick={() => handleConfirmEntry(entry)}
                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1"
                        >
                          <CheckCircle className="h-3 w-3" />
                          <span>Confirm</span>
                        </button>
                        <button
                          onClick={() => handleRejectEntry(entry)}
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1"
                        >
                          <XCircle className="h-3 w-3" />
                          <span>Reject</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center">
            <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No entries found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && selectedEntry && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                {confirmationData.confirmed ? 'Confirm' : 'Reject'} Student Activity
              </h3>
              <p className="text-gray-600 mt-1">
                {selectedEntry.studentName} - {new Date(selectedEntry.date).toLocaleDateString()}
              </p>
            </div>
            
            <div className="p-6 space-y-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Student's Activity Description:</h4>
                <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{selectedEntry.description}</p>
              </div>

              {confirmationData.confirmed && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Performance Rating
                  </label>
                  <div className="flex items-center space-x-2">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <button
                        key={rating}
                        onClick={() => setConfirmationData(prev => ({ ...prev, rating }))}
                        className="p-1"
                      >
                        <Star
                          className={`h-6 w-6 ${
                            rating <= confirmationData.rating
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          } hover:text-yellow-400 transition-colors`}
                        />
                      </button>
                    ))}
                    <span className="ml-2 text-sm text-gray-600">
                      {confirmationData.rating}/5 stars
                    </span>
                  </div>
                </div>
              )}

              <div>
                <label htmlFor="feedback" className="block text-sm font-medium text-gray-700 mb-2">
                  {confirmationData.confirmed ? 'Confirmation Feedback' : 'Reason for Rejection'}
                </label>
                <textarea
                  id="feedback"
                  rows={4}
                  value={confirmationData.feedback}
                  onChange={(e) => setConfirmationData(prev => ({ ...prev, feedback: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  placeholder={confirmationData.confirmed 
                    ? "Provide feedback on the student's performance and activities..."
                    : "Explain why this activity cannot be confirmed..."
                  }
                />
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitConfirmation}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  confirmationData.confirmed
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'bg-red-600 hover:bg-red-700 text-white'
                }`}
              >
                {confirmationData.confirmed ? 'Confirm Activity' : 'Reject Activity'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Confirmations;
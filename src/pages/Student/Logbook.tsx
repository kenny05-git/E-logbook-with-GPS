import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import StatusBadge from '../../components/UI/StatusBadge';
import { 
  Plus, 
  Calendar, 
  MapPin, 
  Search, 
  Filter,
  Eye,
  Edit,
  Trash2,
  FileText
} from 'lucide-react';

const Logbook: React.FC = () => {
  const { user } = useAuth();
  const { logEntries, deleteLogEntry } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Filter entries for current user
  const userLogEntries = logEntries.filter(entry => entry.studentId === user?.id);

  // Apply filters
  const filteredEntries = userLogEntries.filter(entry => {
    const matchesSearch = entry.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         new Date(entry.date).toLocaleDateString().includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || entry.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleDeleteEntry = (id: string) => {
    if (window.confirm('Are you sure you want to delete this log entry?')) {
      deleteLogEntry(id);
    }
  };

  const handleViewEntry = (entryId: string) => {
    // Create a modal or navigate to detailed view
    alert(`Viewing detailed information for log entry ${entryId}`);
  };

  const handleEditEntry = (entryId: string) => {
    // Navigate to edit page or open edit modal
    alert(`Editing log entry ${entryId}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Logbook</h1>
          <p className="text-gray-600 mt-2">Track your daily placement activities and progress</p>
        </div>
        <Link
          to="/student/logbook/new"
          className="mt-4 sm:mt-0 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2 w-fit"
        >
          <Plus className="h-5 w-5" />
          <span>New Entry</span>
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
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
          <div className="sm:w-48">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
              >
                <option value="all">All Status</option>
                <option value="draft">Draft</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
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
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className="text-sm font-medium text-gray-900">
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
                      </div>
                    )}

                    {entry.supervisorFeedback && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-3">
                        <div className="flex items-start space-x-2">
                          <FileText className="h-4 w-4 text-green-600 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-green-800 mb-1">Supervisor Feedback</p>
                            <p className="text-sm text-green-700">{entry.supervisorFeedback}</p>
                            {entry.approvedBy && entry.approvedAt && (
                              <p className="text-xs text-green-600 mt-2">
                                Approved by {entry.approvedBy} on {new Date(entry.approvedAt).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span>Created: {new Date(entry.createdAt).toLocaleDateString()}</span>
                      {entry.updatedAt !== entry.createdAt && (
                        <span>Updated: {new Date(entry.updatedAt).toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    <Link
                      to={`/student/logbook/${entry.id}`}
                      className="ml-4 p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <Eye className="h-4 w-4" />
                   </Link>
                    {(entry.status === 'draft' || entry.status === 'rejected') && (
                      <>
                        <button
                          onClick={() => handleEditEntry(entry.id)}
                          className="p-2 text-gray-400 hover:text-green-600 rounded-lg hover:bg-green-50 transition-colors"
                          title="Edit entry"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteEntry(entry.id)}
                          className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                          title="Delete entry"
                        >
                          <Trash2 className="h-4 w-4" />
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
            {searchTerm || statusFilter !== 'all' ? (
              <div>
                <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No entries found</h3>
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
                <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No log entries yet</h3>
                <p className="text-gray-600 mb-6">Start documenting your placement activities and experiences</p>
                <Link
                  to="/student/logbook/new"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors inline-flex items-center space-x-2"
                >
                  <Plus className="h-5 w-5" />
                  <span>Create Your First Entry</span>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Logbook;
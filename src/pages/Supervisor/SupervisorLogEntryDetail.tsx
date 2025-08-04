import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { BookOpen, MapPin, Calendar, User } from 'lucide-react';
import StatusBadge from '../../components/UI/StatusBadge';

const SupervisorLogEntryDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { logEntries, updateLogEntry } = useApp();

  const [entry, setEntry] = useState<any>(null);
  const [feedback, setFeedback] = useState('');
  const [status, setStatus] = useState<'draft' | 'pending' | 'approved' | 'rejected' | undefined>('approved');

  useEffect(() => {
    const log = logEntries.find((log) => log.id === id);
    console.log("Loaded log:", log);
    if (log) {
      setEntry(log);
      setFeedback(log.feedback || '');
      setStatus(log.status);
    }
  }, [id, logEntries]);

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateLogEntry(id!, { feedback, status });
    navigate('/supervisor/logs');
  };

  if (!entry) return <div className="p-6">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center space-x-2 mb-4">
        <BookOpen className="h-6 w-6 text-blue-600" />
        <h1 className="text-2xl font-bold text-gray-900">Log Entry Details</h1>
      </div>

      <div className="bg-white p-6 rounded-xl shadow border space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2 text-gray-700">
            <User className="h-4 w-4" />
            <span>{entry.studentName}</span>
          </div>
          <StatusBadge status={entry.status} />
        </div>

        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Calendar className="h-4 w-4" />
          <span>{new Date(entry.date).toDateString()}</span>
        </div>

        <p className="text-gray-800">{entry.description}</p>

        {entry.location && (
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <MapPin className="h-4 w-4" />
            <span>Location Verified</span>
          </div>
        )}

        <div className="text-xs text-gray-400">
          Submitted: {new Date(entry.createdAt).toLocaleString()}
        </div>
      </div>

      {/* Feedback Form or Display */}
      <div className="mt-8">
        {entry.status === 'pending' ? (
          <form
            onSubmit={handleReviewSubmit}
            className="bg-white border rounded-xl shadow p-6 space-y-4"
          >
            <h2 className="text-lg font-semibold text-gray-900">Provide Feedback</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Feedback</label>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="w-full border rounded-md p-2"
                rows={4}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as 'approved' | 'rejected')}
                className="w-full border rounded-md p-2"
              >
                <option value="approved">Approve</option>
                <option value="rejected">Reject</option>
              </select>
            </div>

            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Submit Review
            </button>
          </form>
        ) : (
          <div className="mt-4 bg-gray-50 p-4 rounded-xl border">
            <h2 className="text-sm font-semibold text-gray-800 mb-2">Supervisor Feedback</h2>
            <p className="text-gray-700 text-sm">{entry.feedback ? entry.feedback : 'No feedback given.'}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SupervisorLogEntryDetail;

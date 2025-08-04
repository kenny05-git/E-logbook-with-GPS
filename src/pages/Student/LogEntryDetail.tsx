import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import StatusBadge from '../../components/UI/StatusBadge';
import { FileText, CalendarDays, Paperclip, Pencil } from 'lucide-react';

const LogEntryDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { logEntries } = useApp();

  const entry = logEntries.find(entry => entry.id === id);

  if (!entry) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-semibold text-gray-800">Log entry not found</h2>
        <p className="text-gray-600 mt-2">The entry might have been deleted or doesn't exist.</p>
      </div>
    );
  }

  const canEdit = entry.status === 'pending' || entry.status === 'rejected';

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-gray-700">
            <CalendarDays className="h-5 w-5 text-blue-500" />
            <span className="text-sm font-medium">
              {new Date(entry.date).toLocaleDateString(undefined, {
                weekday: 'short',
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </span>
          </div>
          <StatusBadge status={entry.status} size="md" />
        </div>

        {/* Title */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <FileText className="h-6 w-6 text-blue-600 mr-2" />
            Log Entry Details
          </h1>

          {canEdit && (
            <button
              onClick={() => navigate(`/student/logbook/edit/${entry.id}`)}
              className="flex items-center space-x-2 bg-yellow-500 hover:bg-yellow-600 text-white text-sm px-4 py-2 rounded-lg transition"
            >
              <Pencil className="h-4 w-4" />
              <span>Edit</span>
            </button>
          )}
        </div>

        {/* Description */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Description</h2>
          <p className="whitespace-pre-line text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg border">
            {entry.description}
          </p>
        </div>

        {/* Supervisor Feedback */}
        {entry.supervisorFeedback && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-green-800 mb-2">Supervisor Feedback</h2>
            <p className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg">
              {entry.supervisorFeedback}
            </p>
          </div>
        )}

        {/* Attachment */}
        {entry.attachment && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
              <Paperclip className="h-5 w-5 mr-2 text-purple-600" />
              Attachment
            </h2>
            <a
              href={entry.attachment}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-purple-600 hover:bg-purple-700 text-white text-sm px-4 py-2 rounded-lg transition-colors"
            >
              View / Download File
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default LogEntryDetail;

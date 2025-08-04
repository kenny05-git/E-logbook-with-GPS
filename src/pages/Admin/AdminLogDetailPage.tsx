import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import StatusBadge from '../../components/UI/StatusBadge';
import { ArrowLeft } from 'lucide-react';

const LogDetailPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { logEntries } = useApp();

  const log = logEntries.find((entry) => entry.id === id);

  if (!log) {
    return (
      <div className="p-8 text-center text-red-600 font-semibold">
        Log entry not found.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-blue-600 hover:underline mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      <h1 className="text-2xl font-bold text-gray-900 mb-4">Log Details</h1>

      <div className="bg-white shadow border border-gray-200 rounded-xl p-6 space-y-4">
        <div>
          <p className="text-sm text-gray-500">Student</p>
          <p className="text-lg font-medium text-gray-900">{log.studentName}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Date</p>
          <p className="text-lg font-medium text-gray-900">{new Date(log.date).toLocaleDateString()}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Activity</p>
          <p className="text-gray-800">{log.activity}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Status</p>
          <StatusBadge status={log.status} />
        </div>
      </div>
    </div>
  );
};

export default LogDetailPage;

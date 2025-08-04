import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { FileText, CheckCircle, Users, BookOpen } from 'lucide-react';

const AnalyticsPage: React.FC = () => {
  const data = [
    { name: 'Mon', logs: 14, checkins: 9, approvedLogs: 5, rejectedLogs: 2, pendingLogs: 7 },
    { name: 'Tue', logs: 22, checkins: 17, approvedLogs: 12, rejectedLogs: 3, pendingLogs: 7 },
    { name: 'Wed', logs: 10, checkins: 8, approvedLogs: 6, rejectedLogs: 1, pendingLogs: 3 },
    { name: 'Thu', logs: 30, checkins: 25, approvedLogs: 20, rejectedLogs: 4, pendingLogs: 6 },
    { name: 'Fri', logs: 25, checkins: 21, approvedLogs: 18, rejectedLogs: 2, pendingLogs: 5 },
  ];

  const departmentBreakdown = [
    { dept: 'Computer Science', approved: 20, rejected: 5, pending: 10 },
    { dept: 'Information Tech', approved: 15, rejected: 3, pending: 7 },
    { dept: 'Software Eng.', approved: 18, rejected: 4, pending: 5 },
    { dept: 'Cybersecurity', approved: 8, rejected: 2, pending: 3 },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">System Analytics</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-white rounded-2xl p-6 shadow border-l-4 border-blue-500">
          <div className="flex items-center gap-3">
            <Users className="w-6 h-6 text-blue-500" />
            <h3 className="text-lg font-semibold text-gray-800">Assignments</h3>
          </div>
          <p className="text-2xl font-bold text-gray-900 mt-4">42</p>
          <p className="text-sm text-gray-500">Total Student-Supervisor Assignments</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow border-l-4 border-purple-500">
          <div className="flex items-center gap-3">
            <FileText className="w-6 h-6 text-purple-500" />
            <h3 className="text-lg font-semibold text-gray-800">Logs</h3>
          </div>
          <p className="text-2xl font-bold text-gray-900 mt-4">128</p>
          <p className="text-sm text-gray-500">Total Log Entries Submitted</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow border-l-4 border-green-500">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-green-500" />
            <h3 className="text-lg font-semibold text-gray-800">Check-ins</h3>
          </div>
          <p className="text-2xl font-bold text-gray-900 mt-4">76</p>
          <p className="text-sm text-gray-500">GPS Check-ins Recorded</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow border-l-4 border-orange-500">
          <div className="flex items-center gap-3">
            <BookOpen className="w-6 h-6 text-orange-500" />
            <h3 className="text-lg font-semibold text-gray-800">Supervisor Approvals</h3>
          </div>
          <p className="text-2xl font-bold text-gray-900 mt-4">61</p>
          <p className="text-sm text-gray-500">Total Approved Log Entries</p>
        </div>
      </div>

      {/* Charts */}
      <div className="bg-white p-6 rounded-2xl shadow border border-gray-200 mb-10">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Weekly Overview</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="logs" fill="#7c3aed" name="Logs" radius={[4, 4, 0, 0]} />
            <Bar dataKey="checkins" fill="#10b981" name="Check-ins" radius={[4, 4, 0, 0]} />
            <Bar dataKey="approvedLogs" fill="#f97316" name="Approved Logs" radius={[4, 4, 0, 0]} />
            <Bar dataKey="rejectedLogs" fill="#ef4444" name="Rejected Logs" radius={[4, 4, 0, 0]} />
            <Bar dataKey="pendingLogs" fill="#6366f1" name="Pending Logs" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Departmental Breakdown */}
      <div className="bg-white p-6 rounded-2xl shadow border border-gray-200">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Departmental Log Review Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {departmentBreakdown.map((dept, idx) => (
            <div key={idx} className="border-l-4 border-gray-200 p-4 rounded-xl bg-gray-50 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{dept.dept}</h3>
              <div className="flex justify-between text-sm">
                <span className="text-green-600">Approved: {dept.approved}</span>
                <span className="text-red-600">Rejected: {dept.rejected}</span>
                <span className="text-indigo-600">Pending: {dept.pending}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;

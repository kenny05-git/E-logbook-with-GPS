import React, { useState } from 'react';
import { Download, UploadCloud, Database, RefreshCcw } from 'lucide-react';

const BackupPage: React.FC = () => {
  const [backupStatus, setBackupStatus] = useState('Idle');
  const [restoreStatus, setRestoreStatus] = useState('Idle');

  const handleBackup = () => {
    setBackupStatus('Backing up...');
    setTimeout(() => {
      setBackupStatus('Backup completed successfully!');
    }, 2000);
  };

  const handleRestore = () => {
    setRestoreStatus('Restoring...');
    setTimeout(() => {
      setRestoreStatus('Restore completed successfully!');
    }, 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Backup & Restore</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Backup Card */}
        <div className="bg-white p-6 rounded-xl shadow border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <UploadCloud className="w-6 h-6 text-blue-500" />
            <h2 className="text-xl font-semibold text-gray-800">Create Backup</h2>
          </div>
          <p className="text-sm text-gray-600 mb-4">Export current system data for safekeeping.</p>
          <button
            onClick={handleBackup}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            <Download className="inline-block w-4 h-4 mr-2" /> Backup Now
          </button>
          <p className="text-sm text-gray-500 mt-3">Status: {backupStatus}</p>
        </div>

        {/* Restore Card */}
        <div className="bg-white p-6 rounded-xl shadow border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <RefreshCcw className="w-6 h-6 text-green-500" />
            <h2 className="text-xl font-semibold text-gray-800">Restore Backup</h2>
          </div>
          <p className="text-sm text-gray-600 mb-4">Upload a previous backup to restore the system state.</p>
          <input
            type="file"
            accept=".json,.zip"
            className="mb-4 block text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
          />
          <button
            onClick={handleRestore}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
          >
            <Database className="inline-block w-4 h-4 mr-2" /> Restore Backup
          </button>
          <p className="text-sm text-gray-500 mt-3">Status: {restoreStatus}</p>
        </div>
      </div>
    </div>
  );
};

export default BackupPage;

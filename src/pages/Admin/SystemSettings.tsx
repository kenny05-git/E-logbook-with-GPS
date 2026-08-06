import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  Settings as SettingsIcon, 
  Database, 
  Shield, 
  Mail, 
  Globe,
  Bell,
  Save,
  RefreshCw,
  CheckCircle,
  Monitor,
  BarChart3
} from 'lucide-react';

const SystemSettings: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    // General Settings
    systemName: 'Mountain Top University Electronic Logbook Tracker',
    systemDescription: 'Comprehensive placement tracking and management system',
    maintenanceMode: false,
    allowRegistration: true,
    requireEmailVerification: true,
    
    // Security Settings
    sessionTimeout: 30, // minutes
    maxLoginAttempts: 5,
    passwordMinLength: 8,
    requireStrongPasswords: true,
    enableTwoFactor: false,
    
    // Email Settings
    smtpHost: 'smtp.gmail.com',
    smtpPort: 587,
    smtpUsername: 'system@university.edu',
    smtpPassword: '••••••••',
    emailFromName: 'Placement Tracker',
    emailFromAddress: 'noreply@university.edu',
    
    // Notification Settings
    enableEmailNotifications: true,
    enablePushNotifications: true,
    notifyAdminsOnNewUser: true,
    notifyAdminsOnErrors: true,
    
    // Data & Backup Settings
    autoBackupEnabled: true,
    backupFrequency: 'daily', // daily, weekly, monthly
    retentionPeriod: 90, // days
    dataExportFormat: 'json', // json, csv, excel
    
    // Performance Settings
    maxFileUploadSize: 10, // MB
    sessionCleanupInterval: 60, // minutes
    logRetentionDays: 365,
    enableCaching: true,
    
    // Feature Flags
    enableGPSTracking: true,
    enableAutoCheckIn: true,
    enableFileAttachments: true,
    enableReports: true,
    enableAnalytics: true
  });

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSaveSettings = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert('System settings saved successfully!');
    } catch (error) {
      alert('Failed to save settings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleTestEmail = () => {
    alert('Test email sent successfully!');
  };

  const handleBackupNow = () => {
    alert('Manual backup initiated. You will be notified when complete.');
  };

  const SettingSection: React.FC<{ 
    title: string; 
    description: string; 
    icon: React.ComponentType<any>;
    children: React.ReactNode;
  }> = ({ title, description, icon: Icon, children }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="bg-blue-100 p-2 rounded-lg">
          <Icon className="h-5 w-5 text-blue-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </div>
      <div className="space-y-6">
        {children}
      </div>
    </div>
  );

  const ToggleSetting: React.FC<{
    label: string;
    description: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
    disabled?: boolean;
  }> = ({ label, description, checked, onChange, disabled = false }) => (
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <div className="font-medium text-gray-900">{label}</div>
        <div className="text-sm text-gray-600">{description}</div>
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
          className="sr-only peer"
        />
        <div className={`w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}></div>
      </label>
    </div>
  );

  const InputSetting: React.FC<{
    label: string;
    description?: string;
    value: string | number;
    onChange: (value: string | number) => void;
    type?: string;
    placeholder?: string;
    unit?: string;
  }> = ({ label, description, value, onChange, type = 'text', placeholder, unit }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      {description && <p className="text-sm text-gray-600 mb-2">{description}</p>}
      <div className="flex items-center space-x-2">
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(type === 'number' ? parseInt(e.target.value) : e.target.value)}
          placeholder={placeholder}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        {unit && <span className="text-sm text-gray-500">{unit}</span>}
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
              <SettingsIcon className="h-8 w-8 text-blue-600" />
              <span>System Settings</span>
            </h1>
            <p className="text-gray-600 mt-2">Configure system-wide settings and preferences</p>
          </div>
          <button
            onClick={handleSaveSettings}
            disabled={loading}
            className="mt-4 sm:mt-0 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-semibold transition-all flex items-center space-x-2"
          >
            {loading ? (
              <>
                <RefreshCw className="h-5 w-5 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="h-5 w-5" />
                <span>Save All Settings</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* System Status */}
      <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-8">
        <div className="flex items-center space-x-3">
          <CheckCircle className="h-6 w-6 text-green-600" />
          <div>
            <h3 className="text-lg font-semibold text-green-900">System Status: Operational</h3>
            <p className="text-green-700">All services are running normally • Last updated: {new Date().toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        {/* General Settings */}
        <SettingSection
          title="General Settings"
          description="Basic system configuration and behavior"
          icon={Globe}
        >
          <InputSetting
            label="System Name"
            description="The name displayed throughout the application"
            value={settings.systemName}
            onChange={(value) => handleSettingChange('systemName', value)}
          />
          <InputSetting
            label="System Description"
            description="Brief description of the system's purpose"
            value={settings.systemDescription}
            onChange={(value) => handleSettingChange('systemDescription', value)}
          />
          <ToggleSetting
            label="Maintenance Mode"
            description="Temporarily disable access for all users except admins"
            checked={settings.maintenanceMode}
            onChange={(checked) => handleSettingChange('maintenanceMode', checked)}
          />
          <ToggleSetting
            label="Allow User Registration"
            description="Enable new users to register for accounts"
            checked={settings.allowRegistration}
            onChange={(checked) => handleSettingChange('allowRegistration', checked)}
          />
          <ToggleSetting
            label="Require Email Verification"
            description="Users must verify their email before accessing the system"
            checked={settings.requireEmailVerification}
            onChange={(checked) => handleSettingChange('requireEmailVerification', checked)}
          />
        </SettingSection>

        {/* Security Settings */}
        <SettingSection
          title="Security & Authentication"
          description="Configure security policies and authentication requirements"
          icon={Shield}
        >
          <InputSetting
            label="Session Timeout"
            description="Automatically log out inactive users"
            value={settings.sessionTimeout}
            onChange={(value) => handleSettingChange('sessionTimeout', value)}
            type="number"
            unit="minutes"
          />
          <InputSetting
            label="Maximum Login Attempts"
            description="Lock account after this many failed login attempts"
            value={settings.maxLoginAttempts}
            onChange={(value) => handleSettingChange('maxLoginAttempts', value)}
            type="number"
          />
          <InputSetting
            label="Minimum Password Length"
            description="Minimum number of characters required for passwords"
            value={settings.passwordMinLength}
            onChange={(value) => handleSettingChange('passwordMinLength', value)}
            type="number"
            unit="characters"
          />
          <ToggleSetting
            label="Require Strong Passwords"
            description="Enforce uppercase, lowercase, numbers, and special characters"
            checked={settings.requireStrongPasswords}
            onChange={(checked) => handleSettingChange('requireStrongPasswords', checked)}
          />
          <ToggleSetting
            label="Enable Two-Factor Authentication"
            description="Allow users to enable 2FA for additional security"
            checked={settings.enableTwoFactor}
            onChange={(checked) => handleSettingChange('enableTwoFactor', checked)}
          />
        </SettingSection>

        {/* Email Settings */}
        <SettingSection
          title="Email Configuration"
          description="Configure SMTP settings for system emails"
          icon={Mail}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputSetting
              label="SMTP Host"
              value={settings.smtpHost}
              onChange={(value) => handleSettingChange('smtpHost', value)}
              placeholder="smtp.gmail.com"
            />
            <InputSetting
              label="SMTP Port"
              value={settings.smtpPort}
              onChange={(value) => handleSettingChange('smtpPort', value)}
              type="number"
              placeholder="587"
            />
            <InputSetting
              label="SMTP Username"
              value={settings.smtpUsername}
              onChange={(value) => handleSettingChange('smtpUsername', value)}
              placeholder="username@domain.com"
            />
            <InputSetting
              label="SMTP Password"
              value={settings.smtpPassword}
              onChange={(value) => handleSettingChange('smtpPassword', value)}
              type="password"
            />
            <InputSetting
              label="From Name"
              value={settings.emailFromName}
              onChange={(value) => handleSettingChange('emailFromName', value)}
              placeholder="Placement Tracker"
            />
            <InputSetting
              label="From Email"
              value={settings.emailFromAddress}
              onChange={(value) => handleSettingChange('emailFromAddress', value)}
              placeholder="noreply@university.edu"
            />
          </div>
          <div className="flex space-x-3">
            <button
              onClick={handleTestEmail}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Send Test Email
            </button>
          </div>
        </SettingSection>

        {/* Notification Settings */}
        <SettingSection
          title="Notifications"
          description="Configure system notification preferences"
          icon={Bell}
        >
          <ToggleSetting
            label="Enable Email Notifications"
            description="Send notifications via email to users"
            checked={settings.enableEmailNotifications}
            onChange={(checked) => handleSettingChange('enableEmailNotifications', checked)}
          />
          <ToggleSetting
            label="Enable Push Notifications"
            description="Send browser push notifications to users"
            checked={settings.enablePushNotifications}
            onChange={(checked) => handleSettingChange('enablePushNotifications', checked)}
          />
          <ToggleSetting
            label="Notify Admins on New User Registration"
            description="Send email to admins when new users register"
            checked={settings.notifyAdminsOnNewUser}
            onChange={(checked) => handleSettingChange('notifyAdminsOnNewUser', checked)}
          />
          <ToggleSetting
            label="Notify Admins on System Errors"
            description="Send email alerts for critical system errors"
            checked={settings.notifyAdminsOnErrors}
            onChange={(checked) => handleSettingChange('notifyAdminsOnErrors', checked)}
          />
        </SettingSection>

        {/* Data & Backup Settings */}
        <SettingSection
          title="Data Management & Backup"
          description="Configure data retention and backup policies"
          icon={Database}
        >
          <ToggleSetting
            label="Enable Automatic Backups"
            description="Automatically backup system data at regular intervals"
            checked={settings.autoBackupEnabled}
            onChange={(checked) => handleSettingChange('autoBackupEnabled', checked)}
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Backup Frequency</label>
              <select
                value={settings.backupFrequency}
                onChange={(e) => handleSettingChange('backupFrequency', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
            <InputSetting
              label="Data Retention Period"
              value={settings.retentionPeriod}
              onChange={(value) => handleSettingChange('retentionPeriod', value)}
              type="number"
              unit="days"
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Export Format</label>
              <select
                value={settings.dataExportFormat}
                onChange={(e) => handleSettingChange('dataExportFormat', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="json">JSON</option>
                <option value="csv">CSV</option>
                <option value="excel">Excel</option>
              </select>
            </div>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={handleBackupNow}
              className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Backup Now
            </button>
          </div>
        </SettingSection>

        {/* Performance Settings */}
        <SettingSection
          title="Performance & Limits"
          description="Configure system performance and resource limits"
          icon={Monitor}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputSetting
              label="Max File Upload Size"
              description="Maximum size for file uploads"
              value={settings.maxFileUploadSize}
              onChange={(value) => handleSettingChange('maxFileUploadSize', value)}
              type="number"
              unit="MB"
            />
            <InputSetting
              label="Session Cleanup Interval"
              description="How often to clean up expired sessions"
              value={settings.sessionCleanupInterval}
              onChange={(value) => handleSettingChange('sessionCleanupInterval', value)}
              type="number"
              unit="minutes"
            />
            <InputSetting
              label="Log Retention Days"
              description="How long to keep system logs"
              value={settings.logRetentionDays}
              onChange={(value) => handleSettingChange('logRetentionDays', value)}
              type="number"
              unit="days"
            />
          </div>
          <ToggleSetting
            label="Enable Caching"
            description="Use caching to improve system performance"
            checked={settings.enableCaching}
            onChange={(checked) => handleSettingChange('enableCaching', checked)}
          />
        </SettingSection>

        {/* Feature Flags */}
        <SettingSection
          title="Feature Configuration"
          description="Enable or disable specific system features"
          icon={BarChart3}
        >
          <ToggleSetting
            label="GPS Tracking"
            description="Allow location tracking for check-ins"
            checked={settings.enableGPSTracking}
            onChange={(checked) => handleSettingChange('enableGPSTracking', checked)}
          />
          <ToggleSetting
            label="Automatic Check-in"
            description="Enable automatic check-in when users log in"
            checked={settings.enableAutoCheckIn}
            onChange={(checked) => handleSettingChange('enableAutoCheckIn', checked)}
          />
          <ToggleSetting
            label="File Attachments"
            description="Allow users to attach files to log entries"
            checked={settings.enableFileAttachments}
            onChange={(checked) => handleSettingChange('enableFileAttachments', checked)}
          />
          <ToggleSetting
            label="Reports & Analytics"
            description="Enable reporting and analytics features"
            checked={settings.enableReports}
            onChange={(checked) => handleSettingChange('enableReports', checked)}
          />
          <ToggleSetting
            label="Advanced Analytics"
            description="Enable detailed analytics and insights"
            checked={settings.enableAnalytics}
            onChange={(checked) => handleSettingChange('enableAnalytics', checked)}
          />
        </SettingSection>
      </div>
    </div>
  );
};

export default SystemSettings;
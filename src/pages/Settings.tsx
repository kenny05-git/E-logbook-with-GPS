import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Settings as SettingsIcon, 
  Bell, 
  Shield, 
  Monitor,
  Save,
  RefreshCw,
  Lock,
  Database,
  Download,
  AlertTriangle
} from 'lucide-react';

const Settings: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [settings, setSettings] = useState({
    // Notification Settings
    emailNotifications: true,
    pushNotifications: true,
    logApprovalNotifications: true,
    checkInReminders: true,
    weeklyReports: true,
    
    // Privacy Settings
    shareLocation: true,
    profileVisibility: 'supervisors', // 'public', 'supervisors', 'private'
    dataCollection: true,
    
    // Appearance Settings
    theme: 'system', // 'light', 'dark', 'system'
    language: 'en',
    timezone: 'UTC',
    
    // Security Settings
    twoFactorAuth: false,
    sessionTimeout: 30, // minutes
    loginAlerts: true
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
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('Settings saved successfully!');
    } catch (error) {
      alert('Failed to save settings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // const handleExportData = () => {
  //   alert('Data export functionality would be implemented here');
  // };

  const confirmDeleteAccount = () => {
  // This is where you simulate or trigger the delete action
  setShowDeleteModal(false);
  alert("Account deleted successfully!");
};


  const SettingSection: React.FC<{ 
    title: string; 
    description: string; 
    icon: React.ComponentType<any>;
    children: React.ReactNode;
  }> = ({ title, description, icon: Icon, children }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center space-x-3 mb-4">
        <div className="bg-blue-100 p-2 rounded-lg">
          <Icon className="h-5 w-5 text-blue-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </div>
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );

  const ToggleSetting: React.FC<{
    label: string;
    description: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
  }> = ({ label, description, checked, onChange }) => (
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
          className="sr-only peer"
        />
        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
      </label>
    </div>
  );

  

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center space-x-3">
          <SettingsIcon className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
          <span>Settings</span>
        </h1>
        <p className="text-gray-600 mt-2 text-sm sm:text-base">Manage your account preferences and privacy settings</p>
      </div>

      <div className="space-y-6 sm:space-y-8">
        {/* Notification Settings */}
        <SettingSection
          title="Notifications"
          description="Control how and when you receive notifications"
          icon={Bell}
        >
          <ToggleSetting
            label="Email Notifications"
            description="Receive notifications via email"
            checked={settings.emailNotifications}
            onChange={(checked) => handleSettingChange('emailNotifications', checked)}
          />
          <ToggleSetting
            label="Push Notifications"
            description="Receive push notifications in your browser"
            checked={settings.pushNotifications}
            onChange={(checked) => handleSettingChange('pushNotifications', checked)}
          />
          {user?.role === 'student' && (
            <>
              <ToggleSetting
                label="Log Approval Notifications"
                description="Get notified when your log entries are reviewed"
                checked={settings.logApprovalNotifications}
                onChange={(checked) => handleSettingChange('logApprovalNotifications', checked)}
              />
              <ToggleSetting
                label="Check-in Reminders"
                description="Receive reminders to check in at your placement"
                checked={settings.checkInReminders}
                onChange={(checked) => handleSettingChange('checkInReminders', checked)}
              />
            </>
          )}
          {user?.role === 'supervisor' && (
            <ToggleSetting
              label="Weekly Reports"
              description="Receive weekly progress reports for your students"
              checked={settings.weeklyReports}
              onChange={(checked) => handleSettingChange('weeklyReports', checked)}
            />
          )}
        </SettingSection>

        {/* Privacy Settings */}
        <SettingSection
          title="Privacy & Data"
          description="Control your privacy and data sharing preferences"
          icon={Shield}
        >
          <ToggleSetting
            label="Share Location Data"
            description="Allow location data to be used for check-ins and analytics"
            checked={settings.shareLocation}
            onChange={(checked) => handleSettingChange('shareLocation', checked)}
          />
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="font-medium text-gray-900">Profile Visibility</div>
              <div className="text-sm text-gray-600">Who can see your profile information</div>
            </div>
            <select
              value={settings.profileVisibility}
              onChange={(e) => handleSettingChange('profileVisibility', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              <option value="public">Public</option>
              <option value="supervisors">Supervisors Only</option>
              <option value="private">Private</option>
            </select>
          </div>
          <ToggleSetting
            label="Data Collection"
            description="Allow anonymous usage data collection to improve the service"
            checked={settings.dataCollection}
            onChange={(checked) => handleSettingChange('dataCollection', checked)}
          />
        </SettingSection>

        {/* Appearance Settings */}
        <SettingSection
          title="Appearance"
          description="Customize the look and feel of your interface"
          icon={Monitor}
        >
          {/* <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="font-medium text-gray-900">Theme</div>
              <div className="text-sm text-gray-600">Choose your preferred color scheme</div>
            </div>
            <div className="flex space-x-2">
              {[
                { value: 'light', icon: Sun, label: 'Light' },
                { value: 'dark', icon: Moon, label: 'Dark' },
                { value: 'system', icon: Monitor, label: 'System' }
              ].map(({ value, icon: Icon, label }) => (
                <button
                  key={value}
                  onClick={() => handleSettingChange('theme', value)}
                  className={`p-2 rounded-lg border transition-colors ${
                    settings.theme === value
                      ? 'border-blue-500 bg-blue-50 text-blue-600'
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                  title={label}
                >
                  <Icon className="h-4 w-4" />
                </button>
              ))}
            </div>
          </div> */}
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="font-medium text-gray-900">Language</div>
              <div className="text-sm text-gray-600">Select your preferred language</div>
            </div>
            <select
              value={settings.language}
              onChange={(e) => handleSettingChange('language', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
              <option value="de">Deutsch</option>
            </select>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="font-medium text-gray-900">Timezone</div>
              <div className="text-sm text-gray-600">Your local timezone for dates and times</div>
            </div>
            <select
              value={settings.timezone}
              onChange={(e) => handleSettingChange('timezone', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              <option value="UTC">UTC</option>
              <option value="America/New_York">Eastern Time</option>
              <option value="America/Chicago">Central Time</option>
              <option value="America/Denver">Mountain Time</option>
              <option value="America/Los_Angeles">Pacific Time</option>
              <option value="Europe/London">London</option>
              <option value="Europe/Paris">Paris</option>
              <option value="Asia/Tokyo">Tokyo</option>
            </select>
          </div>
        </SettingSection>

        {/* Security Settings */}
        <SettingSection
          title="Security"
          description="Manage your account security and authentication"
          icon={Lock}
        >
          <ToggleSetting
            label="Two-Factor Authentication"
            description="Add an extra layer of security to your account"
            checked={settings.twoFactorAuth}
            onChange={(checked) => handleSettingChange('twoFactorAuth', checked)}
          />
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="font-medium text-gray-900">Session Timeout</div>
              <div className="text-sm text-gray-600">Automatically log out after inactivity</div>
            </div>
            <select
              value={settings.sessionTimeout}
              onChange={(e) => handleSettingChange('sessionTimeout', parseInt(e.target.value))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              <option value={15}>15 minutes</option>
              <option value={30}>30 minutes</option>
              <option value={60}>1 hour</option>
              <option value={120}>2 hours</option>
              <option value={0}>Never</option>
            </select>
          </div>
          <ToggleSetting
            label="Login Alerts"
            description="Get notified when someone logs into your account"
            checked={settings.loginAlerts}
            onChange={(checked) => handleSettingChange('loginAlerts', checked)}
          />
        </SettingSection>

        {/* Data Management */}
        <SettingSection
          title="Data Management"
          description="Delete your account data"
          icon={Database}
        >
          {/* <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <Download className="h-5 w-5 text-blue-600" />
                <div>
                  <div className="font-medium text-blue-900">Export Your Data</div>
                  <div className="text-sm text-blue-700">Download a copy of all your data</div>
                </div>
              </div>
              <button
                onClick={handleExportData}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Export
              </button>
            </div> */}
            
            <div className="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <div>
                  <div className="font-medium text-red-900">Delete Account</div>
                  <div className="text-sm text-red-700">Permanently delete your account and all data</div>
                </div>
              </div>
             <button
  onClick={() => setShowDeleteModal(true)}
  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
>
  Delete
</button>
            </div>
        </SettingSection>
      </div>

      {showDeleteModal && (
  <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
    <div className="bg-white rounded-xl shadow-lg p-6 w-[90%] max-w-md">
      <h2 className="text-lg font-semibold text-red-600 mb-4">Confirm Account Deletion</h2>
      <p className="text-gray-700 mb-6">
        Are you sure you want to delete your account? This action cannot be undone.
      </p>
      <div className="flex justify-end space-x-3">
        <button
          onClick={() => setShowDeleteModal(false)}
          className="px-4 py-2 rounded-lg text-gray-700 bg-gray-200 hover:bg-gray-300 text-sm font-medium"
        >
          Cancel
        </button>
        <button
          onClick={confirmDeleteAccount}
          className="px-4 py-2 rounded-lg text-white bg-red-600 hover:bg-red-700 text-sm font-medium"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
)}




      {/* Save Button */}
      <div className="mt-8 flex justify-end">
        <button
          onClick={handleSaveSettings}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-semibold transition-all flex items-center space-x-2"
        >
          {loading ? (
            <>
              <RefreshCw className="h-5 w-5 animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Save className="h-5 w-5" />
              <span>Save Settings</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default Settings;
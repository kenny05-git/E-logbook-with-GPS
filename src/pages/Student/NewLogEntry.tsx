import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { 
  Calendar, 
  MapPin, 
  FileText, 
  Save, 
  Send,
  Navigation,
  RefreshCw,
  AlertCircle,
  Paperclip,
  X
} from 'lucide-react';

const NewLogEntry: React.FC = () => {
  const { user } = useAuth();
  const { addLogEntry } = useApp();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    description: '',
    attachments: [] as File[]
  });
  const [location, setLocation] = useState<{latitude: number, longitude: number, address: string} | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState('');
  const [saving, setSaving] = useState(false);

  const getCurrentLocation = () => {
    setLocationLoading(true);
    setLocationError('');
    
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by this browser.');
      setLocationLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const address = user?.placementAddress || `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
        
        setLocation({ latitude, longitude, address });
        setLocationLoading(false);
      },
      (error) => {
        setLocationError('Unable to retrieve your location. You can still submit without location data.');
        setLocationLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000
      }
    );
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFormData(prev => ({
        ...prev,
        attachments: [...prev.attachments, ...newFiles]
      }));
    }
  };

  const removeAttachment = (index: number) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent, status: 'draft' | 'pending') => {
    e.preventDefault();
    
    if (!user) return;
    
    if (!formData.description.trim()) {
      alert('Please enter a description for your log entry.');
      return;
    }

    setSaving(true);

    try {
      // Simulate saving process
      await new Promise(resolve => setTimeout(resolve, 1000));

      const newEntry = {
        studentId: user.id,
        studentName: user.name,
        date: formData.date,
        description: formData.description,
        location: location || undefined,
        status: status
      };

      addLogEntry(newEntry);
      
      // Navigate back to logbook
      navigate('/student/logbook');
    } catch (error) {
      alert('Failed to save log entry. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">New Log Entry</h1>
        <p className="text-gray-600 mt-2 text-sm sm:text-base">Document your daily placement activities and experiences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Main Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8">
            <form className="space-y-6">
              {/* Date */}
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="inline h-4 w-4 mr-2" />
                  Date
                </label>
                <input
                  id="date"
                  name="date"
                  type="date"
                  required
                  value={formData.date}
                  onChange={handleInputChange}
                  max={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm sm:text-base"
                />
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  <FileText className="inline h-4 w-4 mr-2" />
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  required
                  rows={8}
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none text-sm sm:text-base"
                  placeholder="Describe your activities, what you learned, challenges faced, and any achievements..."
                />
                <div className="mt-2 text-xs sm:text-sm text-gray-500">
                  {formData.description.length}/1000 characters
                </div>
              </div>

              {/* Attachments */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Paperclip className="inline h-4 w-4 mr-2" />
                  Attachments (Optional)
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 sm:p-6 text-center hover:border-gray-400 transition-colors">
                  <input
                    type="file"
                    multiple
                    accept="image/*,.pdf,.doc,.docx"
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer flex flex-col items-center space-y-2"
                  >
                    <Paperclip className="h-8 w-8 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      Click to upload files or drag and drop
                    </span>
                    <span className="text-xs text-gray-500">
                      Images, PDF, Word documents (Max 10MB each)
                    </span>
                  </label>
                </div>

                {/* Attachment List */}
                {formData.attachments.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {formData.attachments.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Paperclip className="h-4 w-4 text-gray-400" />
                          <div>
                            <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                            <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeAttachment(index)}
                          className="p-1 text-gray-400 hover:text-red-600 rounded-full hover:bg-red-50 transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={(e) => handleSubmit(e, 'draft')}
                  disabled={saving}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-2 sm:py-3 rounded-xl font-semibold transition-all flex items-center justify-center space-x-2 text-sm sm:text-base"
                >
                  <Save className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span>Save as Draft</span>
                </button>
                <button
                  type="button"
                  onClick={(e) => handleSubmit(e, 'pending')}
                  disabled={saving}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-2 sm:py-3 rounded-xl font-semibold transition-all flex items-center justify-center space-x-2 text-sm sm:text-base"
                >
                  {saving ? (
                    <>
                      <RefreshCw className="h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 sm:h-5 sm:w-5" />
                      <span>Submit for Review</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Location Info */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center space-x-2 mb-4">
              <MapPin className="h-5 w-5 text-blue-600" />
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">Location</h3>
            </div>

            {locationLoading ? (
              <div className="flex items-center space-x-2 text-gray-600">
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span className="text-sm">Getting location...</span>
              </div>
            ) : location ? (
              <div className="space-y-3">
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <div className="flex items-center space-x-2 text-green-700 mb-2">
                    <Navigation className="h-4 w-4" />
                    <span className="text-sm font-medium">GPS Coordinates</span>
                  </div>
                  <p className="font-mono text-xs text-green-600">
                    {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
                  </p>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="flex items-center space-x-2 text-blue-700 mb-2">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm font-medium">Address</span>
                  </div>
                  <p className="text-sm text-blue-800">{location.address}</p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {locationError && (
                  <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-3 py-2 rounded-lg flex items-start space-x-2">
                    <AlertCircle className="h-4 w-4 mt-0.5" />
                    <span className="text-xs">{locationError}</span>
                  </div>
                )}
                <button
                  onClick={getCurrentLocation}
                  className="w-full text-blue-600 hover:text-blue-500 font-medium flex items-center justify-center space-x-2 text-sm"
                >
                  <RefreshCw className="h-4 w-4" />
                  <span>Try Again</span>
                </button>
              </div>
            )}
          </div>

          {/* Tips */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold text-blue-900 mb-3">Writing Tips</h3>
            <ul className="space-y-2 text-xs sm:text-sm text-blue-800">
              <li className="flex items-start space-x-2">
                <span className="block w-1.5 h-1.5 bg-blue-600 rounded-full mt-2"></span>
                <span>Describe specific tasks and activities you completed</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="block w-1.5 h-1.5 bg-blue-600 rounded-full mt-2"></span>
                <span>Mention skills you learned or improved</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="block w-1.5 h-1.5 bg-blue-600 rounded-full mt-2"></span>
                <span>Include any challenges faced and how you overcame them</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="block w-1.5 h-1.5 bg-blue-600 rounded-full mt-2"></span>
                <span>Note interactions with colleagues or supervisors</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewLogEntry;
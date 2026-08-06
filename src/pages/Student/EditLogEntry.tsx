import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { FileText, Paperclip, RefreshCw, Save, Send, X } from 'lucide-react';

const EditLogEntry: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { logEntries, updateLogEntry } = useApp();

const entry = logEntries.find(entry => entry.id === id);

const [description, setDescription] = useState(entry?.description || '');
//   const [attachment, setAttachment] = useState(entry?.attachment || '');
const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    description: '',
    attachments: [] as File[]
  });
const [saving, setSaving] = useState(false);
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
  if (!entry) {
    return <p className="p-8 text-center text-red-600">Log entry not found.</p>;
  }

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();

    updateLogEntry(entry.id, {
      description,
      attachment,
      status: 'pending',
    });

    navigate(`/student/logbook/${id}`);
  };

   // Get user from context or props (adjust according to your app's structure)
   const { user } = useApp();

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

    function formatFileSize(size: number): React.ReactNode {
        throw new Error('Function not implemented.');
    }

  return (
    <div className="max-w-3xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <div className="bg-white shadow-md border border-gray-200 rounded-xl p-8">
        <div className="mb-6 flex items-center space-x-3">
          <FileText className="h-6 w-6 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-800">Edit Log Entry</h1>
        </div>

        <form onSubmit={handleUpdate} className="space-y-6">
          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              rows={6}
              required
              className="w-full border border-gray-300 rounded-lg p-3 text-sm shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Describe what you did today..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Attachment Link (can be replaced later with real file upload)
          <div>
            <label htmlFor="attachment" className="block text-sm font-semibold text-gray-700 mb-2">
              Attachment Link (optional)
            </label>
            <div className="flex items-center space-x-2">
              <input
                id="attachment"
                type="text"
                className="flex-1 border border-gray-300 rounded-lg p-3 text-sm shadow-sm focus:ring-purple-500 focus:border-purple-500"
                placeholder="https://example.com/file.pdf"
                value={attachment}
                onChange={(e) => setAttachment(e.target.value)}
              />
              <Upload className="text-purple-500 h-5 w-5" />
            </div>
            <p className="text-xs text-gray-500 mt-1">Paste a file URL here (PDF, image, etc.)</p>
          </div> */}

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

          {/* Save Button */}
          {/* <div className="pt-4">
            <button
              type="submit"
              className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-5 py-3 rounded-lg transition"
            >
              <Save className="h-4 w-4" />
              <span>Save Changes</span>
            </button>
          </div> */}

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
  );
};

export default EditLogEntry;


// Add this function to your AppContext and use it from context instead.
// For now, here's a placeholder implementation to avoid errors.
function addLogEntry(newEntry: { studentId: any; studentName: any; date: string; description: string; location?: any; status: "draft" | "pending"; }) {
  // Example: You might want to update your context or make an API call here.
  console.log('Log entry added:', newEntry);
}


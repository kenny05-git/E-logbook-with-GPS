import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { 
  MapPin, 
  Users, 
  Navigation, 
  Clock,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Search,
  Eye,
  Activity,
  Target,
  Globe
} from 'lucide-react';

interface StudentLocation {
  id: string;
  studentId: string;
  studentName: string;
  currentLocation: {
    latitude: number;
    longitude: number;
    address: string;
    timestamp: string;
  };
  registeredLocation: {
    latitude: number;
    longitude: number;
    address: string;
  };
  distance: number; // Distance from registered location in meters
  status: 'on-site' | 'off-site' | 'unknown';
  lastUpdate: string;
  isOnline: boolean;
}
const LocationTracker: React.FC = () => {
  const { user } = useAuth();
  const { assignments } = useApp();
  const [studentLocations, setStudentLocations] = useState<StudentLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'on-site' | 'off-site' | 'unknown'>('all');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const navigate = useNavigate();

  // Get students assigned to this supervisor
  const supervisorAssignments = assignments.filter(
    assignment => assignment.supervisorId === user?.id && assignment.isActive
  );

  // Mock student location data - in a real app, this would come from live GPS tracking
  const mockStudentLocations: StudentLocation[] = [
    {
      id: '1',
      studentId: '1',
      studentName: 'John Smith',
      currentLocation: {
        latitude: 40.7128,
        longitude: -74.0060,
        address: '123 Business District, City Center',
        timestamp: new Date().toISOString()
      },
      registeredLocation: {
        latitude: 40.7128,
        longitude: -74.0060,
        address: '123 Business District, City Center'
      },
      distance: 15, // 15 meters from registered location
      status: 'on-site',
      lastUpdate: new Date().toISOString(),
      isOnline: true
    },
    {
      id: '2',
      studentId: '2',
      studentName: 'Emily Davis',
      currentLocation: {
        latitude: 40.7589,
        longitude: -73.9851,
        address: '456 Tech Hub, Manhattan',
        timestamp: new Date(Date.now() - 300000).toISOString() // 5 minutes ago
      },
      registeredLocation: {
        latitude: 40.7580,
        longitude: -73.9855,
        address: '450 Tech Hub, Manhattan'
      },
      distance: 120, // 120 meters from registered location
      status: 'off-site',
      lastUpdate: new Date(Date.now() - 300000).toISOString(),
      isOnline: true
    },
    {
      id: '3',
      studentId: '3',
      studentName: 'Michael Johnson',
      currentLocation: {
        latitude: 40.7505,
        longitude: -73.9934,
        address: 'Unknown Location',
        timestamp: new Date(Date.now() - 1800000).toISOString() // 30 minutes ago
      },
      registeredLocation: {
        latitude: 40.7505,
        longitude: -73.9934,
        address: '789 Innovation Center, NYC'
      },
      distance: 0,
      status: 'unknown',
      lastUpdate: new Date(Date.now() - 1800000).toISOString(),
      isOnline: false
    }
  ];

  useEffect(() => {
    // Simulate loading student locations
    const loadStudentLocations = async () => {
      setLoading(true);
      // In a real app, this would fetch live location data from your backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      setStudentLocations(mockStudentLocations);
      setLoading(false);
    };

    loadStudentLocations();
  }, []);

  useEffect(() => {
    // Auto-refresh locations every 30 seconds
    if (autoRefresh) {
      const interval = setInterval(() => {
        setStudentLocations(prev => prev.map(student => ({
          ...student,
          lastUpdate: new Date().toISOString(),
          // Simulate small location changes
          currentLocation: {
            ...student.currentLocation,
            timestamp: new Date().toISOString()
          }
        })));
      }, 30000);

      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const filteredStudents = studentLocations.filter(student => {
    const matchesSearch = student.studentName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || student.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on-site': return 'text-green-600 bg-green-100';
      case 'off-site': return 'text-red-600 bg-red-100';
      case 'unknown': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'on-site': return CheckCircle;
      case 'off-site': return AlertTriangle;
      case 'unknown': return Clock;
      default: return Clock;
    }
  };

  const formatDistance = (distance: number) => {
    if (distance < 1000) {
      return `${distance}m`;
    }
    return `${(distance / 1000).toFixed(1)}km`;
  };

  const getTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const onSiteCount = filteredStudents.filter(s => s.status === 'on-site').length;
  const offSiteCount = filteredStudents.filter(s => s.status === 'off-site').length;
  const unknownCount = filteredStudents.filter(s => s.status === 'unknown').length;
  const onlineCount = filteredStudents.filter(s => s.isOnline).length;

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setStudentLocations(prev => prev.map(student => ({
        ...student,
        lastUpdate: new Date().toISOString()
      })));
  setLoading(false);
}, 1000);
};

const handleViewDetails = (studentId: string) => {
  navigate(`/supervisor/student/${studentId}/logs`);
};

  const handleOpenMap = (location: any) => {
    if (location) {
      const url = `https://www.google.com/maps?q=${location.latitude},${location.longitude}`;
      window.open(url, '_blank');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
              <MapPin className="h-8 w-8 text-blue-600" />
              <span>Location Tracker</span>
            </h1>
            <p className="text-gray-600 mt-2">Monitor student locations and verify placement attendance</p>
          </div>
          <div className="mt-4 sm:mt-0 flex items-center space-x-3">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Auto-refresh</span>
            </label>
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="bg-green-100 p-3 rounded-full">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">On-Site</p>
              <p className="text-2xl font-bold text-gray-900">{onSiteCount}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="bg-red-100 p-3 rounded-full">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Off-Site</p>
              <p className="text-2xl font-bold text-gray-900">{offSiteCount}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-3 rounded-full">
              <Activity className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Online</p>
              <p className="text-2xl font-bold text-gray-900">{onlineCount}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="bg-gray-100 p-3 rounded-full">
              <Clock className="h-6 w-6 text-gray-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Unknown</p>
              <p className="text-2xl font-bold text-gray-900">{unknownCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div className="sm:w-48">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Status</option>
              <option value="on-site">On-Site</option>
              <option value="off-site">Off-Site</option>
              <option value="unknown">Unknown</option>
            </select>
          </div>
        </div>
      </div>

      {/* Location List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        {loading ? (
          <div className="p-12 text-center">
            <RefreshCw className="h-12 w-12 text-gray-300 mx-auto mb-4 animate-spin" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Loading locations...</h3>
            <p className="text-gray-600">Fetching real-time student location data</p>
          </div>
        ) : filteredStudents.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {filteredStudents.map((student) => {
              const StatusIcon = getStatusIcon(student.status);
              return (
                <div key={student.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-3">
                        <div className="flex items-center space-x-2">
                          <Users className="h-4 w-4 text-gray-400" />
                          <span className="text-lg font-medium text-gray-900">
                            {student.studentName}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(student.status)}`}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {student.status.charAt(0).toUpperCase() + student.status.slice(1)}
                          </div>
                          {student.isOnline && (
                            <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                              Online
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Current Location */}
                        <div className="space-y-3">
                          <div className="flex items-center space-x-2">
                            <Navigation className="h-4 w-4 text-blue-600" />
                            <span className="text-sm font-medium text-gray-900">Current Location</span>
                            <button
                              onClick={() => handleOpenMap(student.currentLocation)}
                              className="p-1 text-gray-400 hover:text-blue-600 rounded transition-colors"
                              title="View on map"
                            >
                              <Globe className="h-3 w-3" />
                            </button>
                          </div>
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                            <p className="text-sm text-blue-800 mb-2">{student.currentLocation.address}</p>
                            <div className="flex items-center justify-between text-xs text-blue-600">
                              <span className="font-mono">
                                {student.currentLocation.latitude.toFixed(6)}, {student.currentLocation.longitude.toFixed(6)}
                              </span>
                              <span>{getTimeAgo(student.currentLocation.timestamp)}</span>
                            </div>
                          </div>
                        </div>

                        {/* Registered Location */}
                        <div className="space-y-3">
                          <div className="flex items-center space-x-2">
                            <Target className="h-4 w-4 text-green-600" />
                            <span className="text-sm font-medium text-gray-900">Registered Location</span>
                            <button
                              onClick={() => handleOpenMap(student.registeredLocation)}
                              className="p-1 text-gray-400 hover:text-green-600 rounded transition-colors"
                              title="View on map"
                            >
                              <Globe className="h-3 w-3" />
                            </button>
                          </div>
                          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                            <p className="text-sm text-green-800 mb-2">{student.registeredLocation.address}</p>
                            <div className="flex items-center justify-between text-xs text-green-600">
                              <span className="font-mono">
                                {student.registeredLocation.latitude.toFixed(6)}, {student.registeredLocation.longitude.toFixed(6)}
                              </span>
                              <span className="font-medium">
                                Distance: {formatDistance(student.distance)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-6 mt-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>Last update: {getTimeAgo(student.lastUpdate)}</span>
                        </div>
                        {student.status === 'off-site' && (
                          <div className="flex items-center space-x-1 text-red-600">
                            <AlertTriangle className="h-4 w-4" />
                            <span>Outside registered area</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 ml-4">
                      {/* <button
                        onClick={() => handleViewDetails(student.studentId)}
                        className="p-2 text-gray-400 hover:text-green-600 rounded-lg hover:bg-green-50 transition-colors"
                        title="View details"
                      >
                        <Eye className="h-4 w-4" />
                      </button> */}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-12 text-center">
            {searchTerm || statusFilter !== 'all' ? (
              <div>
                <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No students found</h3>
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
                <MapPin className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No location data available</h3>
                <p className="text-gray-600">Student location data will appear here once they start checking in</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Location Tracking Info */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-4">How Location Tracking Works</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-blue-800">
          <div className="flex items-start space-x-2">
            <div className="bg-blue-200 rounded-full p-1 mt-0.5">
              <span className="block w-2 h-2 bg-blue-600 rounded-full"></span>
            </div>
            <div>
              <strong>Real-time Tracking:</strong> Student locations are updated automatically when they log in or check in.
            </div>
          </div>
          <div className="flex items-start space-x-2">
            <div className="bg-blue-200 rounded-full p-1 mt-0.5">
              <span className="block w-2 h-2 bg-blue-600 rounded-full"></span>
            </div>
            <div>
              <strong>Geofencing:</strong> System alerts when students are outside their registered placement area.
            </div>
          </div>
          <div className="flex items-start space-x-2">
            <div className="bg-blue-200 rounded-full p-1 mt-0.5">
              <span className="block w-2 h-2 bg-blue-600 rounded-full"></span>
            </div>
            <div>
              <strong>Privacy Compliant:</strong> Location data is only collected during work hours and with student consent.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationTracker;
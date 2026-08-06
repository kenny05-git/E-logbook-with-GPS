import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import StatusBadge from '../../components/UI/StatusBadge';
import { 
  MapPin, 
  Navigation, 
  Clock, 
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Zap
} from 'lucide-react';

const CheckIn: React.FC = () => {
  const { user } = useAuth();
  const { checkIns, addCheckIn } = useApp();
  const [location, setLocation] = useState<{latitude: number, longitude: number} | null>(null);
  const [address, setAddress] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  // Filter check-ins for current user
  const userCheckIns = checkIns.filter(checkIn => checkIn.studentId === user?.id);
  const recentCheckIns = userCheckIns.slice(0, 10);

  const getCurrentLocation = () => {
    setLoading(true);
    setError('');
    
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser.');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ latitude, longitude });
        
        // Simulate reverse geocoding
        try {
          // In a real app, you'd use a geocoding service
          const mockAddress = user?.placementAddress || '123 Business District, City Center';
          setAddress(mockAddress);
          setLoading(false);
        } catch (err) {
          setAddress(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
          setLoading(false);
        }
      },
      (error) => {
        setError('Unable to retrieve your location. Please enable location services.');
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000
      }
    );
  };

  const handleCheckIn = () => {
    if (!location || !user) return;

    setLoading(true);
    
    // Simulate check-in process
    setTimeout(() => {
      const newCheckIn = {
        studentId: user.id,
        studentName: user.name,
        timestamp: new Date().toISOString(),
        location: {
          latitude: location.latitude,
          longitude: location.longitude,
          address: address
        },
        status: 'success' as const,
        isAutomatic: false
      };

      addCheckIn(newCheckIn);
      setSuccess('Manual check-in successful!');
      setLoading(false);
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    }, 1000);
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const canCheckIn = location && !loading;
  const lastCheckIn = userCheckIns[0];
  const canCheckInToday = !lastCheckIn || 
    new Date(lastCheckIn.timestamp).toDateString() !== new Date().toDateString();

  const autoCheckIns = userCheckIns.filter(checkIn => checkIn.isAutomatic);
  const manualCheckIns = userCheckIns.filter(checkIn => !checkIn.isAutomatic);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">GPS Check-in</h1>
        <p className="text-gray-600 mt-2 text-sm sm:text-base">Verify your attendance at your placement location</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Check-in Card */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8">
            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl mb-6 flex items-center space-x-2">
                <CheckCircle className="h-5 w-5" />
                <span className="text-sm sm:text-base">{success}</span>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 flex items-center space-x-2">
                <AlertCircle className="h-5 w-5" />
                <span className="text-sm sm:text-base">{error}</span>
              </div>
            )}

            {/* Auto Check-in Notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 sm:p-6 mb-6">
              <div className="flex items-start space-x-3">
                <Zap className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-blue-900 text-sm sm:text-base">Auto Check-in Active</h3>
                  <p className="text-blue-800 text-xs sm:text-sm mt-1">
                    You are automatically checked in when you log into the system. Manual check-in is available for additional verification.
                  </p>
                </div>
              </div>
            </div>

            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <MapPin className="h-8 w-8 sm:h-10 sm:w-10 text-blue-600" />
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Current Location</h2>

              {loading ? (
                <div className="flex items-center justify-center space-x-2 text-gray-600 mb-6">
                  <RefreshCw className="h-5 w-5 animate-spin" />
                  <span className="text-sm sm:text-base">Getting your location...</span>
                </div>
              ) : location ? (
                <div className="mb-6">
                  <div className="bg-gray-50 rounded-lg p-3 sm:p-4 mb-4">
                    <div className="flex items-center justify-center space-x-2 text-gray-700 mb-2">
                      <Navigation className="h-4 w-4" />
                      <span className="text-xs sm:text-sm font-medium">GPS Coordinates</span>
                    </div>
                    <p className="font-mono text-xs sm:text-sm text-gray-600">
                      {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
                    </p>
                  </div>
                  {address && (
                    <div className="bg-blue-50 rounded-lg p-3 sm:p-4">
                      <div className="flex items-center justify-center space-x-2 text-blue-700 mb-2">
                        <MapPin className="h-4 w-4" />
                        <span className="text-xs sm:text-sm font-medium">Address</span>
                      </div>
                      <p className="text-blue-800 text-sm sm:text-base">{address}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="mb-6">
                  <p className="text-gray-600 mb-4 text-sm sm:text-base">Unable to get your location</p>
                  <button
                    onClick={getCurrentLocation}
                    className="text-blue-600 hover:text-blue-500 font-medium flex items-center space-x-2 mx-auto text-sm sm:text-base"
                  >
                    <RefreshCw className="h-4 w-4" />
                    <span>Try Again</span>
                  </button>
                </div>
              )}

              {canCheckIn && (
                <div className="space-y-4">
                  {!canCheckInToday ? (
                    <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-xl">
                      <p className="text-xs sm:text-sm">You have already checked in today.</p>
                    </div>
                  ) : (
                    <button
                      onClick={handleCheckIn}
                      disabled={loading || !canCheckInToday}
                      className="bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold text-sm sm:text-lg transition-all flex items-center space-x-2 mx-auto"
                    >
                      {loading ? (
                        <>
                          <RefreshCw className="h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                          <span>Checking in...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                          <span>Manual Check In</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Check-in History */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center space-x-2 mb-4 sm:mb-6">
            <Clock className="h-5 w-5 text-gray-600" />
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">Recent Check-ins</h3>
          </div>

          <div className="space-y-3 sm:space-y-4">
            {recentCheckIns.length > 0 ? (
              recentCheckIns.map((checkIn) => (
                <div key={checkIn.id} className="border border-gray-200 rounded-lg p-3 sm:p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs sm:text-sm font-medium text-gray-900">
                      {new Date(checkIn.timestamp).toLocaleDateString()}
                    </span>
                    <div className="flex items-center space-x-2">
                      {checkIn.isAutomatic && (
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                          Auto
                        </span>
                      )}
                      <StatusBadge status={checkIn.status} size="sm" />
                    </div>
                  </div>
                  <div className="text-xs text-gray-600 mb-2">
                    {new Date(checkIn.timestamp).toLocaleTimeString()}
                  </div>
                  <div className="text-xs text-gray-500 truncate">
                    {checkIn.location.address}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6 sm:py-8">
                <MapPin className="h-6 w-6 sm:h-8 sm:w-8 text-gray-300 mx-auto mb-2" />
                <p className="text-xs sm:text-sm text-gray-600">No check-ins yet</p>
              </div>
            )}
          </div>

          {userCheckIns.length > 10 && (
            <button className="w-full mt-4 text-blue-600 hover:text-blue-500 text-xs sm:text-sm font-medium">
              View All Check-ins
            </button>
          )}
        </div>
      </div>

      {/* Statistics */}
      <div className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-2 sm:p-3 rounded-full">
              <Zap className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600">Auto Check-ins</p>
              <p className="text-lg sm:text-2xl font-bold text-gray-900">{autoCheckIns.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center space-x-3">
            <div className="bg-green-100 p-2 sm:p-3 rounded-full">
              <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600">Manual Check-ins</p>
              <p className="text-lg sm:text-2xl font-bold text-gray-900">{manualCheckIns.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center space-x-3">
            <div className="bg-purple-100 p-2 sm:p-3 rounded-full">
              <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600">Total Check-ins</p>
              <p className="text-lg sm:text-2xl font-bold text-gray-900">{userCheckIns.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center space-x-3">
            <div className="bg-orange-100 p-2 sm:p-3 rounded-full">
              <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600">Success Rate</p>
              <p className="text-lg sm:text-2xl font-bold text-gray-900">100%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-6 sm:mt-8 bg-blue-50 border border-blue-200 rounded-xl p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-semibold text-blue-900 mb-3 sm:mb-4">How GPS Check-in Works</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 text-xs sm:text-sm text-blue-800">
          <div className="flex items-start space-x-2">
            <div className="bg-blue-200 rounded-full p-1 mt-0.5">
              <span className="block w-2 h-2 bg-blue-600 rounded-full"></span>
            </div>
            <div>
              <strong>Auto Check-in:</strong> Automatically happens when you log into the system.
            </div>
          </div>
          <div className="flex items-start space-x-2">
            <div className="bg-blue-200 rounded-full p-1 mt-0.5">
              <span className="block w-2 h-2 bg-blue-600 rounded-full"></span>
            </div>
            <div>
              <strong>Manual Check-in:</strong> Additional verification available once per day.
            </div>
          </div>
          <div className="flex items-start space-x-2">
            <div className="bg-blue-200 rounded-full p-1 mt-0.5">
              <span className="block w-2 h-2 bg-blue-600 rounded-full"></span>
            </div>
            <div>
              <strong>Location Tracking:</strong> Your GPS coordinates are recorded and verified.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckIn;
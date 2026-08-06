import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { Bell, CheckCircle, AlertCircle, Info, XCircle, Filter, Search, BookMarked as MarkAsRead, Trash2, Calendar } from 'lucide-react';

const Notifications: React.FC = () => {
  const { user } = useAuth();
  const { notifications, markNotificationRead } = useApp();
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | 'info' | 'success' | 'warning' | 'error'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Filter notifications for current user
  const userNotifications = notifications.filter(notification => notification.userId === user?.id);

  // Apply filters
  const filteredNotifications = userNotifications.filter(notification => {
    const matchesFilter = filter === 'all' || 
      (filter === 'read' && notification.read) || 
      (filter === 'unread' && !notification.read);
    
    const matchesType = typeFilter === 'all' || notification.type === typeFilter;
    
    const matchesSearch = searchTerm === '' || 
      notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesFilter && matchesType && matchesSearch;
  });

  const unreadCount = userNotifications.filter(n => !n.read).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return CheckCircle;
      case 'warning':
        return AlertCircle;
      case 'error':
        return XCircle;
      default:
        return Info;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'text-green-600 bg-green-100';
      case 'warning':
        return 'text-yellow-600 bg-yellow-100';
      case 'error':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-blue-600 bg-blue-100';
    }
  };

  const handleMarkAsRead = (id: string) => {
    markNotificationRead(id);
  };

  const markAllAsRead = () => {
    userNotifications.forEach(notification => {
      if (!notification.read) {
        markNotificationRead(notification.id);
      }
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center space-x-3">
              <Bell className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
              <span>Notifications</span>
              {unreadCount > 0 && (
                <span className="bg-red-500 text-white text-xs sm:text-sm px-2 py-1 rounded-full">
                  {unreadCount}
                </span>
              )}
            </h1>
            <p className="text-gray-600 mt-2 text-sm sm:text-base">Stay updated with your placement activities</p>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="mt-4 sm:mt-0 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 text-sm sm:text-base"
            >
              <MarkAsRead className="h-4 w-4" />
              <span>Mark All Read</span>
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search notifications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="sm:w-40">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="w-full px-3 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
            >
              <option value="all">All</option>
              <option value="unread">Unread</option>
              <option value="read">Read</option>
            </select>
          </div>

          {/* Type Filter */}
          <div className="sm:w-40">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as any)}
              className="w-full px-3 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
            >
              <option value="all">All Types</option>
              <option value="info">Info</option>
              <option value="success">Success</option>
              <option value="warning">Warning</option>
              <option value="error">Error</option>
            </select>
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        {filteredNotifications.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {filteredNotifications.map((notification) => {
              const Icon = getNotificationIcon(notification.type);
              const colorClass = getNotificationColor(notification.type);
              
              return (
                <div
                  key={notification.id}
                  className={`p-4 sm:p-6 hover:bg-gray-50 transition-colors ${
                    !notification.read ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                  }`}
                >
                  <div className="flex items-start space-x-3 sm:space-x-4">
                    <div className={`p-2 rounded-full ${colorClass} flex-shrink-0`}>
                      <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className={`text-sm sm:text-base font-semibold ${
                            !notification.read ? 'text-gray-900' : 'text-gray-700'
                          }`}>
                            {notification.title}
                          </h3>
                          <p className={`mt-1 text-xs sm:text-sm ${
                            !notification.read ? 'text-gray-700' : 'text-gray-600'
                          }`}>
                            {notification.message}
                          </p>
                          <div className="flex items-center space-x-2 mt-2 text-xs text-gray-500">
                            <Calendar className="h-3 w-3" />
                            <span>
                              {new Date(notification.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2 ml-4">
                          {!notification.read && (
                            <button
                              onClick={() => handleMarkAsRead(notification.id)}
                              className="p-1 sm:p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                              title="Mark as read"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </button>
                          )}
                          <button
                            className="p-1 sm:p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                            title="Delete notification"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-8 sm:p-12 text-center">
            {searchTerm || filter !== 'all' || typeFilter !== 'all' ? (
              <div>
                <Search className="h-8 w-8 sm:h-12 sm:w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No notifications found</h3>
                <p className="text-sm sm:text-base text-gray-600 mb-4">Try adjusting your search or filter criteria</p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setFilter('all');
                    setTypeFilter('all');
                  }}
                  className="text-blue-600 hover:text-blue-500 font-medium text-sm sm:text-base"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <div>
                <Bell className="h-8 w-8 sm:h-12 sm:w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No notifications yet</h3>
                <p className="text-sm sm:text-base text-gray-600">You'll see notifications about your placement activities here</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Summary Stats */}
      {userNotifications.length > 0 && (
        <div className="mt-6 sm:mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-center">
            <div className="text-lg sm:text-2xl font-bold text-gray-900">{userNotifications.length}</div>
            <div className="text-xs sm:text-sm text-gray-600">Total</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-center">
            <div className="text-lg sm:text-2xl font-bold text-blue-600">{unreadCount}</div>
            <div className="text-xs sm:text-sm text-gray-600">Unread</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-center">
            <div className="text-lg sm:text-2xl font-bold text-green-600">
              {userNotifications.filter(n => n.type === 'success').length}
            </div>
            <div className="text-xs sm:text-sm text-gray-600">Success</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-center">
            <div className="text-lg sm:text-2xl font-bold text-blue-600">
              {userNotifications.filter(n => n.type === 'info').length}
            </div>
            <div className="text-xs sm:text-sm text-gray-600">Info</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notifications;
import React from 'react';
import { CheckCircle, Clock, XCircle, AlertCircle } from 'lucide-react';

interface StatusBadgeProps {
  status: 'approved' | 'pending' | 'rejected' | 'draft' | 'success' | 'failed' | 'confirmed' | 'not_confirmed';
  size?: 'sm' | 'md' | 'lg';
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'approved':
      case 'success':
        return {
          icon: CheckCircle,
          text: status === 'approved' ? 'Approved' : 'Success',
          className: 'bg-green-100 text-green-800 border-green-200'
        };
      case 'pending':
        return {
          icon: Clock,
          text: 'Pending',
          className: 'bg-yellow-100 text-yellow-800 border-yellow-200'
        };
      case 'rejected':
      case 'failed':
        return {
          icon: XCircle,
          text: status === 'rejected' ? 'Rejected' : 'Failed',
          className: 'bg-red-100 text-red-800 border-red-200'
        };
      case 'draft':
        return {
          icon: AlertCircle,
          text: 'Draft',
          className: 'bg-gray-100 text-gray-800 border-gray-200'
        };
      case 'confirmed':
        return {
          icon: CheckCircle,
          text: 'Confirmed',
          className: 'bg-blue-100 text-blue-800 border-blue-200'
        };
      case 'not_confirmed':
        return {
          icon: XCircle,
          text: 'Not Confirmed',
          className: 'bg-red-100 text-red-800 border-red-200'
        };
      default:
        return {
          icon: AlertCircle,
          text: 'Unknown',
          className: 'bg-gray-100 text-gray-800 border-gray-200'
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  };

  return (
    <span className={`inline-flex items-center space-x-1 rounded-full border font-medium ${config.className} ${sizeClasses[size]}`}>
      <Icon className={iconSizes[size]} />
      <span>{config.text}</span>
    </span>
  );
};

export default StatusBadge;
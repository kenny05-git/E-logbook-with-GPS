import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { LogEntry, CheckIn, Notification, Assignment } from '../types';

interface AppContextType {
  logEntries: LogEntry[];
  checkIns: CheckIn[];
  notifications: Notification[];
  assignments: Assignment[];
  addLogEntry: (entry: Omit<LogEntry, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateLogEntry: (id: string, updates: Partial<LogEntry>) => void;
  deleteLogEntry: (id: string) => void;
  addCheckIn: (checkIn: Omit<CheckIn, 'id'>) => void;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => void;
  markNotificationRead: (id: string) => void;
  addAssignment: (assignment: Omit<Assignment, 'id' | 'assignedAt'>) => void;
  removeAssignment: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Mock data
const mockLogEntries: LogEntry[] = [
  {
    id: '1',
    studentId: '1',
    studentName: 'John Smith',
    date: '2024-01-22',
    description: 'Worked on database optimization and learned about indexing strategies. Collaborated with the senior developer on query performance improvements.',
    location: {
      latitude: 40.7128,
      longitude: -74.0060,
      address: '123 Business District, City Center'
    },
    status: 'approved',
    supervisorFeedback: 'Excellent work on database optimization. Shows good understanding of performance concepts.',
    approvedBy: 'Dr. Sarah Johnson',
    approvedAt: '2024-01-23T10:30:00Z',
    industrialSupervisorConfirmation: {
      confirmed: true,
      confirmedBy: 'James Wilson',
      confirmedAt: '2024-01-23T14:30:00Z',
      feedback: 'Student demonstrated excellent technical skills and completed all assigned tasks efficiently.',
      rating: 5
    },
    createdAt: '2024-01-22T18:00:00Z',
    updatedAt: '2024-01-23T10:30:00Z'
  },
  {
    id: '2',
    studentId: '1',
    studentName: 'John Smith',
    date: '2024-01-23',
    description: 'Participated in daily standup meetings and worked on frontend component development using React and TypeScript.',
    status: 'pending',
    createdAt: '2024-01-23T18:00:00Z',
    updatedAt: '2024-01-23T18:00:00Z'
  }
];

const mockCheckIns: CheckIn[] = [
  {
    id: '1',
    studentId: '1',
    studentName: 'John Smith',
    timestamp: '2024-01-22T09:00:00Z',
    location: {
      latitude: 40.7128,
      longitude: -74.0060,
      address: '123 Business District, City Center'
    },
    status: 'success',
    isAutomatic: true
  }
];

const mockNotifications: Notification[] = [
  {
    id: '1',
    userId: '1',
    title: 'Log Entry Approved',
    message: 'Your log entry for January 22nd has been approved by Dr. Sarah Johnson.',
    type: 'success',
    read: false,
    createdAt: '2024-01-23T10:30:00Z'
  },
  {
    id: '2',
    userId: '1',
    title: 'Auto Check-in Successful',
    message: 'You have been automatically checked in at your placement location.',
    type: 'info',
    read: false,
    createdAt: new Date().toISOString()
  }
];

const mockAssignments: Assignment[] = [
  {
    id: '1',
    studentId: '1',
    supervisorId: '2',
    assignedBy: 'Michael Chen',
    assignedAt: '2024-01-15T10:00:00Z',
    isActive: true
  }
];

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [logEntries, setLogEntries] = useState<LogEntry[]>(mockLogEntries);
  const [checkIns, setCheckIns] = useState<CheckIn[]>(() => {
    const stored = localStorage.getItem('checkIns');
    return stored ? JSON.parse(stored) : mockCheckIns;
  });
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [assignments, setAssignments] = useState<Assignment[]>(mockAssignments);

  // Listen for auto check-in events
  useEffect(() => {
    const handleCheckInAdded = (event: CustomEvent) => {
      setCheckIns(prev => [event.detail, ...prev]);
      
      // Add notification for auto check-in
      const notification: Notification = {
        id: Date.now().toString(),
        userId: event.detail.studentId,
        title: 'Auto Check-in Successful',
        message: 'You have been automatically checked in at your placement location.',
        type: 'info',
        read: false,
        createdAt: new Date().toISOString()
      };
      setNotifications(prev => [notification, ...prev]);
    };

    window.addEventListener('checkInAdded', handleCheckInAdded as EventListener);
    return () => window.removeEventListener('checkInAdded', handleCheckInAdded as EventListener);
  }, []);

  const addLogEntry = (entry: Omit<LogEntry, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newEntry: LogEntry = {
      ...entry,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setLogEntries(prev => [newEntry, ...prev]);
  };

  const updateLogEntry = (id: string, updates: Partial<LogEntry>) => {
    setLogEntries(prev => prev.map(entry => 
      entry.id === id 
        ? { ...entry, ...updates, updatedAt: new Date().toISOString() }
        : entry
    ));
  };

  const deleteLogEntry = (id: string) => {
    setLogEntries(prev => prev.filter(entry => entry.id !== id));
  };

  const addCheckIn = (checkIn: Omit<CheckIn, 'id'>) => {
    const newCheckIn: CheckIn = {
      ...checkIn,
      id: Date.now().toString()
    };
    setCheckIns(prev => {
      const updated = [newCheckIn, ...prev];
      localStorage.setItem('checkIns', JSON.stringify(updated));
      return updated;
    });
  };

  const addNotification = (notification: Omit<Notification, 'id' | 'createdAt'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  const addAssignment = (assignment: Omit<Assignment, 'id' | 'assignedAt'>) => {
    const newAssignment: Assignment = {
      ...assignment,
      id: Date.now().toString(),
      assignedAt: new Date().toISOString()
    };
    setAssignments(prev => [newAssignment, ...prev]);
  };

  const removeAssignment = (id: string) => {
    setAssignments(prev => prev.map(assignment => 
      assignment.id === id ? { ...assignment, isActive: false } : assignment
    ));
  };

  return (
    <AppContext.Provider value={{
      logEntries,
      checkIns,
      notifications,
      assignments,
      addLogEntry,
      updateLogEntry,
      deleteLogEntry,
      addCheckIn,
      addNotification,
      markNotificationRead,
      addAssignment,
      removeAssignment
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
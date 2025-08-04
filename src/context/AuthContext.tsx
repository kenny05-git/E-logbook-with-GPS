import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthContextType, RegisterUserData } from '../types';
import { useApp } from './AppContext';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo
const mockUsers: User[] = [
  {
    id: '1',
    email: 'student@example.com',
    name: 'John Smith',
    role: 'student',
    institution: 'University of Technology',
    course: 'Computer Science',
    matricNumber: 'CS2024001',
    placementAddress: '123 Business District, City Center',
    assignedSupervisorId: '2',
    assignedIndustrialSupervisorId: '4',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
    createdAt: '2024-01-15',
    isActive: true
  },
  {
    id: '2',
    email: 'supervisor@example.com',
    name: 'Dr. Sarah Johnson',
    role: 'supervisor',
    institution: 'University of Technology',
    department: 'Computer Science',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
    createdAt: '2024-01-10',
    isActive: true
  },
  {
    id: '3',
    email: 'admin@example.com',
    name: 'Michael Chen',
    role: 'admin',
    institution: 'University of Technology',
    department: 'Administration',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150',
    createdAt: '2024-01-01',
    isActive: true
  },
  {
    id: '4',
    email: 'industrial@example.com',
    name: 'James Wilson',
    role: 'industrial_supervisor',
    institution: 'TechCorp Industries',
    department: 'Software Development',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150',
    createdAt: '2024-01-05',
    isActive: true
  }
];

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Auto check-in function for students
  const performAutoCheckIn = async (student: User) => {
    if (student.role !== 'student') return;

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000
        });
      });

      const { latitude, longitude } = position.coords;
      const address = student.placementAddress || `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;

      // Check if already checked in today
      const today = new Date().toDateString();
      const existingCheckIns = JSON.parse(localStorage.getItem('checkIns') || '[]');
      const todayCheckIn = existingCheckIns.find((checkIn: any) => 
        checkIn.studentId === student.id && 
        new Date(checkIn.timestamp).toDateString() === today
      );

      if (!todayCheckIn) {
        const newCheckIn = {
          id: Date.now().toString(),
          studentId: student.id,
          studentName: student.name,
          timestamp: new Date().toISOString(),
          location: { latitude, longitude, address },
          status: 'success' as const,
          isAutomatic: true
        };

        const updatedCheckIns = [newCheckIn, ...existingCheckIns];
        localStorage.setItem('checkIns', JSON.stringify(updatedCheckIns));

        // Trigger a custom event to update the app context
        window.dispatchEvent(new CustomEvent('checkInAdded', { detail: newCheckIn }));
      }
    } catch (error) {
      console.log('Auto check-in failed:', error);
      // Silently fail - don't interrupt the login process
    }
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const foundUser = mockUsers.find(u => u.email === email);
    if (foundUser && password === 'password') {
      setUser(foundUser);
      localStorage.setItem('user', JSON.stringify(foundUser));
      
      // Perform auto check-in for students
      if (foundUser.role === 'student') {
        setTimeout(() => performAutoCheckIn(foundUser), 1000);
      }
    } else {
      throw new Error('Invalid credentials');
    }
    setLoading(false);
  };

  const register = async (userData: RegisterUserData) => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newUser: User = {
      id: Date.now().toString(),
      ...userData,
      avatar: `https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150`,
      createdAt: new Date().toISOString(),
      isActive: true
    };
    
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
    
    // Perform auto check-in for students
    if (newUser.role === 'student') {
      setTimeout(() => performAutoCheckIn(newUser), 1000);
    }
    
    setLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!user) return;
    
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      register,
      logout,
      updateProfile,
      loading
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
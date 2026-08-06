export interface User {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'supervisor' | 'admin' | 'industrial_supervisor';
  institution?: string;
  department?: string;
  course?: string;
  matricNumber?: string; // Added for students
  placementAddress?: string;
  assignedSupervisorId?: string; // For students
  assignedIndustrialSupervisorId?: string; // For students
  avatar?: string;
  createdAt: string;
  isActive: boolean;
}

export interface LogEntry {
  id: string;
  studentId: string;
  studentName: string;
  date: string;
  description: string;
  location?: {
    latitude: number;
    longitude: number;
    address: string;
  };
  status: 'draft' | 'pending' | 'approved' | 'rejected';
  supervisorFeedback?: string;
  approvedBy?: string;
  approvedAt?: string;
  industrialSupervisorConfirmation?: {
    confirmed: boolean;
    confirmedBy?: string;
    confirmedAt?: string;
    feedback?: string;
    rating?: 1 | 2 | 3 | 4 | 5; // 1-5 star rating
  };
  createdAt: string;
  updatedAt: string;
}

export interface CheckIn {
  id: string;
  studentId: string;
  studentName: string;
  timestamp: string;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  status: 'success' | 'failed';
  isAutomatic?: boolean; // To distinguish auto check-ins from manual ones
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: string;
}

export interface Assignment {
  id: string;
  studentId: string;
  supervisorId: string;
  assignedBy: string; // Admin who made the assignment
  assignedAt: string;
  isActive: boolean;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterUserData) => Promise<void>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  loading: boolean;
}

export interface RegisterUserData {
  name: string;
  email: string;
  password: string;
  role: 'student' | 'supervisor';
  institution?: string;
  department?: string;
  course?: string;
  matricNumber?: string; // Added for students
  placementAddress?: string;
}
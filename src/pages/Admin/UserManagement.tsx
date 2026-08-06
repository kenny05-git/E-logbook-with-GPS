import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Papa from 'papaparse';
import { 
  Users, 
  Search, 
  Plus,
  Trash2,
  Eye,
  Mail,
  Shield,
  UserPlus,
  Download,
  Upload,
  CheckCircle,
  XCircle,
} from 'lucide-react';

// Mock user data - in a real app, this would come from your backend
const mockUsers = [
  {
    id: '1',
    name: 'John Smith',
    email: 'student@example.com',
    role: 'student',
    institution: 'University of Technology',
    department: 'Computer Science',
    matricNumber: 'CS2024001',
    isActive: true,
    lastLogin: '2024-01-22T09:00:00Z',
    createdAt: '2024-01-15T10:00:00Z',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150'
  },
  {
    id: '2',
    name: 'Dr. Sarah Johnson',
    email: 'supervisor@example.com',
    role: 'supervisor',
    institution: 'University of Technology',
    department: 'Computer Science',
    isActive: true,
    lastLogin: '2024-01-22T08:30:00Z',
    createdAt: '2024-01-10T10:00:00Z',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150'
  },
  {
    id: '3',
    name: 'Michael Chen',
    email: 'admin@example.com',
    role: 'admin',
    institution: 'University of Technology',
    department: 'Administration',
    isActive: true,
    lastLogin: '2024-01-22T07:45:00Z',
    createdAt: '2024-01-01T10:00:00Z',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150'
  },
  {
    id: '4',
    name: 'Emily Davis',
    email: 'emily.davis@example.com',
    role: 'student',
    institution: 'University of Technology',
    department: 'Engineering',
    matricNumber: 'ENG2024002',
    isActive: false,
    lastLogin: '2024-01-20T16:20:00Z',
    createdAt: '2024-01-12T14:30:00Z',
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150'
  }
];

const UserManagement: React.FC = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState(mockUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState<any>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);



  const [newUser, setNewUser] = useState({
  name: '',
  email: '',
  role: 'student',
  institution: '',
  department: '',
  matricNumber: '',
  isActive: true,
  lastLogin: new Date().toISOString(),
  createdAt: new Date().toISOString(),
  avatar: '',        // stores preview URL
  avatarFile: null,  // stores the actual file
});


  // Filter users
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (user.matricNumber && user.matricNumber.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && user.isActive) ||
                         (statusFilter === 'inactive' && !user.isActive);
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleToggleUserStatus = (userId: string) => {
    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, isActive: !user.isActive } : user
    ));
  };

  const handleCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  Papa.parse(file, {
    header: true,
    skipEmptyLines: true,
    complete: function (results) {
      const parsedData = results.data as any[];

      const isValid = parsedData.every(row =>
        row.name && row.email && row.role && row.department
      );

      if (!isValid) {
        setUploadError('Missing required fields in some rows (name, email, role, department)');
        return;
      }

      const newUsers = parsedData.map((row, index) => ({
        id: `imported-${Date.now()}-${index}`,
        name: row.name,
        email: row.email,
        role: row.role.toLowerCase(),
        department: row.department,
        institution: row.institution || 'Unknown',
        isActive: true,
        lastLogin: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        avatar: 'https://ui-avatars.com/api/?name=' + encodeURIComponent(row.name),
        matricNumber: row.matricNumber || '',
      }));

      setUsers(prev => [...prev, ...newUsers]);
      setShowUploadModal(false);
      setUploadError(null);
    },
    error: function () {
      setUploadError('Failed to read file. Make sure it is a valid CSV.');
    }
  });
};



  const handleDeleteUser = (user: any) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };


  const handleViewUser = (user: any) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  const handleEditUser = (userId: string) => {
    alert(`Editing user ${userId}`);
  };

  const handleSendEmail = (email: string) => {
    window.open(`mailto:${email}`, '_blank');
  };

  const handleExportUsers = () => {
    // Create CSV content
    const headers = ['Name', 'Email', 'Role', 'Department', 'Status', 'Last Login'];
    const csvContent = [
      headers.join(','),
      ...filteredUsers.map(user => [
        user.name,
        user.email,
        user.role,
        user.department,
        user.isActive ? 'Active' : 'Inactive',
        new Date(user.lastLogin).toLocaleDateString()
      ].join(','))
    ].join('\n');

    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'users.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleImportUsers = () => {
    alert('Import users functionality would be implemented here');
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'supervisor': return 'bg-blue-100 text-blue-800';
      case 'student': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return Shield;
      case 'supervisor': return Users;
      case 'student': return UserPlus;
      default: return Users;
    }
  };

  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.isActive).length;
  const studentCount = users.filter(u => u.role === 'student').length;
  const supervisorCount = users.filter(u => u.role === 'supervisor').length;
  const adminCount = users.filter(u => u.role === 'admin').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
            <p className="text-gray-600 mt-2">Manage all system users and their permissions</p>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-3">
            <button 
  onClick={() => setShowUploadModal(true)}
  className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
>
  <Upload className="h-4 w-4" />
  <span>Import</span>
</button>

            <button 
              onClick={handleExportUsers}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
            >
              <Download className="h-4 w-4" />
              <span>Export</span>
            </button>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Add User</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-3 rounded-full">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{totalUsers}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="bg-green-100 p-3 rounded-full">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Active Users</p>
              <p className="text-2xl font-bold text-gray-900">{activeUsers}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="bg-purple-100 p-3 rounded-full">
              <UserPlus className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Students</p>
              <p className="text-2xl font-bold text-gray-900">{studentCount}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="bg-orange-100 p-3 rounded-full">
              <Shield className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Supervisors</p>
              <p className="text-2xl font-bold text-gray-900">{supervisorCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Roles</option>
              <option value="student">Students</option>
              <option value="supervisor">Supervisors</option>
              <option value="admin">Admins</option>
            </select>
          </div>
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Login
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => {
                const RoleIcon = getRoleIcon(user.role);
                return (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                          {user.matricNumber && (
                            <div className="text-xs text-gray-400">{user.matricNumber}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <RoleIcon className="h-4 w-4 text-gray-400" />
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.department}</div>
                      <div className="text-sm text-gray-500">{user.institution}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(user.lastLogin).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleViewUser(user)}
                          className="p-1 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                          title="View user"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        {/* <button
                          onClick={() => handleEditUser(user.id)}
                          className="p-1 text-gray-400 hover:text-green-600 rounded-lg hover:bg-green-50 transition-colors"
                          title="Edit user"
                        >
                          <Edit className="h-4 w-4" />
                        </button> */}
                        <button
                          onClick={() => handleSendEmail(user.email)}
                          className="p-1 text-gray-400 hover:text-purple-600 rounded-lg hover:bg-purple-50 transition-colors"
                          title="Send email"
                        >
                          <Mail className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleToggleUserStatus(user.id)}
                          className={`p-1 rounded-lg transition-colors ${
                            user.isActive
                              ? 'text-gray-400 hover:text-orange-600 hover:bg-orange-50'
                              : 'text-gray-400 hover:text-green-600 hover:bg-green-50'
                          }`}
                          title={user.isActive ? 'Deactivate user' : 'Activate user'}
                        >
                          {user.isActive ? <XCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                        </button>
                        <button
                        onClick={() => handleDeleteUser(user)}
                        className="p-1 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                        title="Delete user"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>

                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="p-12 text-center">
            <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your search or filter criteria</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setRoleFilter('all');
                setStatusFilter('all');
              }}
              className="text-blue-600 hover:text-blue-500 font-medium"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      {showCreateModal && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-xl shadow-xl max-w-xl w-full p-6">
      <h2 className="text-xl font-semibold mb-4">Add New User</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const newUserWithId = {
            ...newUser,
            id: (users.length + 1).toString(),
            avatar: newUser.avatar || "https://ui-avatars.com/api/?name=" + encodeURIComponent(newUser.name)
          };
          setUsers(prev => [...prev, newUserWithId]);
          setShowCreateModal(false);
          setNewUser({
            name: '',
            email: '',
            role: 'student',
            institution: '',
            department: '',
            matricNumber: '',
            avatar: '',
            avatarFile: null,
            isActive: true,
            lastLogin: new Date().toISOString(),
            createdAt: new Date().toISOString()
          });
        }}
        className="space-y-4"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            value={newUser.name}
            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            required
            className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            required
            className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Role</label>
          <select
            value={newUser.role}
            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
            className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2"
          >
            <option value="student">Student</option>
            <option value="supervisor">Supervisor</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        {newUser.role === 'student' && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Matric Number</label>
            <input
              type="text"
              value={newUser.matricNumber}
              onChange={(e) => setNewUser({ ...newUser, matricNumber: e.target.value })}
              className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>
        )}
        <div>
          <label className="block text-sm font-medium text-gray-700">Institution</label>
          <input
            type="text"
            value={newUser.institution}
            onChange={(e) => setNewUser({ ...newUser, institution: e.target.value })}
            className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Department</label>
          <input
            type="text"
            value={newUser.department}
            onChange={(e) => setNewUser({ ...newUser, department: e.target.value })}
            className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2"
          />
        </div>
        <div>
  <label className="block text-sm font-medium text-gray-700">Avatar (Image Upload)</label>
  <input
    type="file"
    accept="image/*"
    onChange={(e) => {
      const file = e.target.files?.[0];
      if (file) {
        const previewUrl = URL.createObjectURL(file);
        setNewUser({ ...newUser, avatar: previewUrl, avatarFile: file });
      }
    }}
    className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border file:border-gray-300 file:text-sm file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100"
  />
  {newUser.avatar && (
    <div className="mt-2">
      <img src={newUser.avatar} alt="Preview" className="h-16 w-16 rounded-full object-cover border" />
    </div>
  )}
</div>
<div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={() => setShowCreateModal(false)}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
          >
            Add User
          </button>
        </div>
      </form>
    </div>
  </div>
)}

{showDeleteModal && userToDelete && (
  <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
    <div className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden">
      <div className="p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-2">Delete User</h2>
        <p className="text-gray-700">
          Are you sure you want to permanently delete <span className="font-semibold">{userToDelete.name}</span>? <br />
          This action <span className="text-red-600 font-medium">cannot be undone</span>.
        </p>
      </div>
      <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
        <button
          onClick={() => setShowDeleteModal(false)}
          className="px-4 py-2 rounded-lg text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={() => {
            setUsers((prev) => prev.filter((u) => u.id !== userToDelete.id));
            setShowDeleteModal(false);
            setUserToDelete(null);
          }}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Yes, Delete
        </button>
      </div>
    </div>
  </div>
)}

{showUploadModal && (
  <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
    <div className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden">
      <div className="p-6 space-y-4">
        <h2 className="text-lg font-bold text-gray-900">Import Users (.CSV)</h2>
        <input
          type="file"
          accept=".csv"
          onChange={(e) => handleCSVUpload(e)}
          className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:border file:rounded-lg file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
        {uploadError && <p className="text-sm text-red-500">{uploadError}</p>}
      </div>
      <div className="px-6 py-4 flex justify-end bg-gray-50">
        <button
          onClick={() => {
            setShowUploadModal(false);
            setUploadError(null);
          }}
          className="px-4 py-2 rounded-lg text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  </div>
)}


      {/* User Details Modal */}
      {showUserModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">User Details</h3>
                <button
                  onClick={() => setShowUserModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-center space-x-4 mb-6">
                <img
                  src={selectedUser.avatar}
                  alt={selectedUser.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <h4 className="text-xl font-semibold text-gray-900">{selectedUser.name}</h4>
                  <p className="text-gray-600">{selectedUser.email}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(selectedUser.role)}`}>
                      {selectedUser.role.charAt(0).toUpperCase() + selectedUser.role.slice(1)}
                    </span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      selectedUser.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {selectedUser.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <h5 className="text-sm font-medium text-gray-700 mb-2">Institution</h5>
                  <p className="text-gray-900">{selectedUser.institution}</p>
                </div>
                <div>
                  <h5 className="text-sm font-medium text-gray-700 mb-2">Department</h5>
                  <p className="text-gray-900">{selectedUser.department}</p>
                </div>
                {selectedUser.matricNumber && (
                  <div>
                    <h5 className="text-sm font-medium text-gray-700 mb-2">Matric Number</h5>
                    <p className="text-gray-900">{selectedUser.matricNumber}</p>
                  </div>
                )}
                <div>
                  <h5 className="text-sm font-medium text-gray-700 mb-2">Last Login</h5>
                  <p className="text-gray-900">{new Date(selectedUser.lastLogin).toLocaleString()}</p>
                </div>
                <div>
                  <h5 className="text-sm font-medium text-gray-700 mb-2">Created</h5>
                  <p className="text-gray-900">{new Date(selectedUser.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setShowUserModal(false)}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Close
              </button>
              {/* <button 
                onClick={() => handleEditUser(selectedUser.id)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Edit User
              </button> */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
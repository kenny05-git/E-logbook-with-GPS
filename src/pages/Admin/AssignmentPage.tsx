import React, { useState } from 'react';
import { User } from 'lucide-react';

// Mock Data
const mockStudents = [
  { id: 'stu1', name: 'Alice Johnson', matric: 'SE2021/001', dept: 'Software Engineering', avatar: '', assignedTo: null },
  { id: 'stu2', name: 'David Smith', matric: 'SE2021/002', dept: 'Software Engineering', avatar: '', assignedTo: 'sup1' },
  { id: 'stu3', name: 'Lola Doe', matric: 'IT2021/045', dept: 'Information Tech', avatar: '', assignedTo: null }
];

const mockSupervisors = [
  { id: 'sup1', name: 'Dr. Ahmed', dept: 'Software Engineering' },
  { id: 'sup2', name: 'Mrs. Chioma', dept: 'Information Tech' }
];

const departments = ['All', 'Software Engineering', 'Information Tech'];

const AssignmentPage: React.FC = () => {
  const [selectedDept, setSelectedDept] = useState('All');
  const [students, setStudents] = useState(mockStudents);
  const [supervisors] = useState(mockSupervisors);

  const handleAssign = (studentId: string, supervisorId: string) => {
    setStudents((prev) =>
      prev.map((stu) =>
        stu.id === studentId ? { ...stu, assignedTo: supervisorId } : stu
      )
    );
  };

  const handleUnassign = (studentId: string) => {
    setStudents((prev) =>
      prev.map((stu) =>
        stu.id === studentId ? { ...stu, assignedTo: null } : stu
      )
    );
  };

  const filteredStudents = selectedDept === 'All'
    ? students
    : students.filter((s) => s.dept === selectedDept);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Student Assignment</h1>
        <select
          value={selectedDept}
          onChange={(e) => setSelectedDept(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2"
        >
          {departments.map((dept) => (
            <option key={dept} value={dept}>{dept}</option>
          ))}
        </select>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStudents.map((student) => {
          const assignedSupervisor = supervisors.find(s => s.id === student.assignedTo);
          const deptSupervisors = supervisors.filter(s => s.dept === student.dept);

          return (
            <div key={student.id} className="p-4 bg-white shadow rounded-lg space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                  {student.avatar ? (
                    <img src={student.avatar} alt="avatar" className="rounded-full w-12 h-12 object-cover" />
                  ) : (
                    <User className="text-gray-500" />
                  )}
                </div>
                <div>
                  <h2 className="font-semibold text-lg">{student.name}</h2>
                  <p className="text-sm text-gray-600">{student.matric}</p>
                  <p className="text-xs text-gray-500 italic">{student.dept}</p>
                </div>
              </div>

              {assignedSupervisor ? (
                <div className="space-y-2">
                  <p className="text-sm text-green-600">Assigned to: {assignedSupervisor.name}</p>
                  <button
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-md text-sm"
                    onClick={() => handleUnassign(student.id)}
                  >
                    Unassign
                  </button>
                </div>
              ) : (
                <div>
                  <select
                    defaultValue=""
                    onChange={(e) => handleAssign(student.id, e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-2 w-full text-sm"
                  >
                    <option value="" disabled>Select Supervisor</option>
                    {deptSupervisors.map((sup) => (
                      <option key={sup.id} value={sup.id}>{sup.name}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AssignmentPage;

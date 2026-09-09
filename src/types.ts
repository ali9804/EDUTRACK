export type Role = 'student' | 'teacher' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar: string;
  rollNumber?: string;
  department: string;
  program?: string;
  semester?: number;
  contactNumber?: string;
  address?: string;
  status: 'active' | 'suspended';
  assignedSubjectIds?: string[]; // for teachers or students
}

export interface Subject {
  id: string;
  code: string;
  name: string;
  creditHours: number;
  department: string;
  semester: number;
  teacherId: string;
  teacherName: string;
  color: string;
  schedule?: string;
  room?: string;
}

export type AttendanceStatus = 'present' | 'absent' | 'late';

export interface AttendanceRecord {
  id: string;
  studentId: string;
  subjectId: string;
  date: string; // YYYY-MM-DD
  status: AttendanceStatus;
}

export interface MarksRecord {
  id: string;
  studentId: string;
  subjectId: string;
  assignment: number; // Max 15
  quiz: number;       // Max 15
  midterm: number;    // Max 30
  finalExam: number;  // Max 40
  totalMarks: number; // Calculated (Max 100)
  grade: string;      // A, A-, B+, B, C, F
  gpa: number;        // 4.0 scale
  semester: number;
}

export interface TeacherFeedback {
  id: string;
  studentId: string;
  teacherId: string;
  teacherName: string;
  subjectId: string;
  subjectName: string;
  remarks: string;
  performanceStatus: 'Excellent' | 'Good' | 'Average' | 'Needs Improvement' | 'Critical';
  date: string;
}

export interface FeeChallan {
  id: string;
  challanNo: string;
  studentId: string;
  studentName: string;
  rollNumber: string;
  department: string;
  semester: number;
  issueDate: string;
  dueDate: string;
  tuitionFee: number;
  examFee: number;
  libraryFee: number;
  labFee: number;
  totalAmount: number;
  status: 'paid' | 'unpaid';
  paidDate?: string;
  paymentMethod?: 'Online Banking' | 'Cash / Bank Branch' | 'Credit Card';
  transactionId?: string;
}

export interface SemesterGPA {
  semester: number;
  gpa: number;
  creditHours: number;
  status: string;
}

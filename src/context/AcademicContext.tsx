import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  Role,
  Subject,
  AttendanceRecord,
  AttendanceStatus,
  MarksRecord,
  TeacherFeedback,
  FeeChallan,
  SemesterGPA,
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_SUBJECTS,
  INITIAL_ATTENDANCE,
  INITIAL_MARKS,
  INITIAL_FEEDBACKS,
  INITIAL_CHALLANS,
  INITIAL_SEMESTER_HISTORY,
} from '../data/mockData';
import { calculateGradeAndGPA, getAttendanceStatus } from '../utils/academicCalculations';

interface AcademicContextType {
  currentUser: User;
  users: User[];
  subjects: Subject[];
  attendance: AttendanceRecord[];
  marks: MarksRecord[];
  feedbacks: TeacherFeedback[];
  challans: FeeChallan[];
  semesterHistory: SemesterGPA[];

  // Role / User management
  switchUser: (userId: string) => void;
  switchRole: (role: Role) => void;
  updateCurrentUserProfile: (data: Partial<User>) => void;

  // Student operations (Admin)
  addStudent: (student: Omit<User, 'id'>) => void;
  updateStudent: (id: string, data: Partial<User>) => void;
  deleteStudent: (id: string) => void;

  // Teacher operations (Admin)
  addTeacher: (teacher: Omit<User, 'id'>) => void;
  updateTeacher: (id: string, data: Partial<User>) => void;
  deleteTeacher: (id: string) => void;

  // Subject operations (Admin)
  addSubject: (subject: Omit<Subject, 'id'>) => void;
  updateSubject: (id: string, data: Partial<Subject>) => void;
  deleteSubject: (id: string) => void;

  // Attendance operations (Teacher / Admin)
  markAttendance: (subjectId: string, date: string, records: { studentId: string; status: AttendanceStatus }[]) => void;
  deleteAttendanceRecord: (recordId: string) => void;

  // Marks operations (Teacher / Admin)
  updateStudentMarks: (
    studentId: string,
    subjectId: string,
    marks: { assignment: number; quiz: number; midterm: number; finalExam: number }
  ) => void;

  // Feedback operations (Teacher)
  addFeedback: (
    studentId: string,
    teacherId: string,
    subjectId: string,
    remarks: string,
    status: TeacherFeedback['performanceStatus']
  ) => void;

  // Fee Challan operations (Admin / Student)
  generateChallan: (challan: Omit<FeeChallan, 'id' | 'challanNo'>) => void;
  generateBulkChallans: (
    semester: number,
    tuition: number,
    exam: number,
    library: number,
    lab: number,
    dueDate: string
  ) => void;
  updateChallanStatus: (
    challanId: string,
    status: 'paid' | 'unpaid',
    paymentMethod?: FeeChallan['paymentMethod']
  ) => void;

  // Calculations / Selectors
  getStudentAttendanceStats: (studentId: string) => {
    overallPercentage: number;
    totalClasses: number;
    presentClasses: number;
    absentClasses: number;
    lateClasses: number;
    status: 'Good' | 'Warning' | 'Short Attendance';
    subjectStats: Array<{
      subject: Subject;
      total: number;
      present: number;
      absent: number;
      late: number;
      percentage: number;
      status: 'Good' | 'Warning' | 'Short Attendance';
    }>;
  };

  getStudentAcademicSummary: (studentId: string) => {
    subjectMarks: Array<{
      subject: Subject;
      marksRecord: MarksRecord;
    }>;
    currentSemesterGPA: number;
    overallCGPA: number;
    totalCredits: number;
    passedCredits: number;
  };

  resetToDefaultData: () => void;
}

const AcademicContext = createContext<AcademicContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY_PREFIX = 'sapms_v1_';

export const AcademicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY_PREFIX}users`);
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [currentUserId, setCurrentUserId] = useState<string>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY_PREFIX}currentUserId`);
    return saved || 'std-1'; // Default to student Ali Hassan
  });

  const [subjects, setSubjects] = useState<Subject[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY_PREFIX}subjects`);
    return saved ? JSON.parse(saved) : INITIAL_SUBJECTS;
  });

  const [attendance, setAttendance] = useState<AttendanceRecord[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY_PREFIX}attendance`);
    return saved ? JSON.parse(saved) : INITIAL_ATTENDANCE;
  });

  const [marks, setMarks] = useState<MarksRecord[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY_PREFIX}marks`);
    return saved ? JSON.parse(saved) : INITIAL_MARKS;
  });

  const [feedbacks, setFeedbacks] = useState<TeacherFeedback[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY_PREFIX}feedbacks`);
    return saved ? JSON.parse(saved) : INITIAL_FEEDBACKS;
  });

  const [challans, setChallans] = useState<FeeChallan[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY_PREFIX}challans`);
    return saved ? JSON.parse(saved) : INITIAL_CHALLANS;
  });

  const [semesterHistory] = useState<SemesterGPA[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY_PREFIX}semesters`);
    return saved ? JSON.parse(saved) : INITIAL_SEMESTER_HISTORY;
  });

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY_PREFIX}users`, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY_PREFIX}currentUserId`, currentUserId);
  }, [currentUserId]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY_PREFIX}subjects`, JSON.stringify(subjects));
  }, [subjects]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY_PREFIX}attendance`, JSON.stringify(attendance));
  }, [attendance]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY_PREFIX}marks`, JSON.stringify(marks));
  }, [marks]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY_PREFIX}feedbacks`, JSON.stringify(feedbacks));
  }, [feedbacks]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY_PREFIX}challans`, JSON.stringify(challans));
  }, [challans]);

  const currentUser = users.find((u) => u.id === currentUserId) || users[0];

  const switchUser = (userId: string) => {
    const found = users.find((u) => u.id === userId);
    if (found) {
      setCurrentUserId(found.id);
    }
  };

  const switchRole = (role: Role) => {
    const firstUserWithRole = users.find((u) => u.role === role);
    if (firstUserWithRole) {
      setCurrentUserId(firstUserWithRole.id);
    }
  };

  const updateCurrentUserProfile = (data: Partial<User>) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === currentUser.id ? { ...u, ...data } : u))
    );
  };

  const addStudent = (studentData: Omit<User, 'id'>) => {
    const newStudent: User = {
      ...studentData,
      id: `std-${Date.now()}`,
      role: 'student',
      status: studentData.status || 'active',
      avatar:
        studentData.avatar ||
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    };
    setUsers((prev) => [...prev, newStudent]);
  };

  const updateStudent = (id: string, data: Partial<User>) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, ...data } : u)));
  };

  const deleteStudent = (id: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
    setAttendance((prev) => prev.filter((a) => a.studentId !== id));
    setMarks((prev) => prev.filter((m) => m.studentId !== id));
    setChallans((prev) => prev.filter((c) => c.studentId !== id));
  };

  const addTeacher = (teacherData: Omit<User, 'id'>) => {
    const newTeacher: User = {
      ...teacherData,
      id: `tea-${Date.now()}`,
      role: 'teacher',
      status: teacherData.status || 'active',
      avatar:
        teacherData.avatar ||
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    };
    setUsers((prev) => [...prev, newTeacher]);
  };

  const updateTeacher = (id: string, data: Partial<User>) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, ...data } : u)));
  };

  const deleteTeacher = (id: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
  };

  const addSubject = (subjectData: Omit<Subject, 'id'>) => {
    const newSubject: Subject = {
      ...subjectData,
      id: `sub-${Date.now()}`,
    };
    setSubjects((prev) => [...prev, newSubject]);
  };

  const updateSubject = (id: string, data: Partial<Subject>) => {
    setSubjects((prev) => prev.map((s) => (s.id === id ? { ...s, ...data } : s)));
  };

  const deleteSubject = (id: string) => {
    setSubjects((prev) => prev.filter((s) => s.id !== id));
    setAttendance((prev) => prev.filter((a) => a.subjectId !== id));
    setMarks((prev) => prev.filter((m) => m.subjectId !== id));
  };

  const markAttendance = (
    subjectId: string,
    date: string,
    records: { studentId: string; status: AttendanceStatus }[]
  ) => {
    setAttendance((prev) => {
      // Remove any existing records for the same subject and date
      const filtered = prev.filter(
        (a) => !(a.subjectId === subjectId && a.date === date)
      );
      const newRecords: AttendanceRecord[] = records.map((r, idx) => ({
        id: `att-${Date.now()}-${idx}`,
        subjectId,
        date,
        studentId: r.studentId,
        status: r.status,
      }));
      return [...filtered, ...newRecords];
    });
  };

  const deleteAttendanceRecord = (recordId: string) => {
    setAttendance((prev) => prev.filter((a) => a.id !== recordId));
  };

  const updateStudentMarks = (
    studentId: string,
    subjectId: string,
    marksInput: { assignment: number; quiz: number; midterm: number; finalExam: number }
  ) => {
    const totalMarks =
      marksInput.assignment +
      marksInput.quiz +
      marksInput.midterm +
      marksInput.finalExam;
    const { grade, gpa } = calculateGradeAndGPA(totalMarks);

    setMarks((prev) => {
      const existingIndex = prev.findIndex(
        (m) => m.studentId === studentId && m.subjectId === subjectId
      );
      const updatedRecord: MarksRecord = {
        id: existingIndex >= 0 ? prev[existingIndex].id : `mrk-${Date.now()}`,
        studentId,
        subjectId,
        assignment: marksInput.assignment,
        quiz: marksInput.quiz,
        midterm: marksInput.midterm,
        finalExam: marksInput.finalExam,
        totalMarks,
        grade,
        gpa,
        semester: 5,
      };

      if (existingIndex >= 0) {
        const next = [...prev];
        next[existingIndex] = updatedRecord;
        return next;
      } else {
        return [...prev, updatedRecord];
      }
    });
  };

  const addFeedback = (
    studentId: string,
    teacherId: string,
    subjectId: string,
    remarks: string,
    status: TeacherFeedback['performanceStatus']
  ) => {
    const teacher = users.find((u) => u.id === teacherId);
    const subject = subjects.find((s) => s.id === subjectId);

    const newFeedback: TeacherFeedback = {
      id: `fdb-${Date.now()}`,
      studentId,
      teacherId,
      teacherName: teacher ? teacher.name : 'Faculty Member',
      subjectId,
      subjectName: subject ? subject.name : 'Course',
      remarks,
      performanceStatus: status,
      date: new Date().toISOString().split('T')[0],
    };

    setFeedbacks((prev) => [newFeedback, ...prev]);
  };

  const generateChallan = (challanData: Omit<FeeChallan, 'id' | 'challanNo'>) => {
    const challanNo = `CH-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newChallan: FeeChallan = {
      ...challanData,
      id: `chn-${Date.now()}`,
      challanNo,
    };
    setChallans((prev) => [newChallan, ...prev]);
  };

  const generateBulkChallans = (
    semester: number,
    tuition: number,
    exam: number,
    library: number,
    lab: number,
    dueDate: string
  ) => {
    const students = users.filter((u) => u.role === 'student' && u.semester === semester);
    const totalAmount = tuition + exam + library + lab;
    const issueDate = new Date().toISOString().split('T')[0];

    const newChallans: FeeChallan[] = students.map((std, idx) => ({
      id: `chn-bulk-${Date.now()}-${idx}`,
      challanNo: `CH-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      studentId: std.id,
      studentName: std.name,
      rollNumber: std.rollNumber || 'N/A',
      department: std.department,
      semester,
      issueDate,
      dueDate,
      tuitionFee: tuition,
      examFee: exam,
      libraryFee: library,
      labFee: lab,
      totalAmount,
      status: 'unpaid',
    }));

    setChallans((prev) => [...newChallans, ...prev]);
  };

  const updateChallanStatus = (
    challanId: string,
    status: 'paid' | 'unpaid',
    paymentMethod: FeeChallan['paymentMethod'] = 'Online Banking'
  ) => {
    setChallans((prev) =>
      prev.map((c) => {
        if (c.id === challanId) {
          return {
            ...c,
            status,
            paidDate: status === 'paid' ? new Date().toISOString().split('T')[0] : undefined,
            paymentMethod: status === 'paid' ? paymentMethod : undefined,
            transactionId:
              status === 'paid'
                ? `TXN-${Math.floor(10000000 + Math.random() * 90000000)}`
                : undefined,
          };
        }
        return c;
      })
    );
  };

  const getStudentAttendanceStats = (studentId: string) => {
    const studentRecords = attendance.filter((a) => a.studentId === studentId);
    const studentSubjects = subjects.filter((s) => s.semester === 5);

    const subjectStats = studentSubjects.map((sub) => {
      const records = studentRecords.filter((a) => a.subjectId === sub.id);
      const total = records.length;
      const present = records.filter((r) => r.status === 'present').length;
      const absent = records.filter((r) => r.status === 'absent').length;
      const late = records.filter((r) => r.status === 'late').length;

      // Late counts as 0.7 attendance weight in modern universities
      const effectivePresent = present + late * 0.7;
      const percentage = total > 0 ? Math.round((effectivePresent / total) * 100) : 100;
      const { status } = getAttendanceStatus(percentage);

      return {
        subject: sub,
        total,
        present,
        absent,
        late,
        percentage,
        status,
      };
    });

    const totalClasses = studentRecords.length;
    const presentClasses = studentRecords.filter((r) => r.status === 'present').length;
    const absentClasses = studentRecords.filter((r) => r.status === 'absent').length;
    const lateClasses = studentRecords.filter((r) => r.status === 'late').length;

    const overallPercentage =
      totalClasses > 0
        ? Math.round(((presentClasses + lateClasses * 0.7) / totalClasses) * 100)
        : 100;

    const { status } = getAttendanceStatus(overallPercentage);

    return {
      overallPercentage,
      totalClasses,
      presentClasses,
      absentClasses,
      lateClasses,
      status,
      subjectStats,
    };
  };

  const getStudentAcademicSummary = (studentId: string) => {
    const studentSubjects = subjects.filter((s) => s.semester === 5);
    const studentMarks = marks.filter((m) => m.studentId === studentId);

    const subjectMarks = studentSubjects.map((sub) => {
      const record = studentMarks.find((m) => m.subjectId === sub.id);
      if (record) {
        return { subject: sub, marksRecord: record };
      }
      // default placeholder if not entered yet
      return {
        subject: sub,
        marksRecord: {
          id: `tmp-${sub.id}`,
          studentId,
          subjectId: sub.id,
          assignment: 0,
          quiz: 0,
          midterm: 0,
          finalExam: 0,
          totalMarks: 0,
          grade: 'Pending',
          gpa: 0,
          semester: 5,
        },
      };
    });

    // Calculate Semester 5 GPA
    let totalWeightedPoints = 0;
    let totalGradedCredits = 0;
    let totalCredits = 0;
    let passedCredits = 0;

    subjectMarks.forEach(({ subject, marksRecord }) => {
      totalCredits += subject.creditHours;
      if (marksRecord.grade !== 'Pending') {
        totalWeightedPoints += marksRecord.gpa * subject.creditHours;
        totalGradedCredits += subject.creditHours;
        if (marksRecord.grade !== 'F') {
          passedCredits += subject.creditHours;
        }
      }
    });

    const currentSemesterGPA =
      totalGradedCredits > 0
        ? Number((totalWeightedPoints / totalGradedCredits).toFixed(2))
        : 0;

    // Calculate CGPA across all previous semesters + current
    let cumulativePoints = 0;
    let cumulativeCredits = 0;

    semesterHistory.forEach((sem) => {
      if (sem.semester < 5) {
        cumulativePoints += sem.gpa * sem.creditHours;
        cumulativeCredits += sem.creditHours;
      }
    });

    if (totalGradedCredits > 0) {
      cumulativePoints += currentSemesterGPA * totalGradedCredits;
      cumulativeCredits += totalGradedCredits;
    }

    const overallCGPA =
      cumulativeCredits > 0
        ? Number((cumulativePoints / cumulativeCredits).toFixed(2))
        : currentSemesterGPA;

    return {
      subjectMarks,
      currentSemesterGPA,
      overallCGPA,
      totalCredits,
      passedCredits,
    };
  };

  const resetToDefaultData = () => {
    setUsers(INITIAL_USERS);
    setCurrentUserId('std-1');
    setSubjects(INITIAL_SUBJECTS);
    setAttendance(INITIAL_ATTENDANCE);
    setMarks(INITIAL_MARKS);
    setFeedbacks(INITIAL_FEEDBACKS);
    setChallans(INITIAL_CHALLANS);
    localStorage.clear();
  };

  return (
    <AcademicContext.Provider
      value={{
        currentUser,
        users,
        subjects,
        attendance,
        marks,
        feedbacks,
        challans,
        semesterHistory,
        switchUser,
        switchRole,
        updateCurrentUserProfile,
        addStudent,
        updateStudent,
        deleteStudent,
        addTeacher,
        updateTeacher,
        deleteTeacher,
        addSubject,
        updateSubject,
        deleteSubject,
        markAttendance,
        deleteAttendanceRecord,
        updateStudentMarks,
        addFeedback,
        generateChallan,
        generateBulkChallans,
        updateChallanStatus,
        getStudentAttendanceStats,
        getStudentAcademicSummary,
        resetToDefaultData,
      }}
    >
      {children}
    </AcademicContext.Provider>
  );
};

export const useAcademic = () => {
  const context = useContext(AcademicContext);
  if (!context) {
    throw new Error('useAcademic must be used within an AcademicProvider');
  }
  return context;
};

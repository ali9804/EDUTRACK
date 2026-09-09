export function calculateGradeAndGPA(totalMarks: number): { grade: string; gpa: number } {
  const marks = Math.min(100, Math.max(0, Math.round(totalMarks)));

  if (marks >= 85) return { grade: 'A', gpa: 4.0 };
  if (marks >= 80) return { grade: 'A-', gpa: 3.7 };
  if (marks >= 75) return { grade: 'B+', gpa: 3.3 };
  if (marks >= 70) return { grade: 'B', gpa: 3.0 };
  if (marks >= 65) return { grade: 'C+', gpa: 2.7 };
  if (marks >= 60) return { grade: 'C', gpa: 2.3 };
  if (marks >= 50) return { grade: 'D', gpa: 1.7 };
  return { grade: 'F', gpa: 0.0 };
}

export function calculateOverallGPA(
  marksList: Array<{ subjectId: string; gpa: number; totalMarks?: number }>,
  subjectsList: Array<{ id: string; creditHours: number }>
): number {
  if (!marksList.length) return 3.4;

  let totalPoints = 0;
  let totalCredits = 0;

  marksList.forEach((m) => {
    const subject = subjectsList.find((s) => s.id === m.subjectId);
    const credits = subject ? subject.creditHours : 3;
    totalPoints += m.gpa * credits;
    totalCredits += credits;
  });

  return totalCredits > 0 ? Number((totalPoints / totalCredits).toFixed(2)) : 3.4;
}

export function getAttendanceStatus(percentage: number): {
  status: 'Good' | 'Warning' | 'Short Attendance';
  color: string;
  bg: string;
  border: string;
  badgeClass: string;
} {
  if (percentage >= 80) {
    return {
      status: 'Good',
      color: 'text-emerald-700',
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      badgeClass: 'bg-emerald-100 text-emerald-800 border border-emerald-300',
    };
  }
  if (percentage >= 75) {
    return {
      status: 'Warning',
      color: 'text-amber-700',
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      badgeClass: 'bg-amber-100 text-amber-800 border border-amber-300',
    };
  }
  return {
    status: 'Short Attendance',
    color: 'text-rose-700',
    bg: 'bg-rose-50',
    border: 'border-rose-200',
    badgeClass: 'bg-rose-100 text-rose-800 border border-rose-300',
  };
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'PKR',
    maximumFractionDigits: 0,
  }).format(amount).replace('PKR', 'Rs.');
}

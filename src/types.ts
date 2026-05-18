export type UserRole = 'Admin' | 'Manager' | 'Staff' | 'Trainer' | 'Member';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  branchId?: string;
  memberId?: string; // If role is Member
  staffId?: string;  // If role is Staff/Admin/Trainer
}

export interface Gym {
  id: string;
  name: string;
  address: string;
  city: string;
  phone: string;
  createdAt: any;
}

export interface Member {
  id: string;
  fullName: string;
  cnic?: string;
  phone: string;
  email?: string;
  address?: string;
  gender: 'Male' | 'Female' | 'Other';
  admissionDate: any;
  status: 'Active' | 'Inactive' | 'Suspended';
  branchId: string;
  currentPlanId?: string;
  dueDate: any;
  profileImageUrl?: string;
}

export interface MembershipPlan {
  id: string;
  name: string;
  durationMonths: number;
  price: number;
  benefits: string;
  branchId: string;
}

export interface Transaction {
  id: string;
  memberId: string;
  memberName: string;
  amount: number;
  date: any;
  month: string;
  year: number;
  paymentType: 'Cash' | 'Online' | 'Bank Transfer';
  transactionType: 'Admission' | 'Monthly Fee' | 'Personal Training';
  receiptId: string;
  branchId: string;
}

export interface Attendance {
  id: string;
  userId: string;
  userRole: UserRole;
  date: string; // YYYY-MM-DD
  checkInTime: any;
  checkOutTime?: any;
  branchId: string;
}

export interface Trainer {
  id: string;
  name: string;
  email?: string;
  phone: string;
  specialties: string;
  availability: string;
  branchId: string;
  userId?: string;
}

export interface Class {
  id: string;
  name: string;
  trainerId: string;
  trainerName: string;
  startTime: string;
  endTime: string;
  days: string[];
  branchId: string;
}

export interface Staff {
  id: string;
  fullName: string;
  role: 'Admin' | 'Manager' | 'Staff' | 'Trainer';
  phone: string;
  email: string;
  salary: number;
  hireDate: any;
  branchId: string;
  userId?: string;
}

export interface WorkoutPlan {
  id: string;
  memberId: string;
  planContent: string;
  generatedAt: any;
  goal: string;
  preferences: string;
}

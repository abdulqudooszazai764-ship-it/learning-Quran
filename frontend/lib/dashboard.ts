import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";

interface AdminData {
  families: number;
  students: number;
  pending_admissions: number;
  courses: number;
  classes: number;
  open_questions: number;
}

interface TeacherData {
  classes: {
    id: number;
    class_datetime: string;
    duration_minutes: number;
    course__name_en: string;
    student__full_name: string;
  }[];
  open_questions: number;
  students: number;
}

interface FamilyData {
  family_name: string;
  guardian_name: string;
  students: { id: number; full_name: string; is_active: boolean }[];
  classes: {
    id: number;
    student_name: string;
    course_name: string;
    class_datetime: string;
    duration_minutes: number;
    status: string;
  }[];
  questions: { id: number; question: string; answer: string; created_at: string }[];
}

export const useAdminDashboard = () =>
  useQuery({ queryKey: ["admin-dashboard"], queryFn: () => api<AdminData>("/dashboard/admin/") });
export const useTeacherDashboard = () =>
  useQuery({ queryKey: ["teacher-dashboard"], queryFn: () => api<TeacherData>("/dashboard/teacher/") });
export const useFamilyDashboard = () =>
  useQuery({ queryKey: ["family-dashboard"], queryFn: () => api<FamilyData>("/dashboard/family/") });

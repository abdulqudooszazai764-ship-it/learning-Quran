import { z } from "zod";

export const admissionSchema = z.object({
  guardian_name: z.string().min(2, "Guardian name is required"),
  family_name: z.string().min(1, "Family name is required").optional().or(z.literal("")),
  email: z.string().email("Enter a valid email"),
  contact_number: z.string().min(6, "Phone number is required"),
  country: z.string().optional().or(z.literal("")),
  preferred_language: z.enum(["en", "ps", "fa", "ar"]),
  student_names: z.string().min(2, "Student name is required"),
  course_interest: z.string().min(1, "Please select a course interest"),
  message: z.string().max(1000, "Message is too long").optional().or(z.literal("")),
});

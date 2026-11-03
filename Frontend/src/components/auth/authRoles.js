import { GraduationCap, Presentation, ShieldUser } from "lucide-react";

// Role definitions shared by onboarding, login and sign-up.
// Each role maps onto a tonal design-system role (primary / accent / tertiary)
// so colour comes from design-system tokens rather than raw hex values.
export const AUTH_ROLES = {
  student: {
    key: "student",
    label: "Student",
    portal: "Student sign in",
    description: "Courses, assignments, grades and your timetable.",
    icon: GraduationCap,
    badgeVariant: "primary",
    container: "bg-koru-primary-container text-koru-on-primary-container",
    route: "/student/login",
    panelTitle: "Everything you need to learn, in one place.",
    panelBody: "Pick up where you left off. Your courses, deadlines and feedback are waiting.",
  },
  teacher: {
    key: "teacher",
    label: "Teacher",
    portal: "Teacher sign in",
    description: "Run your classes, share material and mark work.",
    icon: Presentation,
    badgeVariant: "accent",
    container: "bg-koru-accent-soft text-koru-accent-ink",
    route: "/teacher/login",
    panelTitle: "Less admin. More teaching.",
    panelBody: "Classes, attendance, grading and announcements from one calm workspace.",
  },
  admin: {
    key: "admin",
    label: "Administrator",
    portal: "Admin sign in",
    description: "Manage people, courses and platform settings.",
    icon: ShieldUser,
    badgeVariant: "tertiary",
    container: "bg-koru-tertiary-container text-koru-on-tertiary-container",
    route: "/admin/login",
    panelTitle: "Keep your institution running smoothly.",
    panelBody: "Oversee users, courses and timetables with a clear view of everything.",
  },
};

export const AUTH_ROLE_LIST = [AUTH_ROLES.student, AUTH_ROLES.teacher, AUTH_ROLES.admin];

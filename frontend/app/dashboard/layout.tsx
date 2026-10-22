"use client";

import {
  Calendar,
  GraduationCap,
  LayoutDashboard,
  MessageCircle,
  ShieldCheck,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";

import { DashboardShell, type DashboardBadge, type DashboardNavItem } from "@/components/dashboard-shell";
import { Skeleton } from "@/components/ui/skeleton";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/hooks/use-auth";
import { useRoleGuard } from "@/hooks/use-role-guard";
import type { Role } from "@/lib/auth";
import { homeFor } from "@/lib/redirect";
import { API_URL } from "@/lib/utils";

const DJANGO_ADMIN = `${API_URL.replace(/\/api\/?$/, "")}/django-admin/`;

const NAV: Record<Role, DashboardNavItem[]> = {
  admin: [
    { href: "/dashboard/admin", labelKey: "overview", icon: LayoutDashboard },
    { href: "/dashboard/teacher", labelKey: "teacherDashboard", icon: GraduationCap },
    { href: DJANGO_ADMIN, labelKey: "adminPanel", icon: ShieldCheck, external: true },
  ],
  teacher: [
    { href: "/dashboard/teacher", labelKey: "overview", icon: LayoutDashboard },
    { href: "/dashboard/teacher/classes", labelKey: "classes", icon: Calendar },
  ],
  family: [
    { href: "/dashboard/family", labelKey: "overview", icon: LayoutDashboard },
    { href: "/dashboard/family/students", labelKey: "students", icon: GraduationCap },
    { href: "/dashboard/family/classes", labelKey: "classes", icon: Calendar },
    { href: "/dashboard/family/questions", labelKey: "questions", icon: MessageCircle },
  ],
};

const BADGE_ICON: Record<Role, DashboardBadge["icon"]> = {
  admin: ShieldCheck,
  teacher: GraduationCap,
  family: Users,
};

const TITLE_KEY: Record<Role, string> = {
  admin: "adminDashboard",
  teacher: "teacherDashboard",
  family: "familyDashboard",
};

/** Single persistent shell — the sidebar does not remount on navigation. */
export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { user, ready } = useRoleGuard();
  const { signOut } = useAuth();
  const { tr } = useLanguage();
  const router = useRouter();

  if (!ready || !user) {
    return (
      <div className="flex h-screen w-full overflow-hidden bg-background">
        <div className="hidden w-16 shrink-0 border-e border-border bg-sidebar p-2 md:flex md:flex-col md:items-center md:gap-2">
          <Skeleton className="h-9 w-9 rounded-xl" />
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-10 rounded-xl" />
          ))}
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="h-10 w-10 animate-pulse rounded-2xl bg-primary/20" />
            <p className="text-sm text-muted-foreground">{tr("loadingDashboard")}</p>
          </div>
        </div>
      </div>
    );
  }

  // Where the user "lives": admins browsing the teacher area keep the admin shell.
  const role = user.role;
  return (
    <DashboardShell
      nav={NAV[role]}
      navLabel={tr(TITLE_KEY[role])}
      homeHref={homeFor(role)}
      badge={{ icon: BADGE_ICON[role], label: tr("academyHub"), sublabel: tr(TITLE_KEY[role]) }}
      user={user}
      onSignOut={() => {
        signOut();
        router.replace("/login");
      }}
    >
      {children}
    </DashboardShell>
  );
}

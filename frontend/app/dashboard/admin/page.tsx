"use client";

import { BookOpen, Calendar, ClipboardList, Globe, GraduationCap, MessageCircle, ShieldCheck } from "lucide-react";

import { EmptyNote, Hero, LoadError, Panel, QuickLink } from "@/components/dashboard-ui";
import { IconBadge } from "@/components/icon-badge";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/hooks/use-auth";
import { useAdminDashboard } from "@/lib/dashboard";
import { API_URL } from "@/lib/utils";

const DJANGO_ADMIN = `${API_URL.replace(/\/api\/?$/, "")}/django-admin/`;

export default function AdminDashboard() {
  const { tr } = useLanguage();
  const { user } = useAuth();
  const { data, error } = useAdminDashboard();

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8">
      <Hero
        eyebrow={tr("welcomeBack")}
        title={user?.display_name || user?.username || ""}
        chip={{ icon: ShieldCheck, label: tr("adminDashboard") }}
        stats={[
          { label: tr("families"), value: data?.families },
          { label: tr("students"), value: data?.students },
          { label: tr("courses"), value: data?.courses },
        ]}
      />

      <LoadError error={error} />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <QuickLink href={DJANGO_ADMIN} external icon={ClipboardList} label={tr("adminPanel")} hint={tr("admissions")} tone="violet" />
        <QuickLink href="/dashboard/teacher" icon={GraduationCap} label={tr("teacherDashboard")} hint={tr("classes")} tone="sky" />
        <QuickLink href="/courses" icon={BookOpen} label={tr("courses")} hint={tr("browseCourses")} tone="emerald" />
        <QuickLink href="/" icon={Globe} label={tr("viewWebsite")} hint="Haseen Academy" tone="amber" />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Panel title={tr("pendingAdmissions")}>
          <div className="flex items-center gap-3">
            <IconBadge icon={ClipboardList} tone="violet" />
            <p className="font-heading text-3xl font-semibold tracking-tight">{data?.pending_admissions ?? "—"}</p>
          </div>
          <div className="mt-3">
            <EmptyNote>
              <a href={DJANGO_ADMIN} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                {tr("adminPanel")} →
              </a>
            </EmptyNote>
          </div>
        </Panel>
        <Panel title={tr("upcomingClasses")}>
          <div className="flex items-center gap-3">
            <IconBadge icon={Calendar} tone="amber" />
            <p className="font-heading text-3xl font-semibold tracking-tight">{data?.classes ?? "—"}</p>
          </div>
        </Panel>
        <Panel title={tr("openQuestions")}>
          <div className="flex items-center gap-3">
            <IconBadge icon={MessageCircle} tone="cyan" />
            <p className="font-heading text-3xl font-semibold tracking-tight">{data?.open_questions ?? "—"}</p>
          </div>
        </Panel>
      </div>

    </div>
  );
}

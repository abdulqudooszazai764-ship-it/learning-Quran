"use client";

import { ArrowRight, Calendar, GraduationCap, MessageCircle } from "lucide-react";
import Link from "next/link";

import { Hero, ListRow, LoadError, Panel, PanelBody, QuickLink, useFormatDate } from "@/components/dashboard-ui";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/hooks/use-auth";
import { useTeacherDashboard } from "@/lib/dashboard";

export default function TeacherDashboard() {
  const { tr } = useLanguage();
  const { user } = useAuth();
  const fmt = useFormatDate();
  const { data, error, isLoading } = useTeacherDashboard();

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8">
      <Hero
        eyebrow={tr("welcomeBack")}
        title={user?.display_name || user?.username || ""}
        chip={{ icon: GraduationCap, label: tr("teacherDashboard") }}
        stats={[
          { label: tr("classes"), value: data?.classes.length },
          { label: tr("openQuestions"), value: data?.open_questions },
          { label: tr("students"), value: data?.students },
        ]}
      />

      <LoadError error={error} />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <QuickLink href="/dashboard/teacher/classes" icon={Calendar} label={tr("classes")} hint={tr("teacherHint")} tone="sky" />
        <QuickLink href="/dashboard/teacher/classes" icon={MessageCircle} label={tr("questions")} hint={`${data?.open_questions ?? 0} ${tr("openQuestions")}`} tone="violet" />
      </div>

      <Panel
        title={tr("upcomingClasses")}
        action={
          <Link href="/dashboard/teacher/classes" className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline">
            {tr("classes")} <ArrowRight className="h-3 w-3 rtl:rotate-180" />
          </Link>
        }
      >
        <PanelBody loading={isLoading} empty={!data?.classes.length}>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {data?.classes.slice(0, 6).map((c) => (
              <ListRow key={c.id} icon={Calendar} tone="sky" title={c.student__full_name} meta={`${c.course__name_en} · ${fmt(c.class_datetime)}`} />
            ))}
          </div>
        </PanelBody>
      </Panel>
    </div>
  );
}

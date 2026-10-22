"use client";

import { ArrowRight, Calendar, GraduationCap, MessageCircle, Users } from "lucide-react";
import Link from "next/link";

import { Hero, ListRow, LoadError, Panel, PanelBody, QuickLink, useFormatDate } from "@/components/dashboard-ui";
import { useLanguage } from "@/context/LanguageContext";
import { useFamilyDashboard } from "@/lib/dashboard";

export default function FamilyDashboard() {
  const { tr } = useLanguage();
  const fmt = useFormatDate();
  const { data, error, isLoading } = useFamilyDashboard();

  const seeAll = (href: string, label: string) => (
    <Link href={href} className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline">
      {label} <ArrowRight className="h-3 w-3 rtl:rotate-180" />
    </Link>
  );

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8">
      <Hero
        eyebrow={tr("welcomeBack")}
        title={data?.guardian_name ?? ""}
        chip={{ icon: Users, label: data?.family_name ?? tr("familyDashboard") }}
        stats={[
          { label: tr("students"), value: data?.students.length },
          { label: tr("classes"), value: data?.classes.length },
          { label: tr("questions"), value: data?.questions.length },
        ]}
      />

      <LoadError error={error} />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <QuickLink href="/dashboard/family/students" icon={GraduationCap} label={tr("students")} hint={tr("students_hint")} tone="emerald" />
        <QuickLink href="/dashboard/family/classes" icon={Calendar} label={tr("classes")} hint={tr("upcomingClasses")} tone="sky" />
        <QuickLink href="/dashboard/family/questions" icon={MessageCircle} label={tr("questions")} hint={tr("awaitingReply")} tone="violet" />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Panel title={tr("upcomingClasses")} action={seeAll("/dashboard/family/classes", tr("classes"))}>
          <PanelBody loading={isLoading} empty={!data?.classes.length}>
            <div className="flex flex-col gap-2">
              {data?.classes.slice(0, 4).map((c) => (
                <ListRow key={c.id} icon={Calendar} tone="sky" title={c.student_name} meta={`${c.course_name} · ${fmt(c.class_datetime)}`} />
              ))}
            </div>
          </PanelBody>
        </Panel>

        <Panel title={tr("questions")} action={seeAll("/dashboard/family/questions", tr("questions"))}>
          <PanelBody loading={isLoading} empty={!data?.questions.length}>
            <div className="flex flex-col gap-2">
              {data?.questions.slice(0, 4).map((q) => (
                <ListRow key={q.id} icon={MessageCircle} tone="violet" title={q.question} meta={q.answer ? tr("answer") : tr("awaitingReply")} />
              ))}
            </div>
          </PanelBody>
        </Panel>
      </div>
    </div>
  );
}

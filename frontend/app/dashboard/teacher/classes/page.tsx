"use client";

import { Calendar } from "lucide-react";

import { ListRow, LoadError, Panel, PanelBody, useFormatDate } from "@/components/dashboard-ui";
import { PageHeader } from "@/components/page-header";
import { useLanguage } from "@/context/LanguageContext";
import { useTeacherDashboard } from "@/lib/dashboard";

export default function TeacherClasses() {
  const { tr } = useLanguage();
  const fmt = useFormatDate();
  const { data, error, isLoading } = useTeacherDashboard();

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <PageHeader title={tr("upcomingClasses")} description={tr("teacherHint")} />
      <LoadError error={error} />
      <Panel title={`${tr("classes")} · ${data?.classes.length ?? 0}`}>
        <PanelBody loading={isLoading} empty={!data?.classes.length} rows={5}>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {data?.classes.map((c) => (
              <ListRow
                key={c.id}
                icon={Calendar}
                tone="sky"
                title={c.student__full_name}
                meta={`${c.course__name_en} · ${fmt(c.class_datetime)} · ${c.duration_minutes} min`}
              />
            ))}
          </div>
        </PanelBody>
      </Panel>
    </div>
  );
}

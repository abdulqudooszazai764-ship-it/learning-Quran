"use client";

import { GraduationCap } from "lucide-react";

import { ListRow, LoadError, Panel, PanelBody } from "@/components/dashboard-ui";
import { PageHeader } from "@/components/page-header";
import { useLanguage } from "@/context/LanguageContext";
import { useFamilyDashboard } from "@/lib/dashboard";

export default function FamilyStudents() {
  const { tr } = useLanguage();
  const { data, error, isLoading } = useFamilyDashboard();

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <PageHeader title={tr("students")} description={tr("students_hint")} />
      <LoadError error={error} />
      <Panel title={`${tr("students")} · ${data?.students.length ?? 0}`}>
        <PanelBody loading={isLoading} empty={!data?.students.length}>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {data?.students.map((s) => (
              <ListRow key={s.id} icon={GraduationCap} tone="emerald" title={s.full_name} meta={s.is_active ? tr("active") : tr("inactive")} />
            ))}
          </div>
        </PanelBody>
      </Panel>
    </div>
  );
}

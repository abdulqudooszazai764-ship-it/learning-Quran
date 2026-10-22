"use client";

import { CheckCircle2, Clock } from "lucide-react";

import { LoadError, Panel, PanelBody, useFormatDate } from "@/components/dashboard-ui";
import { PageHeader } from "@/components/page-header";
import { useLanguage } from "@/context/LanguageContext";
import { useFamilyDashboard } from "@/lib/dashboard";

export default function FamilyQuestions() {
  const { tr } = useLanguage();
  const fmt = useFormatDate();
  const { data, error, isLoading } = useFamilyDashboard();

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6">
      <PageHeader title={tr("questions")} />
      <LoadError error={error} />
      <Panel title={`${tr("questions")} · ${data?.questions.length ?? 0}`}>
        <PanelBody loading={isLoading} empty={!data?.questions.length} rows={4}>
          <div className="flex flex-col gap-3">
            {data?.questions.map((q) => (
              <article key={q.id} className="rounded-xl border border-border/70 bg-background/50 p-4">
                <p className="text-sm font-medium">{q.question}</p>
                <p className="mt-0.5 text-[11px] text-muted-foreground">{fmt(q.created_at)}</p>
                <div className="mt-3 flex items-start gap-2 text-sm">
                  {q.answer ? (
                    <>
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                      <p>
                        <span className="font-medium">{tr("answer")}: </span>
                        {q.answer}
                      </p>
                    </>
                  ) : (
                    <>
                      <Clock className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                      <p className="text-muted-foreground">{tr("awaitingReply")}</p>
                    </>
                  )}
                </div>
              </article>
            ))}
          </div>
        </PanelBody>
      </Panel>
    </div>
  );
}

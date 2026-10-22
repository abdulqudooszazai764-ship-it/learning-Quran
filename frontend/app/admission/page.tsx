"use client";

import { useState, type FormEvent } from "react";
import { Send, ClipboardList } from "lucide-react";
import { admissionSchema } from "@/lib/validations";
import { API_URL } from "@/lib/utils";
import { useLanguage, LANGUAGES } from "@/context/LanguageContext";

const COURSE_OPTIONS = [
  "Quran Recitation (Nazira)",
  "Quran Memorization (Hifz)",
  "Tajweed",
  "Hadith Studies",
  "Islamic Studies",
  "Fiqh and Aqidah",
  "Not sure yet",
];

export default function AdmissionPage() {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const { tr, lang } = useLanguage();

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("idle");
    setMessage("");
    setFieldErrors({});
    setBusy(true);

    const form = new FormData(e.currentTarget);
    const raw = {
      guardian_name: String(form.get("guardian_name") || ""),
      family_name: String(form.get("family_name") || ""),
      email: String(form.get("email") || ""),
      contact_number: String(form.get("contact_number") || ""),
      country: String(form.get("country") || ""),
      preferred_language: String(form.get("preferred_language") || lang || "en"),
      student_names: String(form.get("student_names") || ""),
      course_interest: String(form.get("course_interest") || ""),
      message: String(form.get("message") || ""),
    };

    const parsed = admissionSchema.safeParse(raw);
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      parsed.error.issues.forEach((i) => {
        if (i.path[0]) errs[String(i.path[0])] = i.message;
      });
      setFieldErrors(errs);
      setBusy(false);
      return;
    }

    try {
      const r = await fetch(`${API_URL}/admissions/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const d = await r.json().catch(() => ({}));
      if (!r.ok) {
        throw new Error(
          d.detail || d.message || "Could not submit enquiry. Please try again."
        );
      }
      setStatus("success");
      setMessage(tr("successAdmission"));
      e.currentTarget.reset();
    } catch (err) {
      setStatus("error");
      setMessage(
        err instanceof Error ? err.message : "Unable to connect to the server."
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="page-wrap">
      <div className="container">
        <div className="text-center">
          <div className="eyebrow">
            <ClipboardList size={14} />
            Enrollment enquiry
          </div>
          <h1 className="page-title">{tr("beginJourney")}</h1>
          <p className="muted" style={{ maxWidth: 520, margin: "0 auto" }}>
            Share a few details about your family and preferred course. We will
            respond with guidance on the next steps.
          </p>
        </div>

        <form
          className="form-card glass-strong"
          style={{ maxWidth: 560 }}
          onSubmit={submit}
          noValidate
        >
          <div className="field">
            <label htmlFor="guardian_name">Guardian full name</label>
            <input id="guardian_name" name="guardian_name" placeholder="Parent / Guardian" required />
            {fieldErrors.guardian_name && (
              <p className="field-error">{fieldErrors.guardian_name}</p>
            )}
          </div>

          <div className="field">
            <label htmlFor="family_name">Family name (optional)</label>
            <input id="family_name" name="family_name" placeholder="Family name" />
          </div>

          <div className="grid grid-2" style={{ gap: "1rem" }}>
            <div className="field">
              <label htmlFor="email">Email</label>
              <input id="email" name="email" type="email" placeholder="you@example.com" required />
              {fieldErrors.email && <p className="field-error">{fieldErrors.email}</p>}
            </div>
            <div className="field">
              <label htmlFor="contact_number">Phone</label>
              <input id="contact_number" name="contact_number" type="tel" placeholder="+93 …" required />
              {fieldErrors.contact_number && (
                <p className="field-error">{fieldErrors.contact_number}</p>
              )}
            </div>
          </div>

          <div className="grid grid-2" style={{ gap: "1rem" }}>
            <div className="field">
              <label htmlFor="student_names">Student full name(s)</label>
              <input id="student_names" name="student_names" placeholder="Student name" required />
              {fieldErrors.student_names && (
                <p className="field-error">{fieldErrors.student_names}</p>
              )}
            </div>
            <div className="field">
              <label htmlFor="country">Country (optional)</label>
              <input id="country" name="country" placeholder="Country" />
            </div>
          </div>

          <div className="field">
            <label htmlFor="preferred_language">{tr("preferredLanguage")}</label>
            <select id="preferred_language" name="preferred_language" defaultValue={lang}>
              {LANGUAGES.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.native} ({l.label})
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label htmlFor="course_interest">Course interest</label>
            <select id="course_interest" name="course_interest" required defaultValue="">
              <option value="" disabled>
                Select a course
              </option>
              {COURSE_OPTIONS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            {fieldErrors.course_interest && (
              <p className="field-error">{fieldErrors.course_interest}</p>
            )}
          </div>

          <div className="field">
            <label htmlFor="message">Message (optional)</label>
            <textarea id="message" name="message" rows={4} placeholder="Any notes for the academy…" />
          </div>

          {status === "success" && (
            <p className="notice success" role="status">
              {message}
            </p>
          )}
          {status === "error" && (
            <p className="notice error" role="status">
              {message}
            </p>
          )}

          <button type="submit" className="btn btn-primary" disabled={busy} style={{ width: "100%" }}>
            <Send size={16} />
            {busy ? "Sending…" : tr("submitEnquiry")}
          </button>
        </form>
      </div>
    </section>
  );
}

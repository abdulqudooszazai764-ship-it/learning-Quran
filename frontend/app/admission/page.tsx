"use client";

import { useState, type FormEvent } from "react";
import { Send, ClipboardList } from "lucide-react";
import { admissionSchema } from "@/lib/validations";
import { API_URL } from "@/lib/utils";

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

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formEl = e.currentTarget;
    setStatus("idle");
    setMessage("");
    setFieldErrors({});
    setBusy(true);

    const form = new FormData(formEl);
    const raw = {
      guardian_name: String(form.get("guardian_name") || ""),
      email: String(form.get("email") || ""),
      phone: String(form.get("phone") || ""),
      student_name: String(form.get("student_name") || ""),
      student_age: String(form.get("student_age") || ""),
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
      const extra = [
        parsed.data.email ? `Email: ${parsed.data.email}` : "",
        raw.student_age ? `Student age: ${raw.student_age}` : "",
      ]
        .filter(Boolean)
        .join("\n");

      const r = await fetch(`${API_URL}/admissions/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          guardian_name: parsed.data.guardian_name,
          family_name: parsed.data.guardian_name,
        contact_number: raw.phone || parsed.data.email || "Not provided",
          country: "Not provided",
            student_names: parsed.data.student_names,
          course_interest: parsed.data.course_interest || "",
          message: [parsed.data.message || "", extra].filter(Boolean).join("\n\n"),
        }),
      });
      const d = await r.json().catch(() => ({}));
      if (!r.ok) {
        const firstFieldError = Object.entries(d || {}).find(([, v]) => Array.isArray(v));
        throw new Error(
          d.detail ||
            d.message ||
            (firstFieldError
              ? `${firstFieldError[0]}: ${(firstFieldError[1] as string[])[0]}`
              : `Server error ${r.status} ${r.statusText}`)
        );
      }
      setStatus("success");
      setMessage(
        "Thank you. Your admission enquiry has been received. The academy will contact you soon."
      );
      formEl.reset();
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
          <h1 className="page-title">Begin your learning journey</h1>
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
            <input id="guardian_name" name="guardian_name" placeholder="Parent / Guardian" />
            {fieldErrors.guardian_name && (
              <p className="field-error">{fieldErrors.guardian_name}</p>
            )}
          </div>

          <div className="grid grid-2" style={{ gap: "1rem" }}>
            <div className="field">
              <label htmlFor="email">Email</label>
              <input id="email" name="email" type="email" placeholder="you@example.com" />
              {fieldErrors.email && <p className="field-error">{fieldErrors.email}</p>}
            </div>
            <div className="field">
              <label htmlFor="phone">Phone (optional)</label>
              <input id="phone" name="phone" type="tel" placeholder="+1 …" />
              {fieldErrors.phone && <p className="field-error">{fieldErrors.phone}</p>}
            </div>
          </div>

          <div className="grid grid-2" style={{ gap: "1rem" }}>
            <div className="field">
              <label htmlFor="student_name">Student full name</label>
              <input id="student_name" name="student_name" placeholder="Student name" />
              {fieldErrors.student_name && (
                <p className="field-error">{fieldErrors.student_name}</p>
              )}
            </div>
            <div className="field">
              <label htmlFor="student_age">Student age (optional)</label>
              <input id="student_age" name="student_age" type="number" min={3} max={80} placeholder="e.g. 10" />
              {fieldErrors.student_age && (
                <p className="field-error">{fieldErrors.student_age}</p>
              )}
            </div>
          </div>

          <div className="field">
            <label htmlFor="course_interest">Course interest</label>
            <select id="course_interest" name="course_interest" defaultValue="">
              <option value="" disabled>
                Select a course…
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
            <label htmlFor="message">Additional message (optional)</label>
            <textarea
              id="message"
              name="message"
              placeholder="Share any preferences about schedule, level, or goals…"
            />
            {fieldErrors.message && (
              <p className="field-error">{fieldErrors.message}</p>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: "100%" }}
            disabled={busy}
          >
            <Send size={18} />
            {busy ? "Sending…" : "Submit enquiry"}
          </button>

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
        </form>
      </div>
    </section>
  );
}

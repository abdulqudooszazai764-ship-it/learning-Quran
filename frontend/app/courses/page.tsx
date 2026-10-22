import {
  BookOpen,
  Brain,
  Volume2,
  ScrollText,
  Library,
  Scale,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Courses",
  description:
    "Explore Quran recitation, Hifz, Tajweed, Hadith and Islamic studies courses.",
};

const COURSES = [
  {
    icon: BookOpen,
    name: "Quran Recitation (Nazira)",
    description:
      "Develop accurate, confident Quran reading with guided recitation practice.",
  },
  {
    icon: Brain,
    name: "Quran Memorization (Hifz)",
    description:
      "A structured learning path for students memorizing selected portions or the full Quran.",
  },
  {
    icon: Volume2,
    name: "Tajweed",
    description:
      "Learn the rules that support careful and correct Quran recitation.",
  },
  {
    icon: ScrollText,
    name: "Hadith Studies",
    description:
      "Study selected Hadith with guidance and age-appropriate explanation.",
  },
  {
    icon: Library,
    name: "Islamic Studies",
    description:
      "Build foundational knowledge of Islamic beliefs, practice and character.",
  },
  {
    icon: Scale,
    name: "Fiqh and Aqidah",
    description:
      "Explore foundational Islamic jurisprudence and creed in a guided setting.",
  },
];

export default function CoursesPage() {
  return (
    <section className="page-wrap">
      <div className="container">
        <div className="eyebrow">Our learning paths</div>
        <h1 className="page-title">Courses for a meaningful learning journey</h1>
        <p className="muted" style={{ maxWidth: 560 }}>
          Choose an area of study to discuss with the academy. Course placement and
          learning arrangements can be discussed directly.
        </p>

        <div className="grid grid-3 mt-6">
          {COURSES.map((c) => (
            <article key={c.name} className="card glass card-hover">
              <div className="card-icon">
                <c.icon size={22} />
              </div>
              <h3 style={{ fontWeight: 700, marginBottom: "0.4rem" }}>{c.name}</h3>
              <p className="muted" style={{ fontSize: "0.95rem" }}>
                {c.description}
              </p>
            </article>
          ))}
        </div>

        <div className="cta-band mt-6">
          <div>
            <h2>Ready to start?</h2>
            <p>Tell us about your learning goals and we will guide you.</p>
          </div>
          <Link href="/admission" className="btn btn-gold">
            Apply for admission
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}

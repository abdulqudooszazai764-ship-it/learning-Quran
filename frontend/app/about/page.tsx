import { Target, MessageCircle, Globe } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "Learn about Haseen Quran and Islamic Studies Academy.",
};

const PILLARS = [
  {
    icon: Target,
    title: "Purposeful teaching",
    text: "Lessons focus on understanding, practice and continuous improvement.",
  },
  {
    icon: MessageCircle,
    title: "Family communication",
    text: "Families can contact the academy directly to discuss learning needs and class arrangements.",
  },
  {
    icon: Globe,
    title: "Accessible learning",
    text: "Online learning helps students connect with their teacher from different locations.",
  },
];

export default function AboutPage() {
  return (
    <section className="page-wrap">
      <div className="container">
        <div className="eyebrow">Our academy</div>
        <h1 className="page-title">A sincere commitment to Islamic learning</h1>
        <p className="muted" style={{ maxWidth: 640, fontSize: "1.05rem" }}>
          Haseen Quran and Islamic Studies Academy supports learners through Quran
          recitation, memorization, Hadith and foundational Islamic studies. Lessons
          are designed around clear guidance, respectful communication and steady progress.
        </p>

        <div className="grid grid-3 mt-6">
          {PILLARS.map((p) => (
            <article key={p.title} className="card glass card-hover">
              <div className="card-icon">
                <p.icon size={22} />
              </div>
              <h3 style={{ fontWeight: 700, marginBottom: "0.4rem" }}>{p.title}</h3>
              <p className="muted">{p.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

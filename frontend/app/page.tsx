import Link from "next/link";
import {
  BookOpen,
  GraduationCap,
  Heart,
  Sparkles,
  Users,
  ArrowRight,
} from "lucide-react";

const FEATURES = [
  {
    icon: BookOpen,
    title: "Quran Recitation",
    description:
      "Build confidence and fluency in reading the Holy Quran with guided practice and Tajweed.",
  },
  {
    icon: GraduationCap,
    title: "Quran Memorization",
    description:
      "Structured support for students working toward memorizing selected portions or the full Quran.",
  },
  {
    icon: Heart,
    title: "Hadith & Islamic Studies",
    description:
      "Explore Hadith, foundational Islamic knowledge, character and practical learning.",
  },
];

const VALUES = [
  {
    icon: Sparkles,
    title: "Purposeful teaching",
    text: "Lessons focus on understanding, practice and continuous improvement.",
  },
  {
    icon: Users,
    title: "Family communication",
    text: "Families can contact the academy directly to discuss learning needs and schedules.",
  },
  {
    icon: BookOpen,
    title: "Accessible learning",
    text: "Online learning helps students connect with their teacher from anywhere.",
  },
];

export default function HomePage() {
  return (
    <>
      <section className="hero container">
        <div className="eyebrow">
          <Sparkles size={14} />
          Knowledge · Guidance · Growth
        </div>
        <h1>A beautiful journey with the Quran begins here.</h1>
        <p>
          Personalized online Quran recitation, memorization, Hadith and Islamic
          studies for learners and families around the world.
        </p>
        <div className="hero-actions">
          <Link href="/admission" className="btn btn-gold btn-lg">
            Begin your learning journey
            <ArrowRight size={18} />
          </Link>
          <Link href="/courses" className="btn btn-outline btn-lg">
            Explore our courses
          </Link>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <div className="eyebrow">Learn with purpose</div>
            <h2 className="section-title">Knowledge rooted in tradition</h2>
            <p className="muted">
              Thoughtful teaching, a supportive environment, and a focus on steady progress.
            </p>
          </div>
          <div className="grid grid-3">
            {FEATURES.map((f) => (
              <article key={f.title} className="card glass card-hover">
                <div className="card-icon">
                  <f.icon size={22} />
                </div>
                <h3 style={{ fontWeight: 700, marginBottom: "0.4rem" }}>{f.title}</h3>
                <p className="muted" style={{ fontSize: "0.95rem" }}>
                  {f.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-soft">
            <div className="section-head">
              <div className="eyebrow">A personal approach</div>
              <h2 className="section-title">Learning that fits your family</h2>
              <p className="muted">
                Connect directly with the academy to discuss a suitable learning path,
                schedule, and enrollment information.
              </p>
              <Link href="/admission" className="btn btn-primary mt-4">
                Contact us about enrollment
              </Link>
            </div>
            <div className="grid grid-3" style={{ marginTop: "2rem" }}>
              {VALUES.map((v) => (
                <article key={v.title} className="card glass">
                  <div className="card-icon gold">
                    <v.icon size={20} />
                  </div>
                  <h3 style={{ fontWeight: 650, marginBottom: "0.35rem" }}>{v.title}</h3>
                  <p className="muted" style={{ fontSize: "0.9rem" }}>
                    {v.text}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="cta-band">
            <div>
              <h2>Take the next step in learning.</h2>
              <p>We would be glad to hear from your family.</p>
            </div>
            <Link href="/admission" className="btn btn-gold">
              Get in touch
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

"use client";

import { GraduationCap, Award, MessageCircle, Phone } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

const TEACHER = {
  name: "Ihsanullah Haseen",
  name_ps: "احسان الله حسین",
  name_fa: "احسان‌الله حسین",
  name_ar: "إحسان الله حسين",
  bio_en:
    "Ihsanullah Haseen is the founder and lead teacher of Haseen Quran & Islamic Studies Academy. He is dedicated to teaching Quran recitation, memorization (Hifz), Tajweed, Hadith and foundational Islamic studies with patience, clarity and respect for every student and family.",
  bio_ps:
    "احسان الله حسین د حسین قرآن او اسلامي زده کړو اکاډمۍ بنسټ ایښودونکی او اصلي ښوونکی دی. هغه د قرآن تلاوت، حفظ، تجوید، حدیث او بنسټیزو اسلامي زده کړو تدریس ته وقف دی.",
  bio_fa:
    "احسان‌الله حسین بنیان‌گذار و معلم اصلی آکادمی قرآن و مطالعات اسلامی حسین است. او به آموزش تلاوت قرآن، حفظ، تجوید، حدیث و مطالعات بنیادین اسلامی با صبر و احترام متعهد است.",
  bio_ar:
    "إحسان الله حسين هو مؤسس ومعلم أكاديمية حسين للقرآن والدراسات الإسلامية. يكرس جهده لتعليم تلاوة القرآن والحفظ والتجويد والحديث والدراسات الإسلامية الأساسية بصبر ووضوح واحترام.",
  qualifications_en:
    "Specialized in Quranic studies, Tajweed and Islamic education. Experienced in teaching students of different ages online and supporting families with clear communication in Pashto, Dari, Arabic and English.",
  qualifications_ps:
    "په قرآني زده کړو، تجوید او اسلامي زده کړو کې تخصص. د مختلفو عمرونو زده کوونکو ته آنلاین تدریس او د کورنیو سره په پښتو، دري، عربي او انګلیسي اړیکه.",
  qualifications_fa:
    "تخصص در مطالعات قرآنی، تجوید و آموزش اسلامی. تجربه تدریس آنلاین به دانش‌آموزان در سنین مختلف و ارتباط با خانواده‌ها به پشتو، دری، عربی و انگلیسی.",
  qualifications_ar:
    "متخصص في الدراسات القرآنية والتجويد والتعليم الإسلامي. خبرة في التدريس عبر الإنترنت لطلاب من أعمار مختلفة ودعم الأسر بالتواصل بالبشتو والدارية والعربية والإنجليزية.",
  phone: "+93709935345",
  email: "ihsanzazai1990@gmail.com",
};

export default function TeachersPage() {
  const { lang, tr } = useLanguage();

  const name =
    lang === "ps"
      ? TEACHER.name_ps
      : lang === "fa"
        ? TEACHER.name_fa
        : lang === "ar"
          ? TEACHER.name_ar
          : TEACHER.name;

  const bio =
    lang === "ps"
      ? TEACHER.bio_ps
      : lang === "fa"
        ? TEACHER.bio_fa
        : lang === "ar"
          ? TEACHER.bio_ar
          : TEACHER.bio_en;

  const quals =
    lang === "ps"
      ? TEACHER.qualifications_ps
      : lang === "fa"
        ? TEACHER.qualifications_fa
        : lang === "ar"
          ? TEACHER.qualifications_ar
          : TEACHER.qualifications_en;

  return (
    <section className="page-wrap">
      <div className="container">
        <div className="eyebrow">
          <GraduationCap size={14} />
          {tr("ourTeacher")}
        </div>
        <h1 className="page-title">{tr("meetTeacher")}</h1>

        <article className="teacher-card glass-strong mt-6">
          <div className="teacher-avatar">
            <GraduationCap size={40} />
          </div>
          <div className="teacher-body">
            <h2 className="teacher-name">{name}</h2>
            <p className="muted teacher-role">Lead Teacher &amp; Founder</p>
            <p className="teacher-bio">{bio}</p>

            <div className="teacher-quals">
              <div className="card-icon gold">
                <Award size={18} />
              </div>
              <div>
                <h3 style={{ fontWeight: 650, marginBottom: "0.35rem" }}>
                  {tr("qualifications")}
                </h3>
                <p className="muted" style={{ fontSize: "0.95rem" }}>
                  {quals}
                </p>
              </div>
            </div>

            <div className="teacher-actions">
              <a
                href={`https://wa.me/93709935345`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                <MessageCircle size={16} />
                {tr("whatsapp")}
              </a>
              <a href={`tel:${TEACHER.phone}`} className="btn btn-ghost">
                <Phone size={16} />
                {tr("phone")}: +93 70 993 5345
              </a>
              <Link href="/admission" className="btn btn-gold">
                {tr("admission")}
              </Link>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}

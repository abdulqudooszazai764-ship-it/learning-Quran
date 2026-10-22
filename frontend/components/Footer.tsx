"use client";

import { BookOpen, Phone, Mail } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";

export function Footer() {
  const { tr } = useLanguage();
  const pathname = usePathname();
  if (pathname?.startsWith("/dashboard") || pathname === "/login") return null;

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link href="/" className="brand">
              <span className="brand-icon">
                <BookOpen size={18} />
              </span>
              Haseen <span>Academy</span>
            </Link>
            <p className="muted" style={{ marginTop: "0.75rem", maxWidth: 280 }}>
              Quran &amp; Islamic Studies — thoughtful teaching for every family.
            </p>
          </div>

          <div>
            <h4 className="footer-heading">{tr("contact")}</h4>
            <ul className="footer-list">
              <li>
                <a href="tel:+93709935345">
                  <Phone size={14} />
                  +93 70 993 5345
                </a>
              </li>
              <li>
                <a href="mailto:ihsanzazai1990@gmail.com">
                  <Mail size={14} />
                  ihsanzazai1990@gmail.com
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="footer-heading">Links</h4>
            <ul className="footer-list">
              <li>
                <Link href="/about">{tr("about")}</Link>
              </li>
              <li>
                <Link href="/courses">{tr("courses")}</Link>
              </li>
              <li>
                <Link href="/teachers">{tr("teachers")}</Link>
              </li>
              <li>
                <Link href="/admission">{tr("admission")}</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="muted">
            © {new Date().getFullYear()} Haseen Quran &amp; Islamic Studies Academy
          </p>
        </div>
      </div>
    </footer>
  );
}

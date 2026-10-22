"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { BookOpen, Menu, X, LogIn, Phone } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";

const NAV = [
  { href: "/", labelKey: "home" },
  { href: "/about", labelKey: "about" },
  { href: "/courses", labelKey: "courses" },
  { href: "/teachers", labelKey: "teachers" },
  { href: "/admission", labelKey: "admission" },
];

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { tr } = useLanguage();

  // The sign-in page and the dashboards have their own full-screen layouts.
  if (pathname?.startsWith("/dashboard") || pathname === "/login") return null;

  return (
    <header className="site-header glass">
      <div className="container">
        <div className="header-inner">
          <Link href="/" className="brand">
            <span className="brand-icon">
              <BookOpen size={18} />
            </span>
            Haseen <span>Academy</span>
          </Link>

          <nav className="nav-links" aria-label="Main">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(pathname === item.href && "active")}
              >
                {tr(item.labelKey)}
              </Link>
            ))}
          </nav>

          <div className="header-actions">
            <a
              href="tel:+93709935345"
              className="header-phone"
              title="+93 70 993 5345"
            >
              <Phone size={15} />
              <span>+93 70 993 5345</span>
            </a>
            <LanguageSwitcher />
            <ThemeToggle />
            <Link href="/login" className="btn btn-primary btn-sm">
              <LogIn size={16} />
              {tr("portal")}
            </Link>
            <button
              type="button"
              className="mobile-toggle"
              onClick={() => setOpen((v) => !v)}
              aria-label="Toggle menu"
              aria-expanded={open}
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        <nav className={cn("mobile-nav glass", open && "open")} aria-label="Mobile">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={cn(pathname === item.href && "active")}
            >
              {tr(item.labelKey)}
            </Link>
          ))}
          <a href="tel:+93709935345" onClick={() => setOpen(false)}>
            <Phone size={16} style={{ marginInlineEnd: 8 }} />
            +93 70 993 5345
          </a>
          <Link href="/login" onClick={() => setOpen(false)}>
            {tr("portalLogin")}
          </Link>
        </nav>
      </div>
    </header>
  );
}

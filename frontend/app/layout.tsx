import type { Metadata } from "next";
import { Toaster } from "sonner";

import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: {
    default: "Haseen Quran & Islamic Studies Academy",
    template: "%s | Haseen Academy",
  },
  description:
    "Online Quran recitation, Hifz, Tajweed, Hadith and Islamic studies with patient, clear teaching.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Lexend:wght@500;600;700&display=swap"
        />
      </head>
      <body className="min-h-screen antialiased" suppressHydrationWarning>
        <Providers>
          <Header />
          <div className="site-content">{children}</div>
          <Footer />
          <Toaster position="top-right" richColors closeButton />
        </Providers>
      </body>
    </html>
  );
}

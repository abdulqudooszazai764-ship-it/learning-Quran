# Haseen Quran & Islamic Studies Academy

Modern full-stack foundation for an online Quran and Islamic studies academy.

- **Frontend**: Next.js 15 (App Router) + React 19 + TypeScript  
- **Backend**: Django 5.2 + Django REST Framework + Simple JWT  
- **Database**: PostgreSQL (SQLite acceptable for local only)  
- **Design**: Light / Dark themes, glassmorphism, Lucide icons, Zod validation  
- **Languages**: English, Pashto (پښتو), Dari (دری), Arabic (العربية) with RTL support  
- **Dashboards**: TalkNest-style shell (collapsible sidebar, role guards) for Admin / Teacher / Family
- **UI**: Tailwind CSS v4 + shadcn-style components, next-themes, TanStack Query

---

## What is included

- Public pages: Home, About, Courses, **Teachers**, Admission
- Language switcher (Dari, Pashto, English, Arabic) in header and dashboards
- Contact number: **+93 70 993 5345**
- Teacher page for **Ihsanullah Haseen** with bio in 4 languages
- Admission form → Django API → **email notification** to `ihsanzazai1990@gmail.com`
- JWT login + role dashboards with proper sidebar layout (no page-level scroll issues)

---

## Quick start

### 1. Backend (Django)

```bash
cd backend
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env: set EMAIL_HOST_USER + EMAIL_HOST_PASSWORD (Gmail App Password)
python manage.py migrate   # migrations are included (academy/migrations/0001_initial.py)
python manage.py createsuperuser
python manage.py runserver
```

### 2. Frontend (Next.js)

```bash
cd frontend
npm install
cp .env.example .env.local
# NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api
npm run dev
```

Open http://localhost:3000

---

## Email notifications (admission)

When a student submits the admission form successfully, the backend sends an email to:

**ihsanzazai1990@gmail.com**

Configure in `backend/.env`:

```
EMAIL_HOST_USER=ihsanzazai1990@gmail.com
EMAIL_HOST_PASSWORD=your-gmail-app-password
ADMISSION_NOTIFY_EMAIL=ihsanzazai1990@gmail.com
```

Create a Gmail **App Password**: Google Account → Security → 2-Step Verification → App passwords.

If SMTP is not configured, the admission is still saved; email fails silently so the form still succeeds.

---

## Sign in & dashboards

The portal uses the same design system and structure as TalkNest: split-screen sign-in,
collapsible sidebar shell, hero + quick-action cards, light/dark themes, and full RTL support.

| Role    | Who                                   | Home                 |
|---------|---------------------------------------|----------------------|
| Admin   | Django **superuser**                  | `/dashboard/admin`   |
| Teacher | Django **staff** user (not superuser) | `/dashboard/teacher` |
| Family  | User linked to a **Family** record    | `/dashboard/family`  |

- Sign in at `/login` with the username and password created in Django admin
  (`/django-admin/`). After signing in you are sent straight to your own dashboard.
- Signed-out visitors are redirected to `/login` and returned to the page they wanted.
- Opening another role's area redirects you to your own (admins can also open the teacher area).
- "Keep me signed in" stores the session in `localStorage`; otherwise it ends with the tab.
- The backend exposes `GET /api/me/` (username, display name, role) for role routing.

To link a family login: in Django admin create a **User**, then set it as the `user` of a **Family**.

## Project structure

```
haseen-quran-nextjs-django/
├── frontend/
│   ├── app/           # pages (home, about, courses, teachers, admission, login, dashboards)
│   ├── components/    # Header, Footer, LanguageSwitcher, DashboardSidebar, …
│   ├── context/       # LanguageContext (en / ps / fa / ar)
│   ├── hooks/
│   └── lib/
├── backend/
│   ├── academy/       # models, views, serializers
│   └── config/
└── docs/
```

---

## Contact

- Phone / WhatsApp: **+93 70 993 5345**
- Email: **ihsanzazai1990@gmail.com**

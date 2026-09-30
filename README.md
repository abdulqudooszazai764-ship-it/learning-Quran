# Quran Learning & Islamic Studies Academy – Website

A simple full-stack website for an online Quran academy.
**Frontend:** React (Vite) · **Backend:** Node.js + Express · **Database:** PostgreSQL
**Languages:** English, العربية, دری (Dari), پښتو (Pashto) – RTL is switched automatically.
**No payments:** there is no price, fee, invoice or payment feature anywhere in the code or database.

## What is included
- Public pages: Home, About, Teacher Profile, Courses, Admission (with status checker), Contact, Login, Privacy Policy
- Family dashboard: family & students, courses, class schedule, teacher info, WhatsApp class link, private questions & answers
- Teacher/Admin dashboard: totals, admission requests (accept/decline + message + create family login), families & students, courses (add/edit/hide/remove), class schedule with time zones, attendance (Present/Absent/Excused), questions & answers, teacher profile, testimonials, FAQs, WhatsApp links
- Security: bcrypt password hashing, JWT sessions, role-based access, server-side authorization, helmet, login rate limiting, secrets in environment variables

## Folder structure
```
quran-academy/
  backend/    Express API  (server.js, routes/, controllers/, middleware/, db/schema.sql, db/setup.js)
  frontend/   React app    (src/pages, src/components, src/i18n, src/context, src/api)
```

## 1. Install the tools
1. **Node.js (LTS)** – download from https://nodejs.org and install (accept defaults). Check: `node -v`
2. **PostgreSQL** – download from https://www.postgresql.org/download/ and install. Remember the password you set for the `postgres` user.

## 2. Create the database
Open a terminal (or "SQL Shell (psql)") and run:
```
psql -U postgres
CREATE USER academy_user WITH PASSWORD 'academy_password';
CREATE DATABASE quran_academy OWNER academy_user;
\q
```
(Use your own stronger password and put the same one in `.env`.)

## 3. Set up the backend
```
cd backend
npm install
cp .env.example .env       (Windows: copy .env.example .env)
```
Open `backend/.env` and set:
- `DATABASE_URL` – matches the user/password/database above
- `JWT_SECRET` – a long random text (at least 32 characters)
- `FIRST_ADMIN_EMAIL` and `FIRST_ADMIN_PASSWORD` – the teacher's first login

Then create the tables, the **first admin account**, and the 8 starter courses:
```
npm run setup-db
npm start
```
The API runs at http://localhost:5000 (check http://localhost:5000/api/health).

## 4. Set up the frontend
In a second terminal:
```
cd frontend
npm install
cp .env.example .env
npm run dev
```
Open http://localhost:5173

## 5. First use (teacher)
1. Go to **Login**, sign in with `FIRST_ADMIN_EMAIL` / `FIRST_ADMIN_PASSWORD`.
2. **Teacher Profile** tab: add name, photo link, biography, qualifications, experience, WhatsApp number, contact details.
3. Optionally add real testimonials and FAQs (only genuine reviews – never fake ones).

## 6. Configure WhatsApp
- **Main contact button:** put the number in `frontend/.env` as `VITE_ACADEMY_WHATSAPP_NUMBER` (digits only with country code, e.g. `93700000000`) and also in Teacher Profile → WhatsApp number.
- **Class groups:** in WhatsApp create a group for the family/class, open *Group info → Invite via link → Copy link*, then in the dashboard go to **Families → Open → WhatsApp class link** and paste it. You can also put a link on each individual class in **Class Schedule**.
- **Important:** a WhatsApp link only opens a chat or group. It does **not** start a call by itself. Tell families: *"At class time, open the group and tap the phone icon to start/join the group voice call."* One family phone can be used by all children together.

## 7. Daily workflow
1. A family submits the **Admission** form → it appears as **Pending** in *Admission Requests*.
2. Click **Review**, optionally write a message, then **Accept** (enter a username + temporary password for the family) or **Decline**.
3. Send the username/password to the family on WhatsApp. The family can also check its status on the Admission page using their contact number.
4. Add classes in **Class Schedule**, record attendance, answer questions in **Questions & Answers**.

## 8. Deploy online (simple option)
1. **Database:** create a hosted PostgreSQL (Render, Railway, Neon, Supabase…) and copy its connection string.
2. **Backend:** deploy the `backend` folder to Render/Railway (Node service). Build: `npm install`, start: `npm start`. Set environment variables: `DATABASE_URL`, `JWT_SECRET`, `FRONTEND_URL` (your website address), `NODE_ENV=production`. Run `npm run setup-db` once (from the host's shell) to create tables and the admin.
3. **Frontend:** deploy the `frontend` folder to Netlify/Vercel/Render Static. Build: `npm run build`, publish folder: `dist`. Set `VITE_API_URL` to `https://YOUR-BACKEND-URL/api` and `VITE_ACADEMY_WHATSAPP_NUMBER`. Add a rewrite rule so all paths serve `index.html` (single-page app).
4. Always use HTTPS. Change the admin password after the first login.

## Testing checklist (do this once after setup)
- Submit an admission → appears Pending in the dashboard
- Accept one (with login) and decline another (with a message) → status shows on the Admission page
- Log in as the new family → sees only its own students/classes/questions
- Submit a question as family → answer it as teacher → family sees the answer
- Open the WhatsApp buttons/links
- Log in as Family A and try to open Family B's data: the API has no route that accepts another family's id for family accounts; all `/me` routes use the id from the signed login token, and all other routes require the admin role
- Search the code for "price", "fee", "payment": none exist as features

## Honest notes
- This code was written and syntax-checked but **not run end-to-end** in the build environment (no internet/database there). Run through the checklist above and expect to fix small issues.
- The Dari and Pashto texts were written carefully but should be reviewed by a native speaker.
- The public admission status check uses the contact number only (simple for families). If you want stricter privacy, add a reference code.
- Photo is a URL (link to an image). File uploads are intentionally left out to keep things simple.

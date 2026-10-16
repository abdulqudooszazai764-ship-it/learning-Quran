import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

const Home = lazy(() => import('./pages/Home.jsx'));
const About = lazy(() => import('./pages/About.jsx'));
const TeacherProfile = lazy(() => import('./pages/TeacherProfile.jsx'));
const Courses = lazy(() => import('./pages/Courses.jsx'));
const Admission = lazy(() => import('./pages/Admission.jsx'));
const Contact = lazy(() => import('./pages/Contact.jsx'));
const Login = lazy(() => import('./pages/Login.jsx'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy.jsx'));
const FamilyDashboard = lazy(() => import('./pages/FamilyDashboard.jsx'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard.jsx'));

function PageLoader() {
  return (
    <div className="container" style={{ padding: '4rem 1.25rem', textAlign: 'center' }}>
      <div className="skeleton" style={{ height: 28, width: 200, margin: '0 auto 1rem' }} />
      <div className="skeleton" style={{ height: 16, width: '60%', margin: '0 auto' }} />
    </div>
  );
}

export default function App() {
  return (
    <>
      <Navbar />
      <main style={{ minHeight: '65vh' }}>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/teacher" element={<TeacherProfile />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/admission" element={<Admission />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute role="family">
                  <FamilyDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute role="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Home />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </>
  );
}

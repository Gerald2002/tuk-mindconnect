import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Layout
import StudentLayout from './layouts/StudentLayout';

// Student Pages
import StudentDashboard from './pages/student/Dashboard';
import Screening from './pages/student/Screening';
import Chatbot from './pages/student/Chatbot';
import Forum from './pages/student/Forum';
import ReferralSummary from './pages/student/ReferralSummary';
import ScreeningHistory from './pages/student/ScreeningHistory';
import Profile from './pages/student/Profile'; // ✅ Imported Profile page

// Auth Pages
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import ResetPassword from './pages/auth/ResetPassword';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminLogin from './pages/admin/Login';
// import ManageReferrals from './pages/admin/ManageReferrals'; // Uncomment if created

// Utility
import NotFound from './components/NotFound';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ✅ Auth Routes (No Sidebar) */}
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* ✅ Student Routes (With Sidebar) */}
        <Route
          path="/dashboard"
          element={
            <StudentLayout>
              <StudentDashboard />
            </StudentLayout>
          }
        />
        <Route
          path="/screening"
          element={
            <StudentLayout>
              <Screening />
            </StudentLayout>
          }
        />
        <Route
          path="/chatbot"
          element={
            <StudentLayout>
              <Chatbot />
            </StudentLayout>
          }
        />
        <Route
          path="/forum"
          element={
            <StudentLayout>
              <Forum />
            </StudentLayout>
          }
        />
        <Route
          path="/referrals"
          element={
            <StudentLayout>
              <ReferralSummary />
            </StudentLayout>
          }
        />
        <Route
          path="/screening-history"
          element={
            <StudentLayout>
              <ScreeningHistory />
            </StudentLayout>
          }
        />
        <Route
          path="/profile"
          element={
            <StudentLayout>
              <Profile /> {/* ✅ Now rendering real Profile.jsx */}
            </StudentLayout>
          }
        />

        {/* ✅ Admin Routes */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        {/* <Route path="/admin/referrals" element={<ManageReferrals />} /> */}

        {/* ❌ Catch-all 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

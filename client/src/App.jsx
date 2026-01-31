import { Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar.jsx";
import Footer from "./components/Footer.jsx";
import LandingPage from "./pages/LandingPage.jsx";
import ExamsPage from "./pages/ExamsPage.jsx";
import PracticePage from "./pages/PracticePage.jsx";
import PracticeTestPage from "./pages/PracticeTestPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import SettingsPage from "./pages/SettingsPage.jsx";
import CheckoutPage from "./pages/CheckoutPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import SignupPage from "./pages/SignupPage.jsx";
import AdminPage from "./pages/AdminPage.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

const App = () => (
  <div className="flex min-h-screen flex-col">
    <NavBar />
    <main className="flex-1">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/exams" element={<ExamsPage />} />
        <Route
          path="/practice"
          element={
            // <ProtectedRoute>
              <PracticePage />
            // </ProtectedRoute>
          }
        />
        <Route
          path="/practice/:subjectId/topics/:topicId"
          element={
            // <ProtectedRoute>
              <PracticeTestPage />
            // </ProtectedRoute>
          }
        />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/register" element={<SignupPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </main>
    <Footer />
  </div>
);

export default App;

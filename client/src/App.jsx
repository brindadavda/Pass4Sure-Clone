import { Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar.jsx";
import Footer from "./components/Footer.jsx";
import LandingPage from "./pages/LandingPage.jsx";
import ExamsPage from "./pages/ExamsPage.jsx";
import PracticePage from "./pages/PracticePage.jsx";
import PracticeTopicPage from "./pages/PracticeTopicPage.jsx";
import PracticeTestPage from "./pages/PracticeTestPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import SettingsPage from "./pages/SettingsPage.jsx";
import CheckoutPage from "./pages/CheckoutPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import AdminPage from "./pages/AdminPage.jsx";


const App = () => (
  <div className="flex min-h-screen flex-col">
    <NavBar />
    <main className="flex-1">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/exams" element={<ExamsPage />} />
        <Route path="/practice" element={<PracticePage />} />
        <Route path="/practice/:subjectId" element={<PracticeTopicPage />} />
        <Route
          path="/practice/:subjectId/topics/:topicId"
          element={<PracticeTestPage />}
        />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </main>
    <Footer />
  </div>
);

export default App;

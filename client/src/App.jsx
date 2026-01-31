import { Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar.jsx";
import Footer from "./components/Footer.jsx";
import LandingPage from "./pages/LandingPage.jsx";
import ExamsPage from "./pages/ExamsPage.jsx";
import ExamTopicsPage from "./pages/ExamTopicsPage.jsx";
import PracticePage from "./pages/PracticePage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import SettingsPage from "./pages/SettingsPage.jsx";
import CheckoutPage from "./pages/CheckoutPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import AdminPage from "./pages/AdminPage.jsx";
import TopicDetailPage from "./pages/TopicDetailPage.jsx";
import DemoAccessPage from "./pages/DemoAccessPage.jsx";
import DemoExamPage from "./pages/DemoExamPage.jsx";


const App = () => (
  <div className="flex min-h-screen flex-col">
    <NavBar />
    <main className="flex-1">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/exams" element={<ExamsPage />} />
        <Route path="/exams/:examId" element={<ExamTopicsPage />} />
        <Route path="/topic/:topicId" element={<TopicDetailPage />} />
        <Route path="/topic/:topicId/demo-access" element={<DemoAccessPage />} />
        <Route path="/topic/:topicId/demo-exam" element={<DemoExamPage />} />
        <Route path="/practice" element={<PracticePage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/checkout/:topicId" element={<CheckoutPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </main>
    <Footer />
  </div>
);

export default App;

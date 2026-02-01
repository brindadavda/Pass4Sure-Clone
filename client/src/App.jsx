import { Navigate, Route, Routes } from "react-router-dom";
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
import AdminLayout from "./admin/AdminLayout.jsx";
import AdminProtectedRoute from "./admin/AdminProtectedRoute.jsx";
import AdminDashboard from "./admin/pages/AdminDashboard.jsx";
import AdminExams from "./admin/pages/AdminExams.jsx";
import AdminSubjects from "./admin/pages/AdminSubjects.jsx";
import AdminTopics from "./admin/pages/AdminTopics.jsx";
import AdminQuestions from "./admin/pages/AdminQuestions.jsx";
import AdminDemoCodes from "./admin/pages/AdminDemoCodes.jsx";
import AdminUsers from "./admin/pages/AdminUsers.jsx";
import AdminActivity from "./admin/pages/AdminActivity.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import ChatBotWidget from "./components/ChatBotWidget.jsx";
import ChatbotLogs from "./admin/pages/ChatbotLogs.jsx";
import BulkUpload from "./admin/pages/BulkUpload.jsx";

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
        <Route
          path="/admin/*"
          element={
            <AdminProtectedRoute>
              <AdminLayout />
            </AdminProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="exams" element={<AdminExams />} />
          <Route path="subjects" element={<AdminSubjects />} />
          <Route path="topics" element={<AdminTopics />} />
          <Route path="questions" element={<AdminQuestions />} />
          <Route path="demo-codes" element={<AdminDemoCodes />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="activity" element={<AdminActivity />} />
          <Route path="chatbot-logs" element={<ChatbotLogs />} />
          <Route path="bulk-upload" element={<BulkUpload />} />
        </Route>
      </Routes>
    </main>
    <Footer />
  </div>
);

export default App;

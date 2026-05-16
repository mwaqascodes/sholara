import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/lib/auth-context";
import { ThemeProvider } from "@/lib/theme-context";
import { I18nProvider } from "@/lib/i18n-context";
import { SchoolProvider } from "@/lib/school-context";
import ProtectedRoute from "@/components/ProtectedRoute";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import DashboardLayout from "./components/DashboardLayout";
import DashboardHome from "./pages/dashboard/DashboardHome";
import StudentsPage from "./pages/dashboard/StudentsPage";
import TeachersPage from "./pages/dashboard/TeachersPage";
import ClassesPage from "./pages/dashboard/ClassesPage";
import AttendancePage from "./pages/dashboard/AttendancePage";
import ResultsPage from "./pages/dashboard/ResultsPage";
import FeesPage from "./pages/dashboard/FeesPage";
import SchedulePage from "./pages/dashboard/SchedulePage";
import LeavePage from "./pages/dashboard/LeavePage";
import PayrollPage from "./pages/dashboard/PayrollPage";
import ExpensesPage from "./pages/dashboard/ExpensesPage";
import NotificationsPage from "./pages/dashboard/NotificationsPage";
import SettingsPage from "./pages/dashboard/SettingsPage";
import AnnouncementsPage from "./pages/dashboard/AnnouncementsPage";
import PromotionPage from "./pages/dashboard/PromotionPage";
import CertificatesPage from "./pages/dashboard/CertificatesPage";
import AnalyticsPage from "./pages/dashboard/AnalyticsPage";
import CalendarPage from "./pages/dashboard/CalendarPage";
import HomeworkPage from "./pages/dashboard/HomeworkPage";
import MeritPage from "./pages/dashboard/MeritPage";
import InventoryPage from "./pages/dashboard/InventoryPage";
import AdmissionsPage from "./pages/dashboard/AdmissionsPage";
import ResultCardPage from "./pages/dashboard/ResultCardPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const Protected = ({ children }: { children: React.ReactNode }) => (
  <ProtectedRoute>
    <DashboardLayout>{children}</DashboardLayout>
  </ProtectedRoute>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <I18nProvider>
        <AuthProvider>
          <SchoolProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/reset-password" element={<ResetPasswordPage />} />
                <Route path="/dashboard" element={<Protected><DashboardHome /></Protected>} />
                <Route path="/dashboard/students" element={<Protected><StudentsPage /></Protected>} />
                <Route path="/dashboard/teachers" element={<Protected><TeachersPage /></Protected>} />
                <Route path="/dashboard/classes" element={<Protected><ClassesPage /></Protected>} />
                <Route path="/dashboard/attendance" element={<Protected><AttendancePage /></Protected>} />
                <Route path="/dashboard/results" element={<Protected><ResultsPage /></Protected>} />
                <Route path="/dashboard/fees" element={<Protected><FeesPage /></Protected>} />
                <Route path="/dashboard/schedule" element={<Protected><SchedulePage /></Protected>} />
                <Route path="/dashboard/leave" element={<Protected><LeavePage /></Protected>} />
                <Route path="/dashboard/payroll" element={<Protected><PayrollPage /></Protected>} />
                <Route path="/dashboard/expenses" element={<Protected><ExpensesPage /></Protected>} />
                <Route path="/dashboard/notifications" element={<Protected><NotificationsPage /></Protected>} />
                <Route path="/dashboard/announcements" element={<Protected><AnnouncementsPage /></Protected>} />
                <Route path="/dashboard/promotion" element={<Protected><PromotionPage /></Protected>} />
                <Route path="/dashboard/certificates" element={<Protected><CertificatesPage /></Protected>} />
                <Route path="/dashboard/analytics" element={<Protected><AnalyticsPage /></Protected>} />
                <Route path="/dashboard/calendar" element={<Protected><CalendarPage /></Protected>} />
                <Route path="/dashboard/homework" element={<Protected><HomeworkPage /></Protected>} />
                <Route path="/dashboard/merit" element={<Protected><MeritPage /></Protected>} />
                <Route path="/dashboard/inventory" element={<Protected><InventoryPage /></Protected>} />
                <Route path="/dashboard/admissions" element={<Protected><AdmissionsPage /></Protected>} />
                <Route path="/dashboard/result-card" element={<Protected><ResultCardPage /></Protected>} />
                <Route path="/dashboard/settings" element={<Protected><SettingsPage /></Protected>} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
          </SchoolProvider>
        </AuthProvider>
      </I18nProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;

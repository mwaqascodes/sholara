import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate, useNavigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/lib/auth-context";
import { ThemeProvider } from "@/lib/theme-context";
import { I18nProvider } from "@/lib/i18n-context";
import { SchoolProvider } from "@/lib/school-context";
import ProtectedRoute from "./components/ProtectedRoute";

import LandingPage from "./pages/LandingPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import AuthCallback from "./pages/AuthCallback";

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
import NotificationsPage from "./pages/dashboard/NotificationsPage";
import SettingsPage from "./pages/dashboard/SettingsPage";
import ProfilePage from "./pages/dashboard/ProfilePage";
import AnnouncementsPage from "./pages/dashboard/AnnouncementsPage";
import PromotionPage from "./pages/dashboard/PromotionPage";
import CertificatesPage from "./pages/dashboard/CertificatesPage";
import AnalyticsPage from "./pages/dashboard/AnalyticsPage";
import CalendarPage from "./pages/dashboard/CalendarPage";
import HomeworkPage from "./pages/dashboard/HomeworkPage";
import MeritPage from "./pages/dashboard/MeritPage";
import InventoryPage from "./pages/dashboard/InventoryPage";
import AdmissionsPage from "./pages/dashboard/AdmissionsPage";
import SubjectsPage from "./pages/dashboard/SubjectsPage";
import ResultCardPage from "./pages/dashboard/ResultCardPage";
import ExamsPage from "./pages/dashboard/ExamsPage";
import FeeInvoicesPage from "./pages/dashboard/FeeInvoicesPage";
import MessagesPage from "./pages/dashboard/MessagesPage";
import NoticeBoardPage from "./pages/dashboard/NoticeBoardPage";
import ReportsPage from "./pages/dashboard/ReportsPage";
import LibraryPage from "./pages/dashboard/LibraryPage";
import TransportPage from "./pages/dashboard/TransportPage";
import ActivityPage from "./pages/dashboard/ActivityPage";
import SubscriptionPage from "./pages/SubscriptionPage";
import SubscriptionExpiredPage from "./pages/SubscriptionExpiredPage";
import SuperAdminLayout from "./components/SuperAdminLayout";
import SuperAdminDashboard from "./pages/super-admin/SuperAdminDashboard";
import { supabase } from "./lib/supabase";
import { useEffect } from "react";
import NotFound from "./pages/NotFound";

const AuthRedirectHandler = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        navigate('/dashboard');
      }
      if (event === 'SIGNED_OUT') {
        navigate('/login');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  return null;
};

const queryClient = new QueryClient();

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
                <AuthRedirectHandler />
                <Routes>
                  {/* Public routes */}
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/signup" element={<SignupPage />} />
                  <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                  <Route path="/reset-password" element={<ResetPasswordPage />} />
                  <Route path="/auth/callback" element={<AuthCallback />} />
                  <Route path="/subscription" element={<SubscriptionPage />} />
                  <Route path="/subscription-expired" element={<SubscriptionExpiredPage />} />

                  {/* Super Admin routes */}
                  <Route path="/super-admin" element={<ProtectedRoute><SuperAdminLayout /></ProtectedRoute>}>
                    <Route index element={<SuperAdminDashboard />} />
                    <Route path="schools" element={<SuperAdminDashboard />} />
                    <Route path="subscriptions" element={<SuperAdminDashboard />} />
                    <Route path="users" element={<SuperAdminDashboard />} />
                    <Route path="analytics" element={<SuperAdminDashboard />} />
                    <Route path="settings" element={<SuperAdminDashboard />} />
                  </Route>

                  {/* Protected routes */}
                  <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
                    <Route index element={<DashboardHome />} />
                    <Route path="students" element={<StudentsPage />} />
                    <Route path="teachers" element={<TeachersPage />} />
                    <Route path="classes" element={<ClassesPage />} />
                    <Route path="attendance" element={<AttendancePage />} />
                    <Route path="results" element={<ResultsPage />} />
                    <Route path="fees" element={<FeesPage />} />
                    <Route path="schedule" element={<SchedulePage />} />
                    <Route path="leave" element={<LeavePage />} />
                    <Route path="notifications" element={<NotificationsPage />} />
                    <Route path="announcements" element={<AnnouncementsPage />} />
                    <Route path="promotion" element={<PromotionPage />} />
                    <Route path="certificates" element={<CertificatesPage />} />
                    <Route path="analytics" element={<AnalyticsPage />} />
                    <Route path="calendar" element={<CalendarPage />} />
                    <Route path="homework" element={<HomeworkPage />} />
                    <Route path="merit" element={<MeritPage />} />
                    <Route path="inventory" element={<InventoryPage />} />
                     <Route path="admissions" element={<AdmissionsPage />} />
                    <Route path="subjects" element={<SubjectsPage />} />
                    <Route path="result-card" element={<ResultCardPage />} />
                    {/* Phase 2: Exams */}
                    <Route path="exams" element={<ExamsPage />} />
                    {/* Phase 3: Fee Management */}
                    <Route path="fee-invoices" element={<FeeInvoicesPage />} />
                    {/* Phase 4: Communication */}
                    <Route path="messages" element={<MessagesPage />} />
                    <Route path="notice-board" element={<NoticeBoardPage />} />
                    {/* Phase 5: Reports */}
                    <Route path="reports" element={<ReportsPage />} />
                    {/* SaaS expansion */}
                    <Route path="library" element={<LibraryPage />} />
                    <Route path="transport" element={<TransportPage />} />
                    <Route path="activity" element={<ActivityPage />} />
                    <Route path="settings" element={<SettingsPage />} />
                    <Route path="profile" element={<ProfilePage />} />
                  </Route>

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

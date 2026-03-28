import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/lib/auth-context";
import { ThemeProvider } from "@/lib/theme-context";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import DashboardLayout from "./components/DashboardLayout";
import DashboardHome from "./pages/dashboard/DashboardHome";
import StudentsPage from "./pages/dashboard/StudentsPage";
import TeachersPage from "./pages/dashboard/TeachersPage";
import ClassesPage from "./pages/dashboard/ClassesPage";
import AttendancePage from "./pages/dashboard/AttendancePage";
import ResultsPage from "./pages/dashboard/ResultsPage";
import FeesPage from "./pages/dashboard/FeesPage";
import SchedulePage from "./pages/dashboard/SchedulePage";
import PayrollPage from "./pages/dashboard/PayrollPage";
import ExpensesPage from "./pages/dashboard/ExpensesPage";
import NotificationsPage from "./pages/dashboard/NotificationsPage";
import SettingsPage from "./pages/dashboard/SettingsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const DashboardRoute = ({ children }: { children: React.ReactNode }) => (
  <DashboardLayout>{children}</DashboardLayout>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/dashboard" element={<DashboardRoute><DashboardHome /></DashboardRoute>} />
              <Route path="/dashboard/students" element={<DashboardRoute><StudentsPage /></DashboardRoute>} />
              <Route path="/dashboard/teachers" element={<DashboardRoute><TeachersPage /></DashboardRoute>} />
              <Route path="/dashboard/classes" element={<DashboardRoute><ClassesPage /></DashboardRoute>} />
              <Route path="/dashboard/attendance" element={<DashboardRoute><AttendancePage /></DashboardRoute>} />
              <Route path="/dashboard/results" element={<DashboardRoute><ResultsPage /></DashboardRoute>} />
              <Route path="/dashboard/fees" element={<DashboardRoute><FeesPage /></DashboardRoute>} />
              <Route path="/dashboard/schedule" element={<DashboardRoute><SchedulePage /></DashboardRoute>} />
              <Route path="/dashboard/payroll" element={<DashboardRoute><PayrollPage /></DashboardRoute>} />
              <Route path="/dashboard/expenses" element={<DashboardRoute><ExpensesPage /></DashboardRoute>} />
              <Route path="/dashboard/notifications" element={<DashboardRoute><NotificationsPage /></DashboardRoute>} />
              <Route path="/dashboard/settings" element={<DashboardRoute><SettingsPage /></DashboardRoute>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;

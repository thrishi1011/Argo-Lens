import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProfileProvider } from "@/contexts/ProfileContext";
import MainLayout from "@/components/layout/MainLayout";
import { SoundProvider } from "@/contexts/SoundContext";
import { FieldModeProvider } from "@/contexts/FieldModeContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import DashboardScreen from "./screens/DashboardScreen";
import MapScreen from "./screens/MapScreen";
import AlertsScreen from "./screens/AlertsScreen";
import SensorsScreen from "./screens/SensorsScreen";
import ProfileScreen from "./screens/ProfileScreen";
import ReportsScreen from "./screens/ReportsScreen";
import PredictionsScreen from "./screens/PredictionsScreen";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <SoundProvider>
        <FieldModeProvider>
          <AuthProvider>
            <ProfileProvider>
              <TooltipProvider>
                <Toaster />
                <Sonner />
                <HashRouter>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/auth" element={<Auth />} />
                    <Route path="/dashboard" element={<ProtectedRoute><MainLayout><DashboardScreen /></MainLayout></ProtectedRoute>} />
                    <Route path="/map" element={<ProtectedRoute><MainLayout><MapScreen /></MainLayout></ProtectedRoute>} />
                    <Route path="/alerts" element={<ProtectedRoute><MainLayout><AlertsScreen /></MainLayout></ProtectedRoute>} />
                    <Route path="/sensors" element={<ProtectedRoute><MainLayout><SensorsScreen /></MainLayout></ProtectedRoute>} />
                    <Route path="/predictions" element={<ProtectedRoute><MainLayout><PredictionsScreen /></MainLayout></ProtectedRoute>} />
                    <Route path="/reports" element={<ProtectedRoute><MainLayout><ReportsScreen /></MainLayout></ProtectedRoute>} />
                    <Route path="/profile" element={<ProtectedRoute><MainLayout><ProfileScreen /></MainLayout></ProtectedRoute>} />
                    <Route path="*" element={<ProtectedRoute><NotFound /></ProtectedRoute>} />
                  </Routes>
                </HashRouter>
              </TooltipProvider>
            </ProfileProvider>
          </AuthProvider>
        </FieldModeProvider>
      </SoundProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;

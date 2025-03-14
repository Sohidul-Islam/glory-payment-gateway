import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import Dashboard from "./pages/Dashboard";
import PaymentMethods from "./pages/PaymentMethods";
import MobileBanking from "./pages/MobileBanking";
import Transactions from "./pages/Transactions";
import UserManagement from "./pages/UserManagement";
import Notifications from "./pages/Notifications";
import { Login } from "./components/auth/Login";
import { Register } from "./components/auth/Register";
import { Suspense } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./context/AuthContext";
import { useAuth } from "./hooks/useAuth";

const queryClient = new QueryClient();

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return <>{children}</>;
};

// App Routes Component
const AppRoutes = () => {
  return (
    <Routes>
      {/* Auth Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="payment-methods" element={<PaymentMethods />} />
        <Route path="mobile-banking" element={<MobileBanking />} />
        <Route path="transactions" element={<Transactions />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="notifications" element={<Notifications />} />
      </Route>
    </Routes>
  );
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <Suspense
            fallback={
              <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
              </div>
            }
          >
            <AppRoutes />
          </Suspense>
          <ToastContainer position="top-right" autoClose={3000} />
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  );
}

export default App;

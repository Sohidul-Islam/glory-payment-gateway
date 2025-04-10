import {
  BrowserRouter as Router,
  Routes,
  Route,
  // Navigate,
  // useLocation,
} from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import Dashboard from "./pages/Dashboard";
import PaymentMethods from "./pages/PaymentMethods";
import MobileBanking from "./pages/MobileBanking";
import Transactions from "./pages/Transactions";
import UserManagement from "./pages/UserManagement";
import Notifications from "./pages/Notifications";
// import { Login } from "./components/auth/Login";
// import { Register } from "./components/auth/Register";
// import { ResetPassword } from "./components/auth/ResetPassword";
import { Suspense } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./context/AuthContext";
import { useAuth } from "./hooks/useAuth";
// import { ForgotPassword } from "./components/auth/ForgotPassword";

import { PaymentTypes } from "./pages/PaymentTypes";
import { PaymentDetails } from "./pages/PaymentDetails";
// import { Home } from "./pages/Home";

import { AgentPaymentMethods } from "./pages/AgentPaymentMethods";
import { Loader } from "./components/ui/Loader";
import { AgentHome } from "./pages/AgentHome";
import PaymentNotes from "./pages/PaymentNotes";
import AgentPaymentDetails from "./pages/AgentPaymentDetails";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

const queryClient = new QueryClient();

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoaded, isAuthenicating } = useAuth();
  // const location = useLocation();

  if (isAuthenicating) {
    return (
      <div className="flex items-center justify-center content-center h-screen">
        <Loader />
      </div>
    );
  }

  if (!isAuthenticated && isLoaded) {
    return <Home />;
    // return <Navigate to="/login" state={{ from: location.pathname }} replace />;
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
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

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
        <Route path="payment-types" element={<PaymentTypes />} />
        <Route path="payment-notes" element={<PaymentNotes />} />
        <Route
          path="payment-details/:paymentDetailsId"
          element={<PaymentDetails />}
        />
        <Route
          path="payment-details/:paymentType/:paymentTypeId"
          element={<PaymentDetails />}
        />
        <Route path="mobile-banking" element={<MobileBanking />} />
        <Route path="transactions" element={<Transactions />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="notifications" element={<Notifications />} />
      </Route>

      <Route path="/agent/:agentId" element={<AgentHome />} />
      <Route path="/payment/:agentId" element={<AgentPaymentMethods />} />
      <Route
        path="/payment/:agentId/method/:methodId"
        element={<AgentPaymentMethods />}
      />
      <Route
        path="/payment/:agentId/method/:methodId/type/:typeId"
        element={<AgentPaymentDetails />}
      />
      <Route
        path="/payment/:agentId/make-payment"
        element={<AgentPaymentDetails />}
      />
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

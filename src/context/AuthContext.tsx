import { createContext, useState, useEffect, ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AXIOS from "../network/Axios";
import { LoginResponse } from "../network/services";
import { useQuery } from "@tanstack/react-query";

interface AuthContextType {
  user: LoginResponse["user"] | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (userData: LoginResponse) => void;
  logout: () => void;
  refreshProfile: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<LoginResponse["user"] | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Profile fetch query
  const { refetch: refreshProfile } = useQuery({
    queryKey: ["profile", user?.email],
    queryFn: async () => {
      if (!user?.email) return null;
      const response = await AXIOS.get(`/profile?email=${user.email}`);
      if (response.data.user) setUser(response.data.user);
      return response.data;
    },
    enabled: !!user?.email, // Only run if we have an email
  });

  //   console.log({ userData });

  //   Initialize auth state from localStorage and handle redirects
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    const publicPaths = [
      "/login",
      "/register",
      "/forgot-password",
      "/reset-password",
    ];
    const isPublicPath = publicPaths.includes(location.pathname);

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));

      // If user is authenticated and trying to access login/register, redirect to dashboard
      if (isPublicPath) {
        navigate("/", { replace: true });
      }
    } else {
      // If no auth data and not on a public path, redirect to login
      if (!isPublicPath) {
        navigate("/login", {
          replace: true,
          state: { from: location?.pathname }, // Save the attempted URL
        });
      }
    }
  }, [navigate, location?.pathname]);

  const login = (userData: LoginResponse) => {
    setUser(userData.user);
    setToken(userData.token);

    // Store in localStorage
    localStorage.setItem("token", userData.token);
    localStorage.setItem("user", JSON.stringify(userData.user));

    // Set cookie
    document.cookie = `access_token=${userData.token}; path=/;`;

    // Redirect to the saved location or default to dashboard
    const savedPath = location.state?.from || "/";
    navigate(savedPath, { replace: true });
  };

  const logout = () => {
    setUser(null);
    setToken(null);

    // Clear localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Clear cookie
    document.cookie =
      "access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";

    // Redirect to login after logout
    navigate("/login", { replace: true });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        login,
        logout,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

import { createContext, useState, useEffect, ReactNode } from "react";
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

  // Profile fetch query
  const { refetch: refreshProfile } = useQuery({
    queryKey: ["profile", user?.email],
    queryFn: async () => {
      if (!user?.email) return null;
      const response = await AXIOS.get(`/profile?email=${user.email}`);
      setUser(response.data.user);
      return response.data;
    },
    enabled: !!user?.email, // Only run if we have an email
  });

  // Initialize auth state from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (userData: LoginResponse) => {
    setUser(userData.user);
    setToken(userData.token);

    // Store in localStorage
    localStorage.setItem("token", userData.token);
    localStorage.setItem("user", JSON.stringify(userData.user));

    // Set cookie
    document.cookie = `access_token=${userData.token}; path=/;`;
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

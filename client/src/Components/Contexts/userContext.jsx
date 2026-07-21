import axios from "axios";
import React, { createContext, useEffect, useState, useCallback } from "react";

export const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        if (window.location.pathname !== "/") {
          window.location.href = "/";
        }
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get("/api/v1/users/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.status === 200) {
          setUser(res.data.user);
        } else {
          localStorage.removeItem("token");
          if (window.location.pathname !== "/") {
            window.location.href = "/";
          }
        }
      } catch (error) {
        localStorage.removeItem("token");
        if (window.location.pathname !== "/") {
          window.location.href = "/";
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Re-fetch profile when user state changes (e.g., after login sets user)
  useEffect(() => {
    if (!user) return;
    // User was already set (e.g., from login response), no need to refetch
  }, [user]);

  // Prevent rendering children until auth check is complete
  if (loading) return null;

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

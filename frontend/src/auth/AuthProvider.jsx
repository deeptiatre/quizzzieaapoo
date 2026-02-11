import { useEffect, useState } from "react";
import AuthContext from "../auth/AuthContext";
import api from "../service/api";

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const res = await api.get("/profile/getprofile");
      const userData = res.data.user || res.data;
      setUser(userData);
      return userData
    } catch {
      setUser(null);
      localStorage.removeItem("token");
    } finally {
      setLoading(false);
    }
  };

  const login = async (data) => {
    setLoading(true);         // Start loading
    try {
      const res = await api.post("/auth/login", data);
      setUser(res.data.user); // Update user
      localStorage.setItem("token", res.data.token);
      return res.data.user;
    } finally {
      setLoading(false);      // Stop loading
    }
  };



  const register = async (data) => {
    const res = await api.post("/auth/register", data);
    const user = res.data.user;  // ← use backend returned user
    setUser(user);
    localStorage.setItem("token", res.data.token);
    return user;
  };


  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.error("Logout failed", error);
    }
    localStorage.removeItem("token");
    setUser(null);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        fetchUser, // 👈 Exposed as fetchUser matches usage
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

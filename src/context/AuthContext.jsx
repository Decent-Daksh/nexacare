import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

const mockUser = {
  id: "U-001",
  name: "Dr. Priya Sharma",
  role: "Admin",
  clinic: { name: "Sunrise Clinic", location: "Dehradun", tier: "Growth" },
  avatar: null,
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(mockUser);
  const [token, setToken] = useState("mock-token");

  const login = async () => {
    setUser(mockUser);
    setToken("mock-token");
  };
  const logout = () => {
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, clinicInfo: mockUser.clinic, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

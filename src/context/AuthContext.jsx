import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

const BASE_USER = {
  id: 'U-001',
  name: 'Dr. Priya Sharma',
  clinic: { name: 'Sunrise Clinic', location: 'Dehradun', tier: 'Growth' },
  avatar: null,
};

export function AuthProvider({ children }) {
  // Keep your role-switching logic from 'main'
  const [role, setRole] = useState(
    localStorage.getItem('nexacare_role') || 'admin'
  );
  
  // We'll keep the mock token for compatibility with your friend's version
  const [token, setToken] = useState("mock-token");

  // Construct the user object dynamically
  const user = { ...BASE_USER, role };

  const switchRole = (newRole) => {
    localStorage.setItem('nexacare_role', newRole);
    setRole(newRole);
  };

  const login = async () => {
    setToken("mock-token");
  };

  const logout = () => {
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      role, 
      token, 
      clinicInfo: BASE_USER.clinic, 
      switchRole, 
      login, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
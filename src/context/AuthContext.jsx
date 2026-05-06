import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

const BASE_USER = {
  id: 'U-001',
  name: 'Dr. Priya Sharma',
  clinic: { name: 'Sunrise Clinic', location: 'Dehradun', tier: 'Growth' },
  avatar: null,
};

export function AuthProvider({ children }) {
  const [role, setRole] = useState(
    localStorage.getItem('nexacare_role') || 'admin'
  );

  const user = { ...BASE_USER, role };

  const switchRole = (newRole) => {
    localStorage.setItem('nexacare_role', newRole);
    setRole(newRole);
  };

  return (
    <AuthContext.Provider value={{ user, role, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
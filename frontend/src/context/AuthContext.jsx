import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(() => JSON.parse(localStorage.getItem('authSession') || 'null'));

  useEffect(() => {
    if (session) localStorage.setItem('authSession', JSON.stringify(session));
    else localStorage.removeItem('authSession');
  }, [session]);

  const login = (user, role) => setSession({ user, role });
  const logout = () => { localStorage.removeItem('authToken'); setSession(null); };
  return <AuthContext.Provider value={{ session, user: session?.user, role: session?.role, login, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
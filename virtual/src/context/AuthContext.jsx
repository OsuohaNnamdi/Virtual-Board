import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { authApi } from '../api/authApi';
import { accessApi } from '../api/accessApi';
import { clearSession } from '../api/client';

const AuthContext = createContext(null);

function readStoredProfile() {
  try {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function persistSession({ accessToken, refreshToken, user }) {
  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
  localStorage.setItem('user', JSON.stringify(user));
}

// WRITE implies READ, mirroring AccessLevel.satisfies() on the backend.
function levelSatisfies(grantedLevel, requiredLevel) {
  if (grantedLevel === 'WRITE') return true;
  return grantedLevel === requiredLevel;
}

export function AuthProvider({ children }) {
  const [profile, setProfile] = useState(readStoredProfile);
  const [grants, setGrants] = useState([]);
  const [grantsLoaded, setGrantsLoaded] = useState(false);

  const isAdmin = profile?.role === 'ADMIN';

  const refreshGrants = useCallback(async () => {
    if (!profile) {
      setGrants([]);
      setGrantsLoaded(true);
      return;
    }
    try {
      const data = await accessApi.myGrants();
      setGrants(data);
    } finally {
      setGrantsLoaded(true);
    }
  }, [profile]);

  useEffect(() => {
    refreshGrants();
  }, [refreshGrants]);

  const hasAccess = useCallback(
    (service, level = 'READ') => {
      if (isAdmin) return true;
      return grants.some((g) => g.service === service && levelSatisfies(g.level, level));
    },
    [isAdmin, grants]
  );

  const login = useCallback(async (email, password) => {
    const data = await authApi.login(email, password);
    persistSession(data);
    setProfile(data.user);
    return data.user;
  }, []);

  const register = useCallback(async (payload) => {
    const data = await authApi.register(payload);
    persistSession(data);
    setProfile(data.user);
    return data.user;
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setProfile(null);
    setGrants([]);
  }, []);

  const value = useMemo(
    () => ({
      profile,
      isAuthenticated: !!profile,
      isAdmin,
      grants,
      grantsLoaded,
      hasAccess,
      refreshGrants,
      login,
      register,
      logout,
    }),
    [profile, isAdmin, grants, grantsLoaded, hasAccess, refreshGrants, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

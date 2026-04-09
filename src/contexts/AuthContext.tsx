import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { tenantService } from '../services/tenantService';

interface AuthContextType {
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  tenantId: string | null;
  userId: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signup: (email: string, password: string, tenantName: string, tenantSlug: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [tenantId, setTenantId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session?.user) {
          setIsAuthenticated(true);
          setUserId(session.user.id);
          const userTenantId = session.user.user_metadata?.tenant_id;
          setTenantId(userTenantId || null);
        }
      } catch (err) {
        console.error('Auth check error:', err);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setIsAuthenticated(true);
        setUserId(session.user.id);
        const userTenantId = session.user.user_metadata?.tenant_id;
        setTenantId(userTenantId || null);
      } else {
        setIsAuthenticated(false);
        setUserId(null);
        setTenantId(null);
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

const login = async (email: string, password: string) => {
  setError(null);
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    // DEBUG: valores do user_metadata
    console.log('user_metadata.tenant_id:', data.user?.user_metadata?.tenant_id);

    // DEBUG: valores do JWT (claims reais)
    const { data: sessionData } = await supabase.auth.getSession();
    const jwt = sessionData.session?.access_token;

    if (jwt) {
      const payload = JSON.parse(atob(jwt.split('.')[1]));
      console.log('jwt payload.tenant_id:', payload?.tenant_id);
      console.log('jwt payload.user_metadata.tenant_id:', payload?.user_metadata?.tenant_id);
      console.log('jwt payload:', payload);
    } else {
      console.log('Sem access_token no session após login.');
    }

    setIsAuthenticated(true);
    setUserId(data.user.id);

    const userTenantId = data.user.user_metadata?.tenant_id;
    setTenantId(userTenantId || null);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro ao fazer login';
    setError(message);
    throw err;
  }
};

  const signup = async (email: string, password: string, tenantName: string, tenantSlug: string) => {
    setError(null);
    try {
      const tenant = await tenantService.createTenant(tenantName, tenantSlug);

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            tenant_id: tenant.id,
          },
        },
      });

      if (error) throw error;

      if (data.user) {
        setIsAuthenticated(true);
        setUserId(data.user.id);
        setTenantId(tenant.id);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao criar conta';
      setError(message);
      throw err;
    }
  };

  const logout = async () => {
    setError(null);
    try {
      await supabase.auth.signOut();
      setIsAuthenticated(false);
      setUserId(null);
      setTenantId(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao fazer logout';
      setError(message);
      throw err;
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, loading, error, tenantId, userId, login, logout, signup }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

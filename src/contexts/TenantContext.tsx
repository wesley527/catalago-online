import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { getTenantsByOwner } from '../services/tenantService';
import type { Tenant } from '../lib/types';

interface TenantContextType {
  tenant: Tenant | null;
  tenants: Tenant[];
  loading: boolean;
  selectTenant: (tenant: Tenant) => void;
  refreshTenants: () => Promise<void>;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export function TenantProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) {
      setTenant(null);
      setTenants([]);
      setLoading(false);
      return;
    }

    const loadTenants = async () => {
      try {
        setLoading(true);
        const data = await getTenantsByOwner(user.id);
        setTenants(data);
        if (data.length > 0) {
          setTenant(data[0]);
        }
      } catch (error) {
        console.error('Erro ao carregar lojas:', error);
        setTenants([]);
        setTenant(null);
      } finally {
        setLoading(false);
      }
    };

    loadTenants();
  }, [user?.id]);

  const selectTenant = (selectedTenant: Tenant) => {
    setTenant(selectedTenant);
  };

  const refreshTenants = async () => {
    if (!user?.id) return;
    try {
      const data = await getTenantsByOwner(user.id);
      setTenants(data);
      if (data.length > 0 && !tenant) {
        setTenant(data[0]);
      }
    } catch (error) {
      console.error('Erro ao atualizar lojas:', error);
    }
  };

  return (
    <TenantContext.Provider value={{ tenant, tenants, loading, selectTenant, refreshTenants }}>
      {children}
    </TenantContext.Provider>
  );
}

export function useTenant() {
  const context = useContext(TenantContext);
  if (!context) {
    throw new Error('useTenant deve ser usado dentro de TenantProvider');
  }
  return context;
}

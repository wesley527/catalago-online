import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Tenant } from '../lib/types';

interface TenantContextType {
  tenant: Tenant | null;
  tenants: Tenant[];
  setTenant: (tenant: Tenant) => void;
  loading: boolean;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export function TenantProvider({ children }: { children: React.ReactNode }) {
  const [tenant, setTenantState] = useState<Tenant | null>(null);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadDefaultTenant = async () => {
      try {
        setLoading(true);
        const defaultTenant: Tenant = {
          id: '1',
          name: 'Default Store',
          slug: 'default',
          logo_url: '',
          color: '#FF6B35',
          theme: 'light',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        setTenantState(defaultTenant);
        setTenants([defaultTenant]);
      } catch (error) {
        console.error('Error loading tenant:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDefaultTenant();
  }, []);

  const handleSetTenant = (newTenant: Tenant) => {
    setTenantState(newTenant);
    localStorage.setItem('selectedTenant', JSON.stringify(newTenant));
  };

  return (
    <TenantContext.Provider value={{ tenant, tenants, setTenant: handleSetTenant, loading }}>
      {children}
    </TenantContext.Provider>
  );
}

export function useTenant() {
  const context = useContext(TenantContext);
  if (context === undefined) {
    throw new Error('useTenant must be used within TenantProvider');
  }
  return context;
}

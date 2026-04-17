import React, { createContext, useContext, useEffect, useState } from 'react';
import type { Tenant } from '../lib/types';
import { tenantService } from '../services/tenantService';
import { useAuth } from './AuthContext';

interface TenantContextType {
  tenant: Tenant | null;
  tenants: Tenant[];
  setTenant: (tenant: Tenant) => void;
  loading: boolean;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export const TenantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { tenantId } = useAuth();
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchTenant = async () => {
    if (!tenantId) {
      setTenant(null);
      return;
    }

<<<<<<< HEAD
    setLoading(true);
=======
    const defaultSlug = import.meta.env.VITE_DEFAULT_TENANT_SLUG as string | undefined;
    if (defaultSlug?.trim()) {
      try {
        const tenantData = await tenantService.getTenantBySlug(defaultSlug.trim());
        return tenantData?.id || null;
      } catch (err) {
        console.error('Error fetching tenant by VITE_DEFAULT_TENANT_SLUG:', err);
        return null;
      }
    }

    return null;
  };
>>>>>>> adf068e03d9f7e7f77d8837055e3a6a822dc94c6

    try {
      const tenantData = await tenantService.getTenantById(tenantId);
      setTenant(tenantData);
    } catch (err) {
      console.error('[TenantContext] Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchTenant();
  }, [tenantId]);

  useEffect(() => {
    // Load default tenant if needed
    const loadDefaultTenant = async () => {
      try {
        setLoading(true);
        // This will be implemented with actual API calls
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
        setTenant(defaultTenant);
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
    setTenant(newTenant);
    localStorage.setItem('selectedTenant', JSON.stringify(newTenant));
  };

  return (
    <TenantContext.Provider value={{ tenant, tenants, setTenant: handleSetTenant, loading }}>
      {children}
    </TenantContext.Provider>
  );
};

export const useTenant = () => {
  const context = useContext(TenantContext);
  if (context === undefined) {
    throw new Error('useTenant must be used within TenantProvider');
  }
  return context;
};

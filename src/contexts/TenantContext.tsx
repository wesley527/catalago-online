import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Tenant, TenantSettings } from '../lib/types';
import { tenantService } from '../services/tenantService';
import { useAuth } from './AuthContext';

interface TenantContextType {
  tenant: Tenant | null;
  tenantSettings: TenantSettings | null;
  loading: boolean;
  error: string | null;
  refreshTenant: () => Promise<void>;
  refreshSettings: () => Promise<void>;
  updateSettings: (settings: Partial<TenantSettings>) => Promise<void>;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export const TenantProvider = ({ children }: { children: ReactNode }) => {
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [tenantSettings, setTenantSettings] = useState<TenantSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { tenantId } = useAuth();

  const getTenantFromHostname = async (): Promise<string | null> => {
    const hostname = window.location.hostname;
    const parts = hostname.split('.');

    if (parts.length >= 3 && parts[0] !== 'www') {
      const subdomain = parts[0];
      try {
        const tenantData = await tenantService.getTenantBySlug(subdomain);
        return tenantData?.id || null;
      } catch (err) {
        console.error('Error fetching tenant by subdomain:', err);
        return null;
      }
    }

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

  const loadTenant = async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      const tenantData = await tenantService.getTenantById(id);
      if (!tenantData) {
        throw new Error('Tenant not found');
      }

      setTenant(tenantData);

      const settings = await tenantService.getTenantSettings(id);
      setTenantSettings(settings);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error loading tenant';
      setError(message);
      console.error('Error loading tenant:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initTenant = async () => {
      const subdomainTenantId = await getTenantFromHostname();

      if (subdomainTenantId) {
        await loadTenant(subdomainTenantId);
      } else if (tenantId) {
        await loadTenant(tenantId);
      } else {
        setLoading(false);
      }
    };

    initTenant();
  }, [tenantId]);

  const refreshTenant = async () => {
    if (tenant?.id) {
      await loadTenant(tenant.id);
    }
  };

  const refreshSettings = async () => {
    if (tenant?.id) {
      try {
        const settings = await tenantService.getTenantSettings(tenant.id);
        setTenantSettings(settings);
      } catch (err) {
        console.error('Error refreshing settings:', err);
      }
    }
  };

  const updateSettings = async (settings: Partial<TenantSettings>) => {
    if (!tenant?.id) {
      throw new Error('No tenant loaded');
    }

    try {
      const updated = await tenantService.updateTenantSettings(tenant.id, settings);
      setTenantSettings(updated);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error updating settings';
      throw new Error(message);
    }
  };

  return (
    <TenantContext.Provider
      value={{
        tenant,
        tenantSettings,
        loading,
        error,
        refreshTenant,
        refreshSettings,
        updateSettings,
      }}
    >
      {children}
    </TenantContext.Provider>
  );
};

export const useTenant = () => {
  const context = useContext(TenantContext);
  if (!context) {
    throw new Error('useTenant must be used within TenantProvider');
  }
  return context;
};

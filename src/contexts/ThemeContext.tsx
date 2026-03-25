import { createContext, useContext, useEffect, ReactNode } from 'react';
import { useTenant } from './TenantContext';

interface ThemeContextType {
  primaryColor: string;
  secondaryColor: string;
  logoUrl: string | null;
  bannerUrl: string | null;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const { tenantSettings } = useTenant();

  const primaryColor = tenantSettings?.primary_color || '#2563eb';
  const secondaryColor = tenantSettings?.secondary_color || '#10b981';
  const logoUrl = tenantSettings?.logo_url || null;
  const bannerUrl = tenantSettings?.banner_url || null;

  useEffect(() => {
    document.documentElement.style.setProperty('--color-primary', primaryColor);
    document.documentElement.style.setProperty('--color-secondary', secondaryColor);
  }, [primaryColor, secondaryColor]);

  return (
    <ThemeContext.Provider
      value={{
        primaryColor,
        secondaryColor,
        logoUrl,
        bannerUrl,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

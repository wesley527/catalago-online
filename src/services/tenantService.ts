import { supabase } from '../lib/supabase';
import { ensureAuthSessionForWrite } from '../lib/supabaseAuth';
import type { Tenant } from '../lib/types';

export const tenantService = {
  async getTenants(): Promise<Tenant[]> {
    try {
      const { data, error } = await supabase
        .from('tenants')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching tenants:', error);
      return [];
    }
  },

  async getTenantById(id: string): Promise<Tenant | null> {
    try {
      const { data, error } = await supabase
        .from('tenants')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching tenant:', error);
      return null;
    }
  },

  async getTenantBySlug(slug: string): Promise<Tenant | null> {
    try {
      const { data, error } = await supabase
        .from('tenants')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching tenant by slug:', error);
      return null;
    }
  },

  async createTenant(
    name: string,
    slug: string,
    plan: 'free' | 'pro' | 'enterprise' = 'free'
  ): Promise<Tenant> {
    await ensureAuthSessionForWrite();

    const { data, error } = await supabase
      .from('tenants')
      .insert([{ name, slug, plan }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateTenant(
    id: string,
    updates: Partial<Tenant>
  ): Promise<Tenant> {
    await ensureAuthSessionForWrite();

    const { data, error } = await supabase
      .from('tenants')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteTenant(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('tenants')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      throw new Error(`Error deleting tenant: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },

  async checkPlanLimits(tenantId: string): Promise<{
    plan: string;
    productLimit: number;
    currentProducts: number;
    canAddProducts: boolean;
  }> {
    try {
      const tenant = await this.getTenantById(tenantId);
      if (!tenant) throw new Error('Tenant not found');

      const { count } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('tenant_id', tenantId);

      const limits: Record<string, number> = {
        free: 10,
        pro: 100,
        enterprise: 10000,
      };

      const productLimit = limits[tenant.plan] || 10;
      const currentProducts = count || 0;

      return {
        plan: tenant.plan,
        productLimit,
        currentProducts,
        canAddProducts: currentProducts < productLimit,
      };
    } catch (error) {
      console.error('[tenantService] checkPlanLimits error:', error);
      return {
        plan: 'free',
        productLimit: 10,
        currentProducts: 0,
        canAddProducts: true,
      };
    }
  },
};

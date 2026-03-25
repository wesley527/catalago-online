import { supabase } from '../lib/supabase';
import { Tenant, TenantSettings } from '../lib/types';

export const tenantService = {
  async getTenantBySlug(slug: string): Promise<Tenant | null> {
    const { data, error } = await supabase
      .from('tenants')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async getTenantById(id: string): Promise<Tenant | null> {
    const { data, error } = await supabase
      .from('tenants')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async createTenant(name: string, slug: string, plan: string = 'free'): Promise<Tenant> {
    const { data, error } = await supabase
      .from('tenants')
      .insert([{ name, slug, plan }])
      .select()
      .single();

    if (error) throw error;

    await this.createDefaultSettings(data.id);

    return data;
  },

  async createDefaultSettings(tenantId: string): Promise<TenantSettings> {
    const { data, error } = await supabase
      .from('tenant_settings')
      .insert([
        {
          tenant_id: tenantId,
          primary_color: '#2563eb',
          secondary_color: '#10b981',
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getTenantSettings(tenantId: string): Promise<TenantSettings | null> {
    const { data, error } = await supabase
      .from('tenant_settings')
      .select('*')
      .eq('tenant_id', tenantId)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async updateTenantSettings(
    tenantId: string,
    settings: Partial<TenantSettings>
  ): Promise<TenantSettings> {
    const { data, error } = await supabase
      .from('tenant_settings')
      .update({ ...settings, updated_at: new Date().toISOString() })
      .eq('tenant_id', tenantId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async checkPlanLimits(tenantId: string): Promise<{
    plan: string;
    productLimit: number;
    currentProducts: number;
    canAddProducts: boolean;
  }> {
    const tenant = await this.getTenantById(tenantId);
    if (!tenant) throw new Error('Tenant not found');

    const { count } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('tenant_id', tenantId);

    const planLimits: Record<string, number> = {
      free: 10,
      basic: 50,
      premium: 999999,
    };

    const productLimit = planLimits[tenant.plan] || 10;
    const currentProducts = count || 0;

    return {
      plan: tenant.plan,
      productLimit,
      currentProducts,
      canAddProducts: currentProducts < productLimit,
    };
  },
};

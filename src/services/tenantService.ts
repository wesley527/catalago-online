import { supabase } from '../lib/supabase';
import type { Tenant } from '../lib/types';

export async function getTenant(id: string): Promise<Tenant> {
  const { data, error } = await supabase
    .from('tenants')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

export async function getTenantBySlug(slug: string): Promise<Tenant> {
  const { data, error } = await supabase
    .from('tenants')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single();

  if (error) throw error;
  return data;
}

export async function getTenantsByOwner(ownerId: string): Promise<Tenant[]> {
  const { data, error } = await supabase
    .from('tenants')
    .select('*')
    .eq('owner_id', ownerId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function createTenant(tenant: Omit<Tenant, 'id' | 'created_at' | 'updated_at'>): Promise<Tenant> {
  const { data, error } = await supabase
    .from('tenants')
    .insert([tenant])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateTenant(id: string, updates: Partial<Tenant>): Promise<Tenant> {
  const { data, error } = await supabase
    .from('tenants')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteTenant(id: string): Promise<void> {
  const { error } = await supabase.from('tenants').delete().eq('id', id);
  if (error) throw error;
}

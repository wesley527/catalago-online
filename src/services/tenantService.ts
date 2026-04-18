import { supabase } from '../lib/supabase';
import type { Tenant } from '../lib/types';

export async function getTenants(): Promise<Tenant[]> {
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
}

export async function getTenantById(id: string): Promise<Tenant | null> {
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
}

export async function getTenantBySlug(slug: string): Promise<Tenant | null> {
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
}

export async function createTenant(tenant: Omit<Tenant, 'id' | 'created_at' | 'updated_at'>): Promise<Tenant> {
  try {
    const { data, error } = await supabase
      .from('tenants')
      .insert([tenant])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    throw new Error(`Error creating tenant: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function updateTenant(id: string, updates: Partial<Tenant>): Promise<Tenant> {
  try {
    const { data, error } = await supabase
      .from('tenants')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    throw new Error(`Error updating tenant: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function deleteTenant(id: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('tenants')
      .delete()
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    throw new Error(`Error deleting tenant: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

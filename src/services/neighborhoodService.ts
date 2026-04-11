import { supabase } from '../lib/supabase';
import { Neighborhood } from '../lib/types';

export const neighborhoodService = {
  async getAllByTenant(tenantId: string): Promise<Neighborhood[]> {
    const { data, error } = await supabase
      .from('neighborhoods')
      .select('*')
      .eq('tenant_id', tenantId)
      .order('name', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  async createNeighborhood(
    name: string,
    price: number,
    tenantId: string
  ): Promise<Neighborhood> {
    const { data, error } = await supabase
      .from('neighborhoods')
      .insert([{ name: name.trim(), price, tenant_id: tenantId }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateNeighborhood(id: string, name: string, price: number): Promise<Neighborhood> {
    const { data, error } = await supabase
      .from('neighborhoods')
      .update({ name: name.trim(), price, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteNeighborhood(id: string): Promise<void> {
    const { error } = await supabase.from('neighborhoods').delete().eq('id', id);

    if (error) throw error;
  },
};

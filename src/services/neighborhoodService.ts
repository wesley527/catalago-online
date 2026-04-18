import { supabase } from '../lib/supabase';
import type { Neighborhood } from '../lib/types';

export async function getNeighborhoods(tenantId: string): Promise<Neighborhood[]> {
  try {
    const { data, error } = await supabase
      .from('neighborhoods')
      .select('*')
      .eq('tenant_id', tenantId)
      .eq('active', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching neighborhoods:', error);
    return [];
  }
}

export async function getNeighborhoodById(id: string): Promise<Neighborhood | null> {
  try {
    const { data, error } = await supabase
      .from('neighborhoods')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching neighborhood:', error);
    return null;
  }
}

export async function createNeighborhood(neighborhood: Omit<Neighborhood, 'id' | 'created_at' | 'updated_at'>): Promise<Neighborhood> {
  try {
    const { data, error } = await supabase
      .from('neighborhoods')
      .insert([neighborhood])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    throw new Error(`Error creating neighborhood: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function updateNeighborhood(id: string, updates: Partial<Neighborhood>): Promise<Neighborhood> {
  try {
    const { data, error } = await supabase
      .from('neighborhoods')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    throw new Error(`Error updating neighborhood: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function deleteNeighborhood(id: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('neighborhoods')
      .delete()
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    throw new Error(`Error deleting neighborhood: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

import { supabase } from '../lib/supabase';
import type { DeliveryArea } from '../lib/types';

export async function getDeliveryAreas(tenantId: string): Promise<DeliveryArea[]> {
  try {
    const { data, error } = await supabase
      .from('delivery_areas')
      .select('*')
      .eq('tenant_id', tenantId)
      .eq('active', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching delivery areas:', error);
    return [];
  }
}

export async function getDeliveryAreaById(id: string): Promise<DeliveryArea | null> {
  try {
    const { data, error } = await supabase
      .from('delivery_areas')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching delivery area:', error);
    return null;
  }
}

export async function createDeliveryArea(area: Omit<DeliveryArea, 'id' | 'created_at' | 'updated_at'>): Promise<DeliveryArea> {
  try {
    const { data, error } = await supabase
      .from('delivery_areas')
      .insert([area])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    throw new Error(`Error creating delivery area: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function updateDeliveryArea(id: string, updates: Partial<DeliveryArea>): Promise<DeliveryArea> {
  try {
    const { data, error } = await supabase
      .from('delivery_areas')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    throw new Error(`Error updating delivery area: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function deleteDeliveryArea(id: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('delivery_areas')
      .delete()
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    throw new Error(`Error deleting delivery area: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}


import { supabase } from '../lib/supabase';
import type { Product } from '../lib/types';

export async function getProducts(tenantId: string): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('tenant_id', tenantId)
      .eq('active', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

export async function getProductById(id: string): Promise<Product | null> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

export async function createProduct(product: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<Product> {
  try {
    const { data, error } = await supabase
      .from('products')
      .insert([product])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    throw new Error(`Error creating product: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
  try {
    const { data, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    throw new Error(`Error updating product: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function deleteProduct(id: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    throw new Error(`Error deleting product: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

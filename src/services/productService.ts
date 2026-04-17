import { supabase } from '../lib/supabase';
<<<<<<< HEAD
import type { Product } from '../lib/types';
=======
import { ensureAuthSessionForWrite } from '../lib/supabaseAuth';
import { Product } from '../lib/types';
>>>>>>> adf068e03d9f7e7f77d8837055e3a6a822dc94c6

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

<<<<<<< HEAD
export async function createProduct(product: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<Product> {
  try {
=======
  async createProduct(product: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<Product> {
    await ensureAuthSessionForWrite();
>>>>>>> adf068e03d9f7e7f77d8837055e3a6a822dc94c6
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

<<<<<<< HEAD
export async function updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
  try {
    const { data, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
=======
  return data;
},

  async deleteProduct(id: string, tenantId?: string): Promise<void> {
    await ensureAuthSessionForWrite();
    let query = supabase.from('products').delete().eq('id', id);

    if (tenantId) {
      query = query.eq('tenant_id', tenantId);
    }

    const { error } = await query;
>>>>>>> adf068e03d9f7e7f77d8837055e3a6a822dc94c6

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

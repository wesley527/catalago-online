import { supabase } from '../lib/supabase';
import { Product } from '../lib/types';

export const productService = {
  async getAllProducts(tenantId?: string): Promise<Product[]> {
    let query = supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (tenantId) {
      query = query.eq('tenant_id', tenantId);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  },

  async getProductsByCategory(tenantId: string, categoryId: string): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('tenant_id', tenantId)
      .eq('category_id', categoryId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getProductById(id: string, tenantId?: string): Promise<Product | null> {
    let query = supabase
      .from('products')
      .select('*')
      .eq('id', id);

    if (tenantId) {
      query = query.eq('tenant_id', tenantId);
    }

    const { data, error } = await query.maybeSingle();

    if (error) throw error;
    return data;
  },

  async createProduct(product: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<Product> {
    const { data, error } = await supabase
      .from('products')
      .insert([product])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

 async updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
  const { data, error } = await supabase
    .from('products')
    .update(updates)
    .eq('id', id)
    .select()
    .maybeSingle();

  if (error) {
    console.error('UPDATE PRODUCT ERROR:', error);
    throw error;
  }

  if (!data) {
    throw new Error('Product not found or access denied');
  }

  return data;
},

  async deleteProduct(id: string, tenantId?: string): Promise<void> {
    let query = supabase.from('products').delete().eq('id', id);

    if (tenantId) {
      query = query.eq('tenant_id', tenantId);
    }

    const { error } = await query;

    if (error) throw error;
  },

  async updateStock(id: string, quantity: number, tenantId?: string): Promise<void> {
    let query = supabase
      .from('products')
      .update({ stock_quantity: quantity })
      .eq('id', id);

    if (tenantId) {
      query = query.eq('tenant_id', tenantId);
    }

    const { error } = await query;

    if (error) throw error;
  },
};

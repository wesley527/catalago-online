import { supabase } from '../lib/supabase';
import { ensureAuthSessionForWrite } from '../lib/supabaseAuth';
import { Category } from '../lib/types';

export const categoryService = {
  async getAllCategories(tenantId: string): Promise<Category[]> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('tenant_id', tenantId)
      .order('name', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  async getCategoryById(id: string): Promise<Category | null> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async createCategory(name: string, tenantId: string): Promise<Category> {
    await ensureAuthSessionForWrite();
    const { data, error } = await supabase
      .from('categories')
      .insert([{ name, tenant_id: tenantId }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateCategory(id: string, name: string): Promise<Category> {
    await ensureAuthSessionForWrite();
    const { data, error } = await supabase
      .from('categories')
      .update({ name })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteCategory(id: string): Promise<void> {
    await ensureAuthSessionForWrite();
    const { error } = await supabase.from('categories').delete().eq('id', id);

    if (error) throw error;
  },

  async getProductCountByCategory(categoryId: string): Promise<number> {
    const { count } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('category_id', categoryId);

    return count || 0;
  },
};

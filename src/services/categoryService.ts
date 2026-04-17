import { supabase } from '../lib/supabase';
<<<<<<< HEAD
import type { Category } from '../lib/types';
=======
import { ensureAuthSessionForWrite } from '../lib/supabaseAuth';
import { Category } from '../lib/types';
>>>>>>> adf068e03d9f7e7f77d8837055e3a6a822dc94c6

export async function getCategories(tenantId: string): Promise<Category[]> {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('tenant_id', tenantId)
      .eq('active', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

export async function getCategoryById(id: string): Promise<Category | null> {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching category:', error);
    return null;
  }
}

<<<<<<< HEAD
export async function createCategory(category: Omit<Category, 'id' | 'created_at' | 'updated_at'>): Promise<Category> {
  try {
=======
  async createCategory(name: string, tenantId: string): Promise<Category> {
    await ensureAuthSessionForWrite();
>>>>>>> adf068e03d9f7e7f77d8837055e3a6a822dc94c6
    const { data, error } = await supabase
      .from('categories')
      .insert([category])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    throw new Error(`Error creating category: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

<<<<<<< HEAD
export async function updateCategory(id: string, updates: Partial<Category>): Promise<Category> {
  try {
=======
  async updateCategory(id: string, name: string): Promise<Category> {
    await ensureAuthSessionForWrite();
>>>>>>> adf068e03d9f7e7f77d8837055e3a6a822dc94c6
    const { data, error } = await supabase
      .from('categories')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    throw new Error(`Error updating category: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

<<<<<<< HEAD
export async function deleteCategory(id: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);
=======
  async deleteCategory(id: string): Promise<void> {
    await ensureAuthSessionForWrite();
    const { error } = await supabase.from('categories').delete().eq('id', id);
>>>>>>> adf068e03d9f7e7f77d8837055e3a6a822dc94c6

    if (error) throw error;
  } catch (error) {
    throw new Error(`Error deleting category: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

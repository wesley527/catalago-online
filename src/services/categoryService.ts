import { supabase } from '../lib/supabase';
import type { Category } from '../lib/types';

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

export async function createCategory(category: Omit<Category, 'id' | 'created_at' | 'updated_at'>): Promise<Category> {
  try {
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

export async function updateCategory(id: string, updates: Partial<Category>): Promise<Category> {
  try {
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

export async function deleteCategory(id: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    throw new Error(`Error deleting category: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

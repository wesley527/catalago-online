import { supabase } from './supabase';
import type { User } from './types';

export async function signInWithEmail(email: string, password: string): Promise<User> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    if (!data.user) throw new Error('Usuário não encontrado');

    const user: User = {
      id: data.user.id,
      email: data.user.email || '',
      role: 'user' as const,
      tenant_id: null,
    };

    return user;
  } catch (error) {
    throw new Error(`Erro ao fazer login: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
  }
}

export async function signOutUser(): Promise<void> {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  } catch (error) {
    throw new Error(`Erro ao fazer logout: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
  }
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const { data } = await supabase.auth.getUser();
    if (!data.user) return null;

    return {
      id: data.user.id,
      email: data.user.email || '',
      role: 'user' as const,
      tenant_id: null,
    };
  } catch (error) {
    console.error('Erro ao obter usuário atual:', error);
    return null;
  }
}

export async function ensureAuthSessionForWrite(): Promise<void> {
  try {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error) {
      console.error('[supabaseAuth] getSession error:', error);
      throw new Error('Faça login novamente para salvar.');
    }

    if (!session?.user) {
      throw new Error('Faça login novamente para salvar.');
    }

    const { error: refreshError } = await supabase.auth.refreshSession();
    if (refreshError) {
      console.warn('[supabaseAuth] refreshSession warning:', refreshError.message);
    }
  } catch (error) {
    console.error('[supabaseAuth] ensureAuthSessionForWrite error:', error);
    throw error;
  }
}

export async function getCurrentSession() {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session;
}
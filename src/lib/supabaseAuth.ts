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

/** Garante sessão ativa e renova o JWT (útil após alterar metadata no Supabase). */
export async function ensureAuthSessionForWrite(): Promise<void> {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error || !session?.user) {
    throw new Error('Faça login novamente para salvar.');
  }

  const { error: refreshError } = await supabase.auth.refreshSession();
  if (refreshError) {
    console.warn('refreshSession:', refreshError.message);
  }
}

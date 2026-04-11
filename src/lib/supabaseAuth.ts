import { supabase } from './supabase';

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

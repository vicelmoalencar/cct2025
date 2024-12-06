import { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

type AuthContextType = {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ data: any; error: any }>;
  signUp: (email: string, password: string) => Promise<{ data: any; error: any; message?: string }>;
  signOut: () => Promise<{ error: Error | null }>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signIn: async () => ({ data: null, error: null }),
  signUp: async () => ({ data: null, error: null }),
  signOut: async () => ({ error: null }),
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Carregar usuário inicial
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Escutar mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Tentando fazer login com:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('Erro de autenticação:', error);
        throw error;
      }

      console.log('Login bem sucedido:', data);
      return { data, error: null };
    } catch (err) {
      console.error('Erro no login:', err);
      return { data: null, error: err };
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      console.log('Iniciando processo de registro para:', email);

      // Verifica se o email existe na tabela usuarios
      const { data: usuarioData, error: usuarioError } = await supabase
        .from('usuarios')
        .select('*')
        .eq('email', email)
        .single();

      if (usuarioError) {
        console.error('Erro ao verificar usuário na tabela usuarios:', usuarioError);
        if (usuarioError.code === 'PGRST116') {
          throw new Error('Este email não está autorizado. Entre em contato com o administrador.');
        }
        throw new Error(`Erro ao verificar usuário: ${usuarioError.message}`);
      }

      console.log('Usuário encontrado na tabela usuarios:', usuarioData);

      // Tenta criar a conta
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: usuarioData.nome,
            role: 'user'
          }
        }
      });

      if (error) {
        // Se o erro for de email não autorizado, vamos tentar fazer login
        if (error.message.includes('cannot be used')) {
          console.log('Email já existe, tentando fazer login...');
          return await signIn(email, password);
        }
        console.error('Erro ao criar conta:', error);
        throw error;
      }

      if (!data.user) {
        throw new Error('Erro ao criar conta: usuário não retornado');
      }

      console.log('Conta criada com sucesso:', data);

      return { 
        data, 
        error: null,
        message: 'Conta criada com sucesso! Você já pode fazer login.'
      };
    } catch (error: any) {
      console.error('Erro completo:', error);
      return { 
        data: null, 
        error: {
          message: error.message || 'Erro ao registrar usuário',
          details: error
        }
      };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { error: null };
    } catch (error: any) {
      console.error('Erro ao fazer logout:', error);
      return { error };
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export const useAuthContext = () => useContext(AuthContext);

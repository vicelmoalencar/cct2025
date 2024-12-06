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
      console.log('Iniciando processo de login para:', email);
      console.log('URL do Supabase:', import.meta.env.VITE_SUPABASE_URL);
      
      // Verifica se o email existe na tabela usuarios
      console.log('Verificando usuário na tabela usuarios...');
      const { data: usuarioData, error: usuarioError } = await supabase
        .from('usuarios')
        .select('*')
        .eq('email', email)
        .single();

      if (usuarioError) {
        console.error('Erro ao verificar usuário na tabela usuarios:', usuarioError);
        console.error('Código do erro:', usuarioError.code);
        console.error('Mensagem do erro:', usuarioError.message);
        if (usuarioError.code === 'PGRST116') {
          throw new Error('Este email não está autorizado. Entre em contato com o administrador.');
        }
        throw new Error(`Erro ao verificar usuário: ${usuarioError.message}`);
      }

      console.log('Usuário encontrado:', usuarioData);

      // Tenta fazer login
      console.log('Tentando fazer login com Supabase auth...');
      let { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      // Se o login falhar com credenciais inválidas, tenta criar o usuário
      if (error?.message === 'Invalid login credentials') {
        console.log('Usuário não existe no auth, tentando criar...');
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name: usuarioData.nome,
              role: 'user'
            }
          }
        });

        if (signUpError) {
          console.error('Erro ao criar usuário:', signUpError);
          throw signUpError;
        }

        console.log('Usuário criado com sucesso:', signUpData);
        data = signUpData;
        error = null;
      } else if (error) {
        console.error('Erro ao fazer login:', error);
        console.error('Código do erro:', error.status);
        console.error('Mensagem do erro:', error.message);
        throw error;
      }

      console.log('Login bem sucedido:', data);

      // Atualiza os metadados do usuário se necessário
      if (!data.user.user_metadata?.role) {
        console.log('Atualizando metadados do usuário...');
        const { error: updateError } = await supabase.auth.updateUser({
          data: {
            name: usuarioData.nome,
            role: 'user'
          }
        });

        if (updateError) {
          console.error('Erro ao atualizar metadados:', updateError);
        } else {
          console.log('Metadados atualizados com sucesso');
        }
      }

      return { data, error: null };
    } catch (error: any) {
      console.error('Erro completo:', error);
      return { 
        data: null, 
        error: {
          message: error.message || 'Erro ao fazer login',
          details: error
        }
      };
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

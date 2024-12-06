import { useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import type { Database } from '../types/supabase';

type Profile = Database['public']['Tables']['profiles']['Row'];

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar sessão atual
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Escutar mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function fetchProfile(userId: string) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Erro ao buscar perfil:', error);
    } finally {
      setLoading(false);
    }
  }

  async function signUp(email: string, password: string) {
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

      // Primeiro, verifica se já existe na tabela auth.users
      const { data: authData, error: authError } = await supabase.auth.admin.getUserByEmail(email);
      
      if (!authError && authData) {
        console.log('Usuário já existe no auth, enviando email de redefinição de senha...');
        const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/auth/callback`,
        });

        if (resetError) throw resetError;

        return { 
          data: null, 
          error: null,
          message: 'Um email foi enviado com instruções para redefinir sua senha.'
        };
      }

      // Se não existe, cria novo usuário
      console.log('Criando novo usuário...');
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: usuarioData.nome,
          },
        },
      });

      if (error) throw error;

      if (!data.user) {
        throw new Error('Erro ao criar conta: usuário não retornado');
      }

      console.log('Usuário criado com sucesso no auth:', data);

      // Cria o perfil na tabela public.users
      console.log('Criando perfil na tabela users...');
      const { error: profileError } = await supabase
        .from('users')
        .insert({
          id: data.user.id,
          email: email,
          name: usuarioData.nome,
          role: 'user'
        });

      if (profileError) {
        console.error('Erro ao criar perfil:', profileError);
      }

      return { 
        data, 
        error: null,
        message: 'Conta criada com sucesso! Verifique seu email para confirmar.'
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
  }

  async function signIn(email: string, password: string) {
    try {
      console.log('Iniciando processo de login para:', email);

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

      // Tenta fazer login
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('Erro ao fazer login:', error);
        if (error.message.includes('Invalid login credentials')) {
          throw new Error('Email ou senha incorretos');
        }
        throw error;
      }

      // Sincroniza os dados com a tabela public.users
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', data.user.id)
        .single();

      if (userError && userError.code === 'PGRST116') {
        console.log('Criando perfil na tabela users...');
        const { error: createError } = await supabase
          .from('users')
          .insert({
            id: data.user.id,
            email: email,
            name: usuarioData.nome,
            role: 'user'
          });

        if (createError) {
          console.error('Erro ao criar perfil:', createError);
        }
      } else {
        console.log('Perfil encontrado:', userData);
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
  }

  async function signOut() {
    try {
      setUser(null);
      setProfile(null);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error };
    }
  }

  return {
    user,
    profile,
    loading,
    signIn,
    signUp,
    signOut,
  };
}

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Alert } from '../components/ui/alert';
import { Loading } from '../components/ui/loading';

type Profile = {
  id: string;
  email: string;
  name: string;
  role: string;
  avatar_url?: string;
};

export function Profile() {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    avatar_url: '',
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    loadProfile();
  }, [user, navigate]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (error) throw error;

      setProfile(data);
      setFormData({
        name: data.name || '',
        avatar_url: data.avatar_url || '',
      });
    } catch (err) {
      console.error('Erro ao carregar perfil:', err);
      setError('Erro ao carregar perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const { error } = await supabase
        .from('users')
        .update({
          name: formData.name,
          avatar_url: formData.avatar_url,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user?.id);

      if (error) throw error;

      setSuccess('Perfil atualizado com sucesso!');
      loadProfile();
    } catch (err) {
      console.error('Erro ao atualizar perfil:', err);
      setError('Erro ao atualizar perfil');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !profile) {
    return <Loading />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-8">Meu Perfil</h1>

        {error && (
          <Alert
            type="error"
            title="Erro"
            message={error}
            className="mb-4"
          />
        )}

        {success && (
          <Alert
            type="success"
            title="Sucesso!"
            message={success}
            className="mb-4"
          />
        )}

        <div className="bg-white shadow rounded-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={profile?.email || ''}
                disabled
                className="mt-1 bg-gray-50"
              />
              <p className="mt-1 text-sm text-gray-500">
                O email não pode ser alterado
              </p>
            </div>

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Nome
              </label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
                className="mt-1"
              />
            </div>

            <div>
              <label htmlFor="avatar_url" className="block text-sm font-medium text-gray-700">
                URL do Avatar
              </label>
              <Input
                id="avatar_url"
                type="url"
                value={formData.avatar_url}
                onChange={(e) => setFormData(prev => ({ ...prev, avatar_url: e.target.value }))}
                className="mt-1"
              />
              <p className="mt-1 text-sm text-gray-500">
                URL de uma imagem para seu avatar (opcional)
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Função
              </label>
              <div className="mt-1">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  {profile?.role === 'admin' ? 'Administrador' : 'Usuário'}
                </span>
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={loading}>
                Salvar Alterações
              </Button>
            </div>
          </form>

          {profile?.role === 'admin' && (
            <div className="mt-8 pt-8 border-t">
              <h2 className="text-lg font-medium mb-4">Opções de Administrador</h2>
              <Button
                onClick={() => navigate('/users')}
                variant="outline"
              >
                Gerenciar Usuários
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Button } from '../components/ui/button';
import { Alert } from '../components/ui/alert';
import { Loading } from '../components/ui/loading';

type Plano = {
  id: string;
  id_bubble_plano: string;
  ativo: boolean;
  codigo: string | null;
  data_expiracao: string | null;
  descricao: string;
  pago: boolean;
  created_at: string;
};

export function Plans() {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const [loading, setLoading] = useState(true);
  const [planos, setPlanos] = useState<Plano[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      console.log('Usuário não autenticado');
      navigate('/login');
      return;
    }

    if (user.user_metadata?.role !== 'admin') {
      console.log('Usuário não é admin:', user.user_metadata);
      setError('Você não tem permissão para acessar esta página.');
      setLoading(false);
      return;
    }

    loadPlanos();
  }, [user, navigate]);

  const loadPlanos = async () => {
    try {
      console.log('Carregando planos...');
      setLoading(true);
      
      const { data, error } = await supabase
        .from('planos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao carregar planos:', error);
        throw error;
      }

      console.log('Planos carregados:', data);
      setPlanos(data || []);
    } catch (err: any) {
      console.error('Erro detalhado:', err);
      setError(`Erro ao carregar lista de planos: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir este plano?')) {
      return;
    }

    try {
      setLoading(true);
      const { error } = await supabase
        .from('planos')
        .delete()
        .eq('id', id);

      if (error) throw error;

      loadPlanos();
    } catch (err: any) {
      console.error('Erro ao excluir plano:', err);
      setError(`Erro ao excluir plano: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (id: string, ativo: boolean) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('planos')
        .update({ ativo: !ativo })
        .eq('id', id);

      if (error) throw error;

      loadPlanos();
    } catch (err: any) {
      console.error('Erro ao atualizar status do plano:', err);
      setError(`Erro ao atualizar status: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto">
        <Alert
          type="error"
          title="Erro"
          message={error}
        />
        <div className="mt-4">
          <Button
            onClick={() => navigate('/')}
          >
            Voltar para Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gerenciar Planos</h1>
        <Button onClick={() => navigate('/plans/new')}>
          Adicionar Plano
        </Button>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Descrição
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Expiração
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {planos.map((plano) => (
              <tr key={plano.id} className={!plano.ativo ? 'bg-gray-50' : ''}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {plano.descricao}
                  </div>
                  <div className="text-sm text-gray-500">
                    ID: {plano.id_bubble_plano}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-col space-y-1">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      plano.ativo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {plano.ativo ? 'Ativo' : 'Inativo'}
                    </span>
                    {plano.pago && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Pago
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {plano.data_expiracao ? (
                    <div className="text-sm text-gray-900">
                      {new Date(plano.data_expiracao).toLocaleDateString()}
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500">
                      Sem expiração
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleStatus(plano.id, plano.ativo)}
                    >
                      {plano.ativo ? 'Desativar' : 'Ativar'}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/plans/${plano.id}`)}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(plano.id)}
                    >
                      Excluir
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

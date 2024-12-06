import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Button } from '../components/ui/button';
import { Alert } from '../components/ui/alert';
import { Loading } from '../components/ui/loading';

type Usuario = {
  id: string;
  id_bubble_user: string;
  nome: string;
  first_name: string;
  last_name: string;
  email: string;
  assinatura_ativa: boolean;
  ativo: boolean;
  cpf: string;
  dt_expiracao: string;
  end_cep: string;
  end_cidade: string;
  end_estado: string;
  end_logradouro: string;
  end_numero: string;
  foto: string;
  id_bubble_plano_atual: string;
  senha_provisoria: boolean;
  suporte: boolean;
  telefone: string;
  teste_gratis: boolean;
  tipo: string;
  whatsapp: string;
  whatsapp_validacao: boolean;
  created_at: string;
};

export function Users() {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const [loading, setLoading] = useState(true);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      console.log('Usuário não autenticado');
      navigate('/login');
      return;
    }

    console.log('Dados do usuário:', {
      id: user.id,
      email: user.email,
      metadata: user.user_metadata,
      role: user.user_metadata?.role
    });

    if (user.user_metadata?.role !== 'admin') {
      console.log('Usuário não é admin:', user.user_metadata);
      setError('Você não tem permissão para acessar esta página.');
      setLoading(false);
      return;
    }

    loadUsuarios();
  }, [user, navigate]);

  const loadUsuarios = async () => {
    try {
      console.log('Carregando usuários...');
      setLoading(true);
      
      const { data, error } = await supabase
        .from('usuarios')
        .select('*');

      if (error) {
        console.error('Erro ao carregar usuários:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        throw error;
      }

      // Ordenar por nome
      const sortedData = [...(data || [])].sort((a, b) => {
        return (a.nome || '').localeCompare(b.nome || '');
      });

      console.log('Usuários carregados:', sortedData);
      setUsuarios(sortedData);
    } catch (err: any) {
      console.error('Erro detalhado:', {
        message: err.message,
        details: err.details,
        hint: err.hint,
        code: err.code,
        stack: err.stack
      });
      setError(`Erro ao carregar lista de usuários: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir este usuário?')) {
      return;
    }

    try {
      setLoading(true);
      const { error } = await supabase
        .from('usuarios')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Erro ao excluir usuário:', error);
        throw error;
      }

      // Recarregar a lista
      loadUsuarios();
    } catch (err: any) {
      console.error('Erro ao excluir usuário:', err);
      setError(`Erro ao excluir usuário: ${err.message}`);
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
          title="Acesso Negado"
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
        <h1 className="text-2xl font-bold">Gerenciar Usuários</h1>
        <Button onClick={() => navigate('/users/new')}>
          Adicionar Usuário
        </Button>
      </div>

      {error && (
        <Alert
          type="error"
          title="Erro"
          message={error}
          className="mb-4"
        />
      )}

      <div className="bg-white shadow rounded-lg overflow-hidden overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nome
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email/Telefone
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tipo
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {usuarios.map((usuario) => (
              <tr key={usuario.id} className={!usuario.ativo ? 'bg-gray-50' : ''}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {usuario.foto && (
                      <img 
                        src={usuario.foto} 
                        alt={usuario.nome} 
                        className="h-8 w-8 rounded-full mr-3"
                      />
                    )}
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {usuario.nome}
                      </div>
                      <div className="text-sm text-gray-500">
                        {usuario.cpf}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{usuario.email}</div>
                  <div className="text-sm text-gray-500">
                    {usuario.telefone || usuario.whatsapp}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-col space-y-1">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      usuario.ativo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {usuario.ativo ? 'Ativo' : 'Inativo'}
                    </span>
                    {usuario.assinatura_ativa && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Assinatura Ativa
                      </span>
                    )}
                    {usuario.teste_gratis && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        Teste Grátis
                      </span>
                    )}
                    {usuario.dt_expiracao && (
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        new Date(usuario.dt_expiracao) > new Date() 
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-orange-100 text-orange-800'
                      }`}>
                        {new Date(usuario.dt_expiracao) > new Date() 
                          ? 'Plano Válido'
                          : 'Expirado'
                        }
                        <span className="ml-1 text-xs opacity-75">
                          {new Date(usuario.dt_expiracao).toLocaleDateString()}
                        </span>
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{usuario.tipo}</div>
                  {usuario.suporte && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      Suporte
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/users/${usuario.id}`)}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(usuario.id)}
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

import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Alert } from '../components/ui/alert';
import { Loading } from '../components/ui/loading';
import { Switch } from '../components/ui/switch';

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
};

export function UserForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [formData, setFormData] = useState<Usuario>({
    id: '',
    id_bubble_user: '',
    nome: '',
    first_name: '',
    last_name: '',
    email: '',
    assinatura_ativa: false,
    ativo: true,
    cpf: '',
    dt_expiracao: '',
    end_cep: '',
    end_cidade: '',
    end_estado: '',
    end_logradouro: '',
    end_numero: '',
    foto: '',
    id_bubble_plano_atual: '',
    senha_provisoria: false,
    suporte: false,
    telefone: '',
    teste_gratis: false,
    tipo: '',
    whatsapp: '',
    whatsapp_validacao: false
  });

  useEffect(() => {
    if (!user?.user_metadata?.role === 'admin') {
      navigate('/');
      return;
    }

    if (id) {
      loadUsuario();
    }
  }, [id, user, navigate]);

  const loadUsuario = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      if (data) {
        setFormData(data);
      }
    } catch (err: any) {
      console.error('Erro ao carregar usuário:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const userData = {
        ...formData,
        dt_expiracao: formData.dt_expiracao ? new Date(formData.dt_expiracao).toISOString() : null
      };

      if (id) {
        // Atualizar usuário existente
        const { error } = await supabase
          .from('usuarios')
          .update(userData)
          .eq('id', id);

        if (error) throw error;
        setSuccess('Usuário atualizado com sucesso!');
      } else {
        // Criar novo usuário
        const { error } = await supabase
          .from('usuarios')
          .insert([userData]);

        if (error) throw error;
        setSuccess('Usuário criado com sucesso!');
      }

      // Aguardar um pouco para mostrar a mensagem de sucesso
      setTimeout(() => {
        navigate('/users');
      }, 2000);
    } catch (err: any) {
      console.error('Erro ao salvar usuário:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !formData.id) {
    return <Loading />;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          {id ? 'Editar Usuário' : 'Novo Usuário'}
        </h1>
        <Button
          variant="outline"
          onClick={() => navigate('/users')}
        >
          Voltar
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

      {success && (
        <Alert
          type="success"
          title="Sucesso!"
          message={success}
          className="mb-4"
        />
      )}

      <form onSubmit={handleSubmit} className="space-y-6 bg-white shadow-sm rounded-lg p-6">
        {/* Informações Básicas */}
        <div className="space-y-6">
          <h2 className="text-lg font-medium border-b pb-2">Informações Básicas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="nome" className="block text-sm font-medium text-gray-700">
                Nome Completo
              </label>
              <Input
                id="nome"
                value={formData.nome}
                onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                required
              />
            </div>

            <div>
              <label htmlFor="cpf" className="block text-sm font-medium text-gray-700">
                CPF
              </label>
              <Input
                id="cpf"
                value={formData.cpf}
                onChange={(e) => setFormData(prev => ({ ...prev, cpf: e.target.value }))}
              />
            </div>

            <div>
              <label htmlFor="telefone" className="block text-sm font-medium text-gray-700">
                Telefone
              </label>
              <Input
                id="telefone"
                value={formData.telefone}
                onChange={(e) => setFormData(prev => ({ ...prev, telefone: e.target.value }))}
              />
            </div>

            <div>
              <label htmlFor="whatsapp" className="block text-sm font-medium text-gray-700">
                WhatsApp
              </label>
              <Input
                id="whatsapp"
                value={formData.whatsapp}
                onChange={(e) => setFormData(prev => ({ ...prev, whatsapp: e.target.value }))}
              />
            </div>

            <div>
              <label htmlFor="tipo" className="block text-sm font-medium text-gray-700">
                Tipo
              </label>
              <Input
                id="tipo"
                value={formData.tipo}
                onChange={(e) => setFormData(prev => ({ ...prev, tipo: e.target.value }))}
              />
            </div>
          </div>
        </div>

        {/* Endereço */}
        <div className="space-y-6">
          <h2 className="text-lg font-medium border-b pb-2">Endereço</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label htmlFor="end_logradouro" className="block text-sm font-medium text-gray-700">
                Logradouro
              </label>
              <Input
                id="end_logradouro"
                value={formData.end_logradouro}
                onChange={(e) => setFormData(prev => ({ ...prev, end_logradouro: e.target.value }))}
              />
            </div>

            <div>
              <label htmlFor="end_numero" className="block text-sm font-medium text-gray-700">
                Número
              </label>
              <Input
                id="end_numero"
                value={formData.end_numero}
                onChange={(e) => setFormData(prev => ({ ...prev, end_numero: e.target.value }))}
              />
            </div>

            <div>
              <label htmlFor="end_cep" className="block text-sm font-medium text-gray-700">
                CEP
              </label>
              <Input
                id="end_cep"
                value={formData.end_cep}
                onChange={(e) => setFormData(prev => ({ ...prev, end_cep: e.target.value }))}
              />
            </div>

            <div>
              <label htmlFor="end_cidade" className="block text-sm font-medium text-gray-700">
                Cidade
              </label>
              <Input
                id="end_cidade"
                value={formData.end_cidade}
                onChange={(e) => setFormData(prev => ({ ...prev, end_cidade: e.target.value }))}
              />
            </div>

            <div>
              <label htmlFor="end_estado" className="block text-sm font-medium text-gray-700">
                Estado
              </label>
              <Input
                id="end_estado"
                value={formData.end_estado}
                onChange={(e) => setFormData(prev => ({ ...prev, end_estado: e.target.value }))}
              />
            </div>
          </div>
        </div>

        {/* Status e Configurações */}
        <div className="space-y-6">
          <h2 className="text-lg font-medium border-b pb-2">Status e Configurações</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center justify-between">
              <label htmlFor="ativo" className="text-sm font-medium text-gray-700">
                Ativo
              </label>
              <Switch
                id="ativo"
                checked={formData.ativo}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, ativo: checked }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <label htmlFor="assinatura_ativa" className="text-sm font-medium text-gray-700">
                Assinatura Ativa
              </label>
              <Switch
                id="assinatura_ativa"
                checked={formData.assinatura_ativa}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, assinatura_ativa: checked }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <label htmlFor="teste_gratis" className="text-sm font-medium text-gray-700">
                Teste Grátis
              </label>
              <Switch
                id="teste_gratis"
                checked={formData.teste_gratis}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, teste_gratis: checked }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <label htmlFor="suporte" className="text-sm font-medium text-gray-700">
                Suporte
              </label>
              <Switch
                id="suporte"
                checked={formData.suporte}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, suporte: checked }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <label htmlFor="senha_provisoria" className="text-sm font-medium text-gray-700">
                Senha Provisória
              </label>
              <Switch
                id="senha_provisoria"
                checked={formData.senha_provisoria}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, senha_provisoria: checked }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <label htmlFor="whatsapp_validacao" className="text-sm font-medium text-gray-700">
                WhatsApp Validado
              </label>
              <Switch
                id="whatsapp_validacao"
                checked={formData.whatsapp_validacao}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, whatsapp_validacao: checked }))}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="dt_expiracao" className="block text-sm font-medium text-gray-700">
                Data de Expiração
              </label>
              <Input
                id="dt_expiracao"
                type="datetime-local"
                value={formData.dt_expiracao ? new Date(formData.dt_expiracao).toISOString().slice(0, 16) : ''}
                onChange={(e) => setFormData(prev => ({ ...prev, dt_expiracao: e.target.value }))}
              />
            </div>

            <div>
              <label htmlFor="id_bubble_plano_atual" className="block text-sm font-medium text-gray-700">
                ID do Plano Atual
              </label>
              <Input
                id="id_bubble_plano_atual"
                value={formData.id_bubble_plano_atual}
                onChange={(e) => setFormData(prev => ({ ...prev, id_bubble_plano_atual: e.target.value }))}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/users')}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={loading}
          >
            {loading ? 'Salvando...' : (id ? 'Atualizar' : 'Criar')}
          </Button>
        </div>
      </form>
    </div>
  );
}

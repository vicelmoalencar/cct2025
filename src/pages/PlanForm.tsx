import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Alert } from '../components/ui/alert';
import { Loading } from '../components/ui/loading';
import { Switch } from '../components/ui/switch';

type Plano = {
  id: string;
  id_bubble_plano: string;
  ativo: boolean;
  codigo: string | null;
  data_expiracao: string | null;
  descricao: string;
  pago: boolean;
};

export function PlanForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [formData, setFormData] = useState<Plano>({
    id: '',
    id_bubble_plano: '',
    ativo: true,
    codigo: '',
    data_expiracao: null,
    descricao: '',
    pago: false
  });

  useEffect(() => {
    if (!user?.user_metadata?.role === 'admin') {
      navigate('/');
      return;
    }

    if (id) {
      loadPlano();
    }
  }, [id, user, navigate]);

  const loadPlano = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('planos')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      if (data) {
        setFormData(data);
      }
    } catch (err: any) {
      console.error('Erro ao carregar plano:', err);
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

      const planoData = {
        ...formData,
        data_expiracao: formData.data_expiracao ? new Date(formData.data_expiracao).toISOString() : null
      };

      if (id) {
        // Atualizar plano existente
        const { error } = await supabase
          .from('planos')
          .update(planoData)
          .eq('id', id);

        if (error) throw error;
        setSuccess('Plano atualizado com sucesso!');
      } else {
        // Criar novo plano
        const { error } = await supabase
          .from('planos')
          .insert([planoData]);

        if (error) throw error;
        setSuccess('Plano criado com sucesso!');
      }

      // Aguardar um pouco para mostrar a mensagem de sucesso
      setTimeout(() => {
        navigate('/plans');
      }, 2000);
    } catch (err: any) {
      console.error('Erro ao salvar plano:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !formData.id) {
    return <Loading />;
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          {id ? 'Editar Plano' : 'Novo Plano'}
        </h1>
        <Button
          variant="outline"
          onClick={() => navigate('/plans')}
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
        <div className="grid grid-cols-1 gap-6">
          <div>
            <label htmlFor="descricao" className="block text-sm font-medium text-gray-700">
              Descrição
            </label>
            <Input
              id="descricao"
              value={formData.descricao}
              onChange={(e) => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
              required
            />
          </div>

          <div>
            <label htmlFor="id_bubble_plano" className="block text-sm font-medium text-gray-700">
              ID do Plano (Bubble)
            </label>
            <Input
              id="id_bubble_plano"
              value={formData.id_bubble_plano}
              onChange={(e) => setFormData(prev => ({ ...prev, id_bubble_plano: e.target.value }))}
              required
            />
          </div>

          <div>
            <label htmlFor="codigo" className="block text-sm font-medium text-gray-700">
              Código
            </label>
            <Input
              id="codigo"
              value={formData.codigo || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, codigo: e.target.value }))}
            />
          </div>

          <div>
            <label htmlFor="data_expiracao" className="block text-sm font-medium text-gray-700">
              Data de Expiração
            </label>
            <Input
              id="data_expiracao"
              type="datetime-local"
              value={formData.data_expiracao ? new Date(formData.data_expiracao).toISOString().slice(0, 16) : ''}
              onChange={(e) => setFormData(prev => ({ ...prev, data_expiracao: e.target.value }))}
            />
          </div>

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
            <label htmlFor="pago" className="text-sm font-medium text-gray-700">
              Pago
            </label>
            <Switch
              id="pago"
              checked={formData.pago}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, pago: checked }))}
            />
          </div>
        </div>

        <div className="flex justify-end space-x-4 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/plans')}
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

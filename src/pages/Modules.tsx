import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useModules } from '../hooks/useModules';
import { Button } from '../components/ui/button';
import { Plus } from 'lucide-react';

export function Modules() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { modules, loading, error } = useModules(courseId);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Módulos</h1>
        <Button className="flex items-center gap-2">
          <Plus size={20} />
          Novo Módulo
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : error ? (
        <div className="flex justify-center items-center h-64 text-red-500">
          <p>Erro ao carregar módulos: {error.message}</p>
        </div>
      ) : modules.length === 0 ? (
        <div className="flex justify-center items-center h-64 text-gray-500">
          <p>Nenhum módulo encontrado.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {modules.map((module) => (
            <div
              key={module.id_bubble_modulo}
              className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => navigate(`/modules/${module.id_bubble_modulo}/lessons`)}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold">{module.descricao}</h3>
                  {module.teste_gratis && (
                    <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                      Teste Grátis
                    </span>
                  )}
                </div>
                <span className="text-sm text-gray-500">
                  Ordem: {module.ordenacao}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

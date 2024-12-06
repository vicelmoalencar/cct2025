import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Users, MessageSquare, FileText } from 'lucide-react';
import { useAuthContext } from '../contexts/AuthContext';

export function Home() {
  const { profile } = useAuthContext();

  const features = [
    {
      icon: BookOpen,
      title: 'Cursos',
      description: 'Acesse nossos cursos especializados em cálculos trabalhistas',
      link: '/courses',
      color: 'bg-blue-500',
    },
    {
      icon: FileText,
      title: 'Wiki',
      description: 'Consulte nossa base de conhecimento atualizada',
      link: '/wiki',
      color: 'bg-green-500',
    },
    {
      icon: Users,
      title: 'Comunidade',
      description: 'Conecte-se com outros profissionais da área',
      link: '/social',
      color: 'bg-purple-500',
    },
    {
      icon: MessageSquare,
      title: 'Suporte',
      description: 'Tire suas dúvidas com nossa equipe especializada',
      link: '/support',
      color: 'bg-orange-500',
    },
  ];

  return (
    <div className="space-y-8">
      <section className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Bem-vindo ao Clube do Cálculo Trabalhista
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Sua plataforma completa para aprendizado e networking em cálculos trabalhistas
        </p>
      </section>

      {profile && (
        <section className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
          <div className="flex items-center space-x-4">
            {profile.avatar_url && (
              <img
                src={profile.avatar_url}
                alt={profile.name}
                className="w-16 h-16 rounded-full border-2 border-white"
              />
            )}
            <div>
              <h2 className="text-2xl font-bold">Olá, {profile.name}!</h2>
              <p className="text-blue-100">
                Continue seu aprendizado em cálculos trabalhistas
              </p>
            </div>
          </div>
        </section>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <Link
              key={feature.title}
              to={feature.link}
              className="block group"
            >
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="flex items-start space-x-4">
                  <div className={`p-3 rounded-lg ${feature.color} text-white`}>
                    <Icon size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 mt-1">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <section className="bg-gray-50 rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Últimas Atualizações
        </h2>
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <span className="text-sm text-blue-600 font-medium">Novo Curso</span>
            <h3 className="font-medium text-gray-900">
              Atualização Trabalhista 2024
            </h3>
            <p className="text-gray-600">
              Aprenda as principais mudanças na legislação trabalhista para 2024.
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <span className="text-sm text-green-600 font-medium">Nova Ferramenta</span>
            <h3 className="font-medium text-gray-900">
              Calculadora de Férias
            </h3>
            <p className="text-gray-600">
              Agora disponível em nossa plataforma: calculadora atualizada de férias.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
import React from 'react';
import { Search, BookOpen, Clock, Star } from 'lucide-react';
import { Input } from '../components/ui/input';

export function Wiki() {
  const categories = [
    {
      title: 'Férias',
      articles: [
        { title: 'Cálculo de Férias Proporcionais', views: 1200 },
        { title: 'Férias em Dobro', views: 800 },
        { title: '1/3 de Férias', views: 950 },
      ],
    },
    {
      title: '13º Salário',
      articles: [
        { title: 'Cálculo do 13º Proporcional', views: 1500 },
        { title: 'Média de Horas Extras no 13º', views: 700 },
        { title: 'Desconto de INSS no 13º', views: 850 },
      ],
    },
    {
      title: 'Rescisão',
      articles: [
        { title: 'Aviso Prévio Indenizado', views: 2000 },
        { title: 'Multa do FGTS', views: 1800 },
        { title: 'Verbas Rescisórias', views: 1600 },
      ],
    },
  ];

  const featuredArticles = [
    {
      title: 'Reforma Trabalhista 2024',
      description: 'Principais mudanças e impactos nos cálculos',
      date: '2024-03-15',
      views: 3500,
    },
    {
      title: 'eSocial: Guia Completo',
      description: 'Como implementar e manter conformidade',
      date: '2024-03-10',
      views: 2800,
    },
    {
      title: 'Acordo Coletivo vs. Convenção',
      description: 'Diferenças e impactos na folha',
      date: '2024-03-05',
      views: 2200,
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Wiki do Cálculo Trabalhista</h1>
        <div className="relative w-64">
          <Input
            type="search"
            placeholder="Buscar artigos..."
            className="pl-10"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        </div>
      </div>

      <section className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Artigos em Destaque</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredArticles.map((article) => (
            <div
              key={article.title}
              className="border rounded-lg p-4 hover:border-blue-500 transition-colors cursor-pointer"
            >
              <div className="flex items-center justify-between mb-2">
                <Star className="text-yellow-400" size={20} />
                <span className="text-sm text-gray-500 flex items-center gap-1">
                  <Clock size={14} />
                  {new Date(article.date).toLocaleDateString('pt-BR')}
                </span>
              </div>
              <h3 className="font-semibold text-gray-900">{article.title}</h3>
              <p className="text-sm text-gray-600 mt-1">{article.description}</p>
              <div className="mt-2 text-sm text-gray-500 flex items-center gap-1">
                <BookOpen size={14} />
                {article.views.toLocaleString()} visualizações
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {categories.map((category) => (
          <section
            key={category.title}
            className="bg-white rounded-lg shadow p-6"
          >
            <h2 className="text-xl font-semibold mb-4">{category.title}</h2>
            <div className="space-y-3">
              {category.articles.map((article) => (
                <div
                  key={article.title}
                  className="flex items-center justify-between p-2 hover:bg-gray-50 rounded cursor-pointer"
                >
                  <span className="text-gray-700">{article.title}</span>
                  <span className="text-sm text-gray-500">
                    {article.views.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      <section className="bg-blue-50 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-blue-900 mb-2">
          Contribua com a Wiki
        </h2>
        <p className="text-blue-700">
          Compartilhe seu conhecimento! Ajude a comunidade criando ou editando artigos
          sobre cálculos trabalhistas.
        </p>
      </section>
    </div>
  );
}
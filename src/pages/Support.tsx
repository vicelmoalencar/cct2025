import React, { useState } from 'react';
import { MessageCircle, Phone, Mail, HelpCircle, Search, Clock } from 'lucide-react';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';

export function Support() {
  const [searchQuery, setSearchQuery] = useState('');

  const faq = [
    {
      question: 'Como calcular horas extras com adicional de 100%?',
      answer: 'Para calcular horas extras com adicional de 100%, multiplique o valor da hora normal por 2. Por exemplo: se o valor da hora normal é R$ 20,00, a hora extra 100% será R$ 40,00.',
    },
    {
      question: 'Qual o prazo para pagamento das verbas rescisórias?',
      answer: 'O prazo para pagamento das verbas rescisórias é de 10 dias corridos a partir do término do contrato quando há aviso prévio trabalhado, e de 1 dia útil quando há aviso prévio indenizado.',
    },
    {
      question: 'Como calcular o DSR sobre horas extras?',
      answer: 'Para calcular o DSR sobre horas extras, some todas as horas extras do mês, divida pelo número de dias úteis e multiplique pelo número de domingos e feriados do mês.',
    },
  ];

  const recentTickets = [
    {
      id: 1,
      title: 'Dúvida sobre férias proporcionais',
      status: 'Em andamento',
      date: '2024-03-15',
    },
    {
      id: 2,
      title: 'Cálculo de adicional noturno',
      status: 'Respondido',
      date: '2024-03-14',
    },
    {
      id: 3,
      title: 'Integração com eSocial',
      status: 'Aguardando',
      date: '2024-03-13',
    },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Como podemos ajudar?
        </h1>
        <div className="max-w-xl mx-auto relative">
          <Input
            type="search"
            placeholder="Busque por dúvidas frequentes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow text-center hover:shadow-lg transition-shadow">
          <MessageCircle className="w-12 h-12 text-blue-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Chat Online</h2>
          <p className="text-gray-600 mb-4">
            Converse em tempo real com nossa equipe de suporte
          </p>
          <Button>Iniciar Chat</Button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow text-center hover:shadow-lg transition-shadow">
          <Phone className="w-12 h-12 text-green-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Suporte por Telefone</h2>
          <p className="text-gray-600 mb-4">
            Ligue para nossa central de atendimento
          </p>
          <Button>0800 123 4567</Button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow text-center hover:shadow-lg transition-shadow">
          <Mail className="w-12 h-12 text-purple-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Email</h2>
          <p className="text-gray-600 mb-4">
            Envie sua dúvida para nossa equipe
          </p>
          <Button>Enviar Email</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <section className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <HelpCircle className="text-blue-500" />
              Perguntas Frequentes
            </h2>
          </div>
          <div className="space-y-4">
            {faq.map((item, index) => (
              <div
                key={index}
                className="border-b last:border-b-0 pb-4 last:pb-0"
              >
                <h3 className="font-medium text-gray-900 mb-2">
                  {item.question}
                </h3>
                <p className="text-gray-600 text-sm">
                  {item.answer}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Clock className="text-blue-500" />
              Tickets Recentes
            </h2>
          </div>
          <div className="space-y-4">
            {recentTickets.map((ticket) => (
              <div
                key={ticket.id}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
              >
                <div>
                  <h3 className="font-medium text-gray-900">
                    {ticket.title}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {new Date(ticket.date).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    ticket.status === 'Respondido'
                      ? 'bg-green-100 text-green-800'
                      : ticket.status === 'Em andamento'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {ticket.status}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">
            Não encontrou o que procurava?
          </h2>
          <p className="mb-6">
            Nossa equipe está pronta para ajudar. Envie sua mensagem e responderemos o mais breve possível.
          </p>
          <form className="space-y-4">
            <Input
              type="text"
              placeholder="Assunto"
              className="bg-white"
            />
            <Textarea
              placeholder="Descreva sua dúvida em detalhes..."
              className="bg-white"
              rows={4}
            />
            <Button className="bg-white text-blue-600 hover:bg-gray-100">
              Enviar Mensagem
            </Button>
          </form>
        </div>
      </section>
    </div>
  );
}
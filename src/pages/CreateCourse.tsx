import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';

export function CreateCourse() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    duration: '',
    price: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implementar a lógica de envio do formulário
    console.log('Dados do curso:', formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Criar Novo Curso</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-1">
            Nome do Curso
          </label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Digite o nome do curso"
            required
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium mb-1">
            Descrição
          </label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Digite a descrição do curso"
            required
          />
        </div>

        <div>
          <label htmlFor="duration" className="block text-sm font-medium mb-1">
            Duração (em horas)
          </label>
          <Input
            id="duration"
            name="duration"
            type="number"
            value={formData.duration}
            onChange={handleChange}
            placeholder="Ex: 40"
            required
          />
        </div>

        <div>
          <label htmlFor="price" className="block text-sm font-medium mb-1">
            Preço
          </label>
          <Input
            id="price"
            name="price"
            type="number"
            step="0.01"
            value={formData.price}
            onChange={handleChange}
            placeholder="Digite o preço do curso"
            required
          />
        </div>

        <Button type="submit" className="w-full">
          Criar Curso
        </Button>
      </form>
    </div>
  );
}

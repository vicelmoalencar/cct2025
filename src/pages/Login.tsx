import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Alert } from '../components/ui/alert';
import { Loading } from '../components/ui/loading';

export function Login() {
  const navigate = useNavigate();
  const { signIn, signUp } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      if (isSignUp) {
        const { error, message } = await signUp(formData.email, formData.password);
        if (error) throw error;
        if (message) {
          setSuccess(message);
          setFormData({ email: '', password: '' });
        }
      } else {
        const { error } = await signIn(formData.email, formData.password);
        if (error) throw error;
        navigate('/');
      }
    } catch (err) {
      console.error('Erro no formulário:', err);
      setError(err instanceof Error ? err.message : 'Ocorreu um erro inesperado.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {isSignUp ? 'Criar Senha' : 'Entrar'}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {isSignUp ? (
              'Digite seu email e crie uma senha'
            ) : (
              'Digite seu email e senha para entrar'
            )}
          </p>
        </div>

        {loading && <Loading />}

        {error && (
          <Alert
            type="error"
            title="Erro"
            message={error}
          />
        )}

        {success && (
          <Alert
            type="success"
            title="Sucesso!"
            message={success}
          />
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="rounded-t-md"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Senha
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete={isSignUp ? 'new-password' : 'current-password'}
                required
                className="rounded-b-md"
                placeholder="Senha"
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
              />
            </div>
          </div>

          <div>
            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {isSignUp ? 'Criar senha' : 'Entrar'}
            </Button>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError(null);
                setSuccess(null);
                setFormData({ email: '', password: '' });
              }}
              className="text-sm text-indigo-600 hover:text-indigo-500"
            >
              {isSignUp ? 'Já tem senha? Entre aqui' : 'Primeiro acesso? Crie sua senha'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

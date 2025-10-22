import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, Mail, Lock } from 'lucide-react';
import Header from '../layout/Header';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // TODO: Remplacer par un vrai appel API
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        navigate('/dashboard');
      } else {
        setError('Email ou mot de passe incorrect');
      }
    } catch (err) {
      setError('Erreur de connexion. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-deep-black">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          {/* Card */}
          <div className="bg-slate-gray rounded-2xl p-8 border border-gray-700 animate-fade-in">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-cyber-cyan bg-opacity-20 rounded-full mb-4">
                <LogIn className="w-8 h-8 text-cyber-cyan" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">Bienvenue</h2>
              <p className="text-text-secondary">Connectez-vous pour accéder à votre infrastructure</p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-error-red bg-opacity-20 border border-error-red text-white px-4 py-3 rounded-lg mb-6">
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-text-secondary" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="block w-full pl-10 pr-3 py-3 bg-deep-black border border-gray-700 rounded-lg text-white placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-cyber-cyan focus:border-transparent transition-all"
                    placeholder="votre.email@exemple.com"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
                  Mot de passe
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-text-secondary" />
                  </div>
                  <input
                    id="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="block w-full pl-10 pr-3 py-3 bg-deep-black border border-gray-700 rounded-lg text-white placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-cyber-cyan focus:border-transparent transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              {/* Remember & Forgot */}
              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.remember}
                    onChange={(e) => setFormData({ ...formData, remember: e.target.checked })}
                    className="w-4 h-4 text-cyber-cyan bg-deep-black border-gray-700 rounded focus:ring-cyber-cyan"
                  />
                  <span className="ml-2 text-sm text-text-secondary">Se souvenir de moi</span>
                </label>
                <a href="#" className="text-sm text-cyber-cyan hover:underline">
                  Mot de passe oublié ?
                </a>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-cyber-cyan hover:bg-opacity-80 text-deep-black font-bold py-3 px-4 rounded-lg transition-all glow-cyan disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Connexion...' : 'Se connecter'}
              </button>
            </form>

            {/* Footer */}
            <div className="mt-6 text-center">
              <p className="text-text-secondary">
                Pas encore de compte ?{' '}
                <Link to="/register" className="text-cyber-cyan font-semibold hover:underline">
                  Créer un compte
                </Link>
              </p>
            </div>
          </div>

          {/* Features */}
          <div className="mt-8 grid grid-cols-3 gap-4">
            <div className="bg-slate-gray rounded-lg p-4 text-center border border-gray-700">
              <div className="text-3xl mb-2">💬</div>
              <p className="text-xs text-text-secondary">Chat IA</p>
            </div>
            <div className="bg-slate-gray rounded-lg p-4 text-center border border-gray-700">
              <div className="text-3xl mb-2">🔧</div>
              <p className="text-xs text-text-secondary">SSH Intégré</p>
            </div>
            <div className="bg-slate-gray rounded-lg p-4 text-center border border-gray-700">
              <div className="text-3xl mb-2">⚡</div>
              <p className="text-xs text-text-secondary">Rapide</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;
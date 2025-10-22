import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';
      console.log('Tentative de connexion à:', `${API_URL}/api/auth/login`);
      
      const response = await axios.post(`${API_URL}/api/auth/login`, {
        email,
        password,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 10000, // 10 secondes
      });

      console.log('Réponse reçue:', response.data);
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('username', response.data.user?.username || email);
        navigate('/dashboard');
      } else {
        setError('Réponse invalide du serveur');
      }
    } catch (err: any) {
      console.error('Erreur de connexion:', err);
      
      if (err.code === 'ECONNREFUSED') {
        setError('Impossible de se connecter au serveur. Vérifiez que le backend est démarré.');
      } else if (err.response) {
        setError(err.response?.data?.error || err.response?.data?.message || 'Erreur de connexion');
      } else if (err.request) {
        setError('Aucune réponse du serveur. Vérifiez votre connexion réseau.');
      } else {
        setError('Une erreur inattendue s\'est produite');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex flex-col">
      {/* Banner Header */}
      <div className="w-full bg-gradient-to-r from-blue-900/60 via-cyan-800/60 to-blue-900/60 backdrop-blur-sm border-b border-cyan-500/30 py-6 px-6 shadow-2xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Logo */}
            <div className="w-14 h-14 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/50 animate-pulse">
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            
            {/* Title */}
            <div>
              <h1 className="text-3xl font-bold text-white tracking-tight drop-shadow-lg">
                ChatOps Commander
              </h1>
              <p className="text-sm text-cyan-300 font-medium">
                Parlez à votre infrastructure
              </p>
            </div>
          </div>
          
          {/* Version badge */}
          <div className="hidden md:flex items-center space-x-3">
            <span className="px-4 py-2 bg-cyan-500/20 text-cyan-300 text-sm font-semibold rounded-full border border-cyan-500/40 shadow-lg">
              v1.0.0
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-8 lg:p-12">
        <div className="w-full max-w-md">
          {/* Login Card */}
          <div className="bg-slate-800/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-700/50 overflow-hidden transform hover:scale-[1.01] transition-transform duration-300">
            
            {/* Card Header */}
            <div className="bg-gradient-to-r from-blue-600/30 to-cyan-600/30 px-8 py-6 border-b border-slate-700/50">
              <div className="flex items-center justify-center mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
              </div>
              <h2 className="text-2xl font-bold text-white text-center mb-2">
                Connexion
              </h2>
              <p className="text-sm text-slate-300 text-center">
                Accédez à votre plateforme DevOps
              </p>
            </div>

            {/* Card Body */}
            <div className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Email Input */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                    Adresse email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@example.com"
                      required
                      autoComplete="email"
                      className="w-full pl-10 pr-4 py-3 bg-slate-900/70 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
                    Mot de passe
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      autoComplete="current-password"
                      className="w-full pl-10 pr-12 py-3 bg-slate-900/70 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-300 transition-colors"
                    >
                      {showPassword ? (
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      ) : (
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="flex items-start space-x-3 p-4 bg-red-500/10 border border-red-500/50 rounded-xl animate-fadeIn">
                    <svg className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-red-400">{error}</p>
                      {error.includes('serveur') && (
                        <p className="text-xs text-red-300 mt-1">
                          Assurez-vous que le backend est démarré sur le port 3001
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading || !email || !password}
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 disabled:from-slate-600 disabled:to-slate-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg shadow-cyan-500/30 flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Connexion en cours...</span>
                    </>
                  ) : (
                    <>
                      <span>Se connecter</span>
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </>
                  )}
                </button>
              </form>

              {/* Demo Credentials */}
              <div className="mt-6 p-4 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-xl border border-blue-500/30">
                <div className="flex items-start space-x-2">
                  <svg className="h-5 w-5 text-cyan-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className="flex-1">
                    <p className="text-xs font-medium text-cyan-300 mb-2">Identifiants de démonstration</p>
                    <div className="font-mono text-xs text-slate-300 space-y-1 bg-slate-900/50 p-3 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <span className="text-slate-500">📧</span>
                        <span className="text-cyan-400 select-all">admin@chatops.local</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-slate-500">🔑</span>
                        <span className="text-cyan-400 select-all">admin123</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-sm text-slate-500">
              © 2024 ChatOps Commander. Tous droits réservés.
            </p>
            <p className="text-xs text-slate-600 mt-2">
              Plateforme DevOps avec IA intégrée
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
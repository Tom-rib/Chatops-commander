import { useState, FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Terminal, Mail, Lock, AlertCircle, Loader } from 'lucide-react'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      await login(email, password)
      navigate('/dashboard')
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la connexion')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <div className="max-w-md w-full space-y-8 animate-fade-in">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <img 
              src="/logo-192.png" 
              alt="AiSystant Logo" 
              className="h-16 w-16 object-contain"
            />
          </div>
          <h2 className="text-3xl font-bold text-text">
            Bienvenue sur AiSystant
          </h2>
          <p className="mt-2 text-text-light">
            Connectez-vous pour gérer votre infrastructure
          </p>
        </div>

        {/* Form */}
        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3 animate-slide-up">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-text mb-2">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-text-light" />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input pl-10"
                  placeholder="vous@exemple.com"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-text mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-text-light" />
                </div>
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input pl-10"
                  placeholder="••••••••"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  <span>Connexion...</span>
                </>
              ) : (
                <span>Se connecter</span>
              )}
            </button>

            {/* Demo credentials */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm">
              <p className="font-medium text-blue-900 mb-2">🎯 Compte de démonstration</p>
              <p className="text-blue-800">
                <span className="font-mono">Email:</span> demo@chatops.com<br />
                <span className="font-mono">Password:</span> demo123
              </p>
            </div>
          </form>
        </div>

        {/* Register Link */}
        <div className="text-center">
          <p className="text-text-light">
            Pas encore de compte ?{' '}
            <Link 
              to="/register" 
              className="font-medium text-primary hover:text-primary-600 transition-colors"
            >
              Créer un compte
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

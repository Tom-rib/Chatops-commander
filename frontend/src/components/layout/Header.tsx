import React from 'react';
import { Link } from 'react-router-dom';

interface HeaderProps {
  showAuth?: boolean;
}

const Header: React.FC<HeaderProps> = ({ showAuth = true }) => {
  return (
    <header className="bg-slate-gray border-b border-gray-700 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <img src="/apple-touch-icon.png" alt="ChatOps Commander" className="h-10 w-10 rounded-lg" />
            <div>
              <h1 className="text-white font-bold text-xl">ChatOps Commander</h1>
              <p className="text-text-secondary text-xs">Parlez à votre infrastructure</p>
            </div>
          </Link>

          {/* Navigation */}
          {showAuth && (
            <nav className="flex items-center gap-4">
              <Link 
                to="/login" 
                className="text-text-secondary hover:text-cyber-cyan transition-colors px-4 py-2"
              >
                Connexion
              </Link>
              <Link 
                to="/register" 
                className="bg-cyber-cyan hover:bg-opacity-80 text-deep-black font-semibold px-6 py-2 rounded-lg transition-all glow-cyan"
              >
                Inscription
              </Link>
            </nav>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
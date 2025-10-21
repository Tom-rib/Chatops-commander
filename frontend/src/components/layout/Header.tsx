import React from 'react';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const username = localStorage.getItem('username') || 'Admin';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    navigate('/login');
  };

  return (
    <header className="h-16 bg-slate-gray border-b border-gray-700 flex items-center justify-between px-6">
      {/* Left: Menu button */}
      <button
        onClick={onMenuClick}
        className="text-gray-400 hover:text-cyber-cyan transition-colors p-2"
        aria-label="Toggle menu"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Right: User menu */}
      <div className="flex items-center gap-4">
        <div className="text-sm">
          <span className="text-gray-400">Bonjour,</span>{' '}
          <span className="text-cyber-cyan font-semibold">{username}</span>
        </div>
        
        <button
          onClick={handleLogout}
          className="px-4 py-2 text-sm bg-red-600/20 text-red-400 hover:bg-red-600/30 rounded-lg transition-colors"
        >
          Déconnexion
        </button>
      </div>
    </header>
  );
};

export default Header;
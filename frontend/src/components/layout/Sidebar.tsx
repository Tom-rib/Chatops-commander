import React from 'react';
import { NavLink } from 'react-router-dom';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ open }) => {
  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/chat', label: 'Chat', icon: '💬' },
    { path: '/servers', label: 'Serveurs', icon: '🖥️' },
  ];

  return (
    <aside
      className={`
        ${open ? 'w-64' : 'w-0'}
        bg-slate-gray border-r border-gray-700 transition-all duration-300 overflow-hidden
      `}
    >
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-gray-700">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-cyber-cyan rounded flex items-center justify-center">
            <span className="text-deep-black font-bold text-xl">C</span>
          </div>
          <div>
            <h1 className="text-white font-bold text-lg">ChatOps</h1>
            <p className="text-xs text-gray-400">Commander</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive
                  ? 'bg-cyber-cyan/20 text-cyber-cyan border border-cyber-cyan'
                  : 'text-gray-400 hover:bg-dark-blue hover:text-white'
              }`
            }
          >
            <span className="text-xl">{item.icon}</span>
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
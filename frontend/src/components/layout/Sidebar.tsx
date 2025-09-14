import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Building2, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Sidebar: React.FC = () => {
  const menuItems = [
    {
      to: '/dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      to: '/hotels',
      label: "Liste des hôtels",
      icon: Building2,
    }
  ];

  // Récupérer les informations de l'utilisateur connecté
  const { user } = useAuth();

  return (
    <div 
      className="w-80 text-white h-screen flex flex-col"
      style={{
        backgroundColor: 'rgba(73, 76, 79, 0.9)',
        backgroundImage: 'url(/background-connexion.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundBlendMode: 'multiply',
        position: 'relative'
      }}
    >
      {/* Logo */}
      <div className="p-6 border-b border-gray-600">
        <div className="flex items-center space-x-3">
          <img src="/logo-red-product.png" alt="Logo" className="w-auto h-7" />
          <span className="font-bold text-lg text-white">RED PRODUCT</span>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 py-6">
        <div className="px-4 mb-4">
          <h3 className="text-sm font-medium text-gray-400 mb-3">Principal</h3>
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) => `w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                    isActive ? 'bg-gray-800 text-white' : 'text-gray-300 hover:bg-gray-600 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.label}
                </NavLink>
              );
            })}
          </nav>
        </div>
      </div>

      {/* User Profile - Positionné en haut avec une marge négative */}
      <div className="p-4 border-t border-gray-600 mt-auto mb-60">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-gray-500 flex items-center justify-center">
            <User className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">{user?.name || 'Utilisateur'}</p>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
              <p className="text-xs text-gray-300">en ligne</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

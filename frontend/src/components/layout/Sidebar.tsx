import React from 'react';
import { Flag, LayoutDashboard, Building2, User } from 'lucide-react';

type CurrentPage = 'dashboard' | 'hotels';

interface SidebarProps {
  currentPage?: CurrentPage;
  onPageChange?: (page: CurrentPage) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentPage = 'dashboard', onPageChange }) => {
  const menuItems = [
    {
      id: 'dashboard' as CurrentPage,
      label: 'Dashboard',
      icon: LayoutDashboard,
      isActive: currentPage === 'dashboard'
    },
    {
      id: 'hotels' as CurrentPage,
      label: "Liste des hôtels",
      icon: Building2,
      isActive: currentPage === 'hotels'
    }
  ];

  return (
    <div className="w-64 bg-gray-700 text-white h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-600">
        <div className="flex items-center space-x-3">
          <Flag className="w-6 h-6" />
          <span className="font-bold text-lg">RED PRODUCT</span>
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
                <button
                  key={item.id}
                  onClick={() => onPageChange?.(item.id)}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                    item.isActive
                      ? 'bg-gray-800 text-white'
                      : 'text-gray-300 hover:bg-gray-600 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* User Profile */}
      <div className="p-4 border-t border-gray-600">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-gray-500 flex items-center justify-center">
            <User className="w-4 h-4" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">Utilisateur</p>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
              <p className="text-xs text-gray-400">en ligne</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

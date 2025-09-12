import React from 'react';
import { Search, Bell, User, LogOut } from 'lucide-react';

interface HeaderProps {
  title: string;
  userName?: string;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ title, userName, onLogout }) => {
  return (
    <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-800">{title}</h1>

        <div className="flex items-center space-x-6">
          {/* Search */}
          <div className="relative hidden md:block">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Recherche"
              className="pl-10 pr-4 py-2 w-64 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Notifications */}
          <div className="relative">
            <Bell className="w-5 h-5 text-gray-600 hover:text-gray-800 cursor-pointer" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-500 rounded-full text-xs text-white flex items-center justify-center font-medium">
              3
            </span>
          </div>

          {/* Profile */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-gray-500 flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
           {/* {userName && <span className="text-sm text-gray-700">{userName}</span>}*/}
            {onLogout && (
              <button onClick={onLogout} className="inline-flex items-center text-sm text-gray-600 hover:text-gray-800">
                <LogOut className="w-4 h-4 mr-1" />
                
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;

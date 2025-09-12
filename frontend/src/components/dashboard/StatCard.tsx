import React from 'react';
import { Mail, MessageCircle, Users, Building2 } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  icon?: 'Mail' | 'MessageCircle' | 'Users' | 'Building2';
  bgColor?: string; // e.g. 'bg-blue-100'
  color?: string;   // e.g. 'text-blue-600'
}

const iconComponents = {
  Mail,
  MessageCircle,
  Users,
  Building2,
};

const StatCard: React.FC<StatCardProps> = ({ title, value, subtitle, icon = 'Mail', bgColor = 'bg-blue-100', color = 'text-blue-600' }) => {
  const IconComponent = iconComponents[icon] || Mail;
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h3 className="text-2xl font-bold text-gray-800 mb-1">
            {typeof value === 'number' ? value.toLocaleString() : value}{' '}
            <span className="text-sm font-medium text-gray-600 ml-2">{title}</span>
          </h3>
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
        </div>
        <div className={`w-12 h-12 rounded-full ${bgColor} flex items-center justify-center`}>
          <IconComponent className={`w-6 h-6 ${color}`} />
        </div>
      </div>
    </div>
  );
};

export default StatCard;

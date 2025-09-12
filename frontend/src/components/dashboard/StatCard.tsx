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
      <div className="flex items-start space-x-8">
        <div className={`w-12 h-12 rounded-full ${bgColor} flex-shrink-0 flex items-center justify-center`}>
          <IconComponent className={`w-10 h-10 ${color}`} />
        </div>
        <div className="flex-1">
          <div className="flex items-baseline space-x-3">
            <span className="text-3xl font-bold text-gray-800">
              {typeof value === 'number' ? value.toLocaleString() : value}
            </span>
            <span className="text-base font-medium text-gray-600">{title}</span>
          </div>
          {subtitle && <p className="text-sm text-gray-500 mt-2">{subtitle}</p>}
        </div>
      </div>
    </div>
  );
};

export default StatCard;

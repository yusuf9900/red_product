import React from 'react';
 

import { Hotel } from '../../types/hotel';

interface HotelCardProps {
  hotel: Hotel;
  onClick?: (hotel: Hotel) => void;
}

const HotelCard: React.FC<HotelCardProps> = ({ hotel, onClick }) => {
  // Formater le prix avec des points comme séparateurs de milliers (ex: 25.000)
  const formatPrice = (price: string | number) => {
    const num = typeof price === 'string' ? parseFloat(price) : price;
    if (isNaN(num)) return price.toString();
    const rounded = Math.round(num);
    return rounded.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  const handleClick = () => {
    if (onClick) {
      onClick(hotel);
    }
  };

  return (
    <div 
      className="bg-white rounded-lg border border-gray-200 overflow-hidden group hover:shadow-md transition-all duration-300 cursor-pointer hover:border-blue-500"
      onClick={handleClick}
    >
      {/* Image de l'hôtel */}
      <div className="relative h-48 bg-gray-100 overflow-hidden">
        {hotel.photo_url ? (
          <img
            src={hotel.photo_url}
            alt={hotel.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <div className="text-gray-400">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
          </div>
        )}
      </div>
      
      {/* Détails de l'hôtel */}
      <div className="p-4 h-full flex flex-col">
        <div className="text-sm text-red-600 mb-1 truncate">
          {hotel.address}
        </div>
        
        <h3 className="font-semibold text-gray-900 text-xl mb-2 line-clamp-2 text-left">
          {hotel.name || 'Aucun nom'}
        </h3>
        
        <div className="text-left">
          <span className="text-base font-semibold text-gray-800">{hotel.price_per_night ? formatPrice(hotel.price_per_night) : 'Prix non disponible'}</span>
          {hotel.currency && <span className="text-base text-gray-700 ml-1">{hotel.currency} <span className="text-gray-500">par nuit</span></span>}
        </div>
      </div>
    </div>
  );
};

export default HotelCard;


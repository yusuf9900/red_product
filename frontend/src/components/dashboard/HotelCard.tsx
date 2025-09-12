import React from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { Hotel } from '../../types/hotel';
import { Button } from '../ui/button';

interface HotelCardProps {
  hotel: Hotel;
  onEdit?: (hotel: Hotel) => void;
  onDelete?: (hotelId: number) => void;
}

const HotelCard: React.FC<HotelCardProps> = ({ hotel, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group">
      {hotel.photo_url && (
        <div className="aspect-video overflow-hidden bg-gray-100">
          <img
            src={hotel.photo_url.startsWith('http') ? hotel.photo_url : `http://localhost:8000/storage/${hotel.photo_url}`}
            alt={hotel.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              // En cas d'erreur de chargement, on cache l'image
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              target.parentElement!.style.paddingBottom = '0';
              target.parentElement!.style.height = '0';
            }}
          />
        </div>
      )}
      <div className="p-4">
        <h3 className="font-semibold text-lg text-gray-800 mb-1 group-hover:text-blue-600 transition-colors duration-200">
          {hotel.name}
        </h3>
        <p className="text-xs text-gray-500 mb-2 truncate">{hotel.address}</p>
        <div className="flex items-end justify-between mt-3">
          <div>
            <span className="text-2xl font-bold text-blue-600">{hotel.price_per_night}</span>
            <span className="text-sm text-gray-600 ml-1">{hotel.currency} / nuit</span>
          </div>
          <div className="flex gap-2">
            {onEdit && (
              <Button variant="outline" size="sm" onClick={() => onEdit(hotel)} className="flex items-center gap-1">
                <Edit className="w-4 h-4" />
                Modifier
              </Button>
            )}
            {onDelete && (
              <Button variant="destructive" size="sm" onClick={() => onDelete(hotel.id)} className="flex items-center gap-1">
                <Trash2 className="w-4 h-4" />
                Supprimer
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelCard;

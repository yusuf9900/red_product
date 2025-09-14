import { useEffect, useState } from 'react';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
import { Button } from '../components/ui/button';
import { Plus } from 'lucide-react';
import HotelForm from '../components/HotelForm';
import HotelCard from '../components/dashboard/HotelCard';
import { Hotel, HotelFormData } from '../types/hotel';
import { hotelService } from '../services/hotelService';
import { useAuth } from '../contexts/AuthContext';

export default function HotelsPage() {
  const { user, logout } = useAuth();
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingHotel, setEditingHotel] = useState<Hotel | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    loadHotels();
  }, []);

  const loadHotels = async () => {
    try {
      setLoading(true);
      const data = await hotelService.getHotels();
      console.log('Données des hôtels chargées:', data);
      setHotels(data || []);
    } catch (e) {
      console.error('Erreur lors du chargement des hôtels:', e);
      setError("Erreur lors du chargement des hôtels");
    } finally {
      setLoading(false);
    }
  };

  const handleAddHotel = () => {
    setEditingHotel(null);
    setShowForm(true);
  };

  const handleEditHotel = (hotel: Hotel) => {
    setEditingHotel(hotel);
    setShowForm(true);
  };

  const handleFormSubmit = async (formData: HotelFormData) => {
    try {
      setFormLoading(true);
      if (editingHotel) {
        await hotelService.updateHotel(editingHotel.id, formData);
      } else {
        await hotelService.createHotel(formData);
      }
      setShowForm(false);
      setEditingHotel(null);
      await loadHotels();
    } catch (e: any) {
      console.error("Erreur lors de l'enregistrement:", e);
      throw e;
    } finally {
      setFormLoading(false);
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingHotel(null);
  };

  return (
    <div className="min-h-screen bg-gray-200 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen">
        <Header title="Liste des hôtels" userName={user?.name} onLogout={logout} />

        <main className="flex flex-col">
          <div className="flex items-center justify-between p-6 bg-white shadow-sm w-full">
            <div className="flex items-center space-x-3">
              <h2 className="text-3xl font-bold text-gray-800">Hôtels</h2>
              <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">{hotels.length}</span>
            </div>

            <Button className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 flex items-center space-x-2 shadow-sm" onClick={handleAddHotel}>
              <Plus className="w-4 h-4" />
              <span>Créer un nouveau hôtel</span>
            </Button>
          </div>
          
          <div className="flex-1 px-6 py-6">
            {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Chargement...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12 text-red-600">{error}</div>
          ) : hotels.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">Aucun hôtel enregistré</p>
              <Button onClick={handleAddHotel} className="bg-blue-600 hover:bg-blue-700 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Ajouter votre premier hôtel
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {hotels.map(hotel => (
                <HotelCard 
                  key={hotel.id} 
                  hotel={hotel} 
                  onClick={handleEditHotel}
                />
              ))}
            </div>
          )}
          </div>
        </main>

        {showForm && (
          <HotelForm
            hotel={editingHotel}
            onSubmit={handleFormSubmit}
            onCancel={handleFormCancel}
            loading={formLoading}
          />
        )}
      </div>
    </div>
  );
}

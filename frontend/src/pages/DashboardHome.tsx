import { useEffect, useState } from 'react';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';
import StatCard from '../components/dashboard/StatCard';
import { useAuth } from '../contexts/AuthContext';
import { hotelService } from '../services/hotelService';
import { Hotel } from '../types/hotel';

export default function DashboardHome() {
  const { user, logout } = useAuth();
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await hotelService.getHotels();
        setHotels(data || []);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen">
        <Header title="Dashboard" userName={user?.name} onLogout={logout} />

        <main className="flex-1 py-6">
          <div className="bg-white px-6 py-6 mb-8">
            <div className="max-w-7xl mx-1">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Bienvenue sur RED Product</h2>
              <p className="text-gray-600">Lorem ipsum dolor sit amet consectetur</p>
            </div>
          </div>
          <div className="px-6">

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <StatCard title="Formulaires" value={125} subtitle="Je ne sais pas quoi mettre" icon="Mail" bgColor="bg-purple-100" color="text-purple-600" />
            <StatCard title="Messages" value={40} subtitle="Je ne sais pas quoi mettre" icon="MessageCircle" bgColor="bg-emerald-100" color="text-emerald-600" />
            <StatCard title="Utilisateurs" value={600} subtitle="Je ne sais pas quoi mettre" icon="Users" bgColor="bg-amber-100" color="text-amber-600" />
            <StatCard title="E-mails" value={25} subtitle="je ne sais pas quoi mettre" icon="Mail" bgColor="bg-red-100" color="text-red-600" />
            <StatCard title="Hôtels" value={loading ? 0 : hotels.length} subtitle="Je ne sais pas quoi mettre" icon="Building2" bgColor="bg-violet-100" color="text-violet-600" />
            <StatCard title="Entités" value={2} subtitle="Je ne sais pas quoi mettre" icon="Users" bgColor="bg-blue-100" color="text-blue-600" />
          </div>
        </div>
        </main>
      </div>
    </div>
  );
}

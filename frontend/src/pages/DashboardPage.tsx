import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Button } from '../components/ui/button'
import { Plus } from 'lucide-react'
import HotelForm from '../components/HotelForm.tsx'
import { hotelService } from '../services/hotelService.ts'
import { Hotel, HotelFormData } from '../types/hotel'
import Header from '../components/layout/Header'
import Sidebar from '../components/layout/Sidebar'
import StatCard from '../components/dashboard/StatCard'
import HotelCard from '../components/dashboard/HotelCard'

export default function DashboardPage() {
  const { user, logout } = useAuth()
  const [hotels, setHotels] = useState<Hotel[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingHotel, setEditingHotel] = useState<Hotel | null>(null)
  const [formLoading, setFormLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    loadHotels()
  }, [])

  const loadHotels = async () => {
    try {
      setLoading(true)
      const response = await hotelService.getHotels()
      setHotels(response || [])
    } catch (error) {
      console.error('Erreur lors du chargement des hôtels:', error)
      setError('Erreur lors du chargement des hôtels')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
  }

  const handleAddHotel = () => {
    setEditingHotel(null)
    setShowForm(true)
  }

  const handleEditHotel = (hotel: Hotel) => {
    setEditingHotel(hotel)
    setShowForm(true)
  }

  const handleDeleteHotel = async (hotelId: number) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet hôtel ?')) {
      return
    }

    try {
      await hotelService.deleteHotel(hotelId)
      await loadHotels()
    } catch (error) {
      console.error('Erreur lors de la suppression:', error)
      alert('Erreur lors de la suppression de l\'hôtel')
    }
  }

  const handleFormSubmit = async (formData: HotelFormData) => {
    try {
      setFormLoading(true)
      if (editingHotel) {
        await hotelService.updateHotel(editingHotel.id, formData)
      } else {
        await hotelService.createHotel(formData)
      }
      setShowForm(false)
      setEditingHotel(null)
      await loadHotels()
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement:', error)
      throw error
    } finally {
      setFormLoading(false)
    }
  }

  const handleFormCancel = () => {
    setShowForm(false)
    setEditingHotel(null)
  }

  // Derived stats for StatCard components
  const averagePrice = hotels.length > 0
    ? Math.round(hotels.reduce((sum, h) => sum + Number(h.price_per_night), 0) / hotels.length)
    : 0

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen">
        <Header title="RED Product" userName={user?.name} onLogout={handleLogout} />
        <main className="px-6 py-6">
          {/* Welcome + primary action */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Gestion des Hôtels</h2>
              <p className="text-gray-600">Gérez votre portefeuille d'hôtels</p>
            </div>
            <Button onClick={handleAddHotel} className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 flex items-center space-x-2 shadow-sm">
              <Plus className="w-4 h-4" />
              <span>Créer un nouveau hôtel</span>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <StatCard title="Hôtels" value={hotels.length} subtitle="Total enregistrés" icon="Building2" bgColor="bg-blue-100" color="text-blue-600" />
            <StatCard title="Prix moyen" value={`${averagePrice} XOF`} subtitle="Par nuit" icon="Users" bgColor="bg-green-100" color="text-green-600" />
            <StatCard title="Statut" value="✓" subtitle="Système opérationnel" icon="Mail" bgColor="bg-purple-100" color="text-purple-600" />
          </div>

          {/* Hotels section header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <h3 className="text-xl font-semibold text-gray-800">Liste des hôtels</h3>
              <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">{hotels.length}</span>
            </div>
          </div>

          {/* Hotels grid */}
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
              {hotels.map((hotel) => (
                <HotelCard key={hotel.id} hotel={hotel} onEdit={handleEditHotel} onDelete={handleDeleteHotel} />
              ))}
            </div>
          )}
        </main>

        {/* Hotel Form Modal */}
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
  )
}
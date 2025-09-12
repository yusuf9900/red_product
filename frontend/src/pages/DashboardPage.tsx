import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Link as LinkIcon, LogOut, User, Plus, Edit, Trash2, MapPin, Phone, Mail } from 'lucide-react'
import HotelForm from '../components/HotelForm.tsx'
import { hotelService } from '../services/hotelService.ts'
import { Hotel, HotelFormData } from '../types/hotel'

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
      setHotels(response.data || [])
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <LinkIcon className="w-8 h-8 text-yellow-600" />
              <h1 className="text-xl font-bold text-gray-900">RED PRODUCT</h1>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <User className="w-4 h-4" />
                <span>{user?.name}</span>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleLogout}
                className="flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Déconnexion
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Gestion des Hôtels
              </h2>
              <p className="text-gray-600">
                Gérez votre portefeuille d'hôtels
              </p>
            </div>
            <Button
              onClick={handleAddHotel}
              className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Ajouter un hôtel
            </Button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Total Hôtels</CardTitle>
              <CardDescription>
                Nombre d'hôtels enregistrés
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600 mb-2">{hotels.length}</div>
              <p className="text-sm text-gray-600">Hôtels actifs</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Prix Moyen</CardTitle>
              <CardDescription>
                Prix moyen par nuit
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600 mb-2">
                {hotels.length > 0 
                  ? Math.round(hotels.reduce((sum, hotel) => sum + Number(hotel.price_per_night), 0) / hotels.length)
                  : 0
                } XOF
              </div>
              <p className="text-sm text-gray-600">Par nuit</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Statut</CardTitle>
              <CardDescription>
                État du système
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600 mb-2">✓</div>
              <p className="text-sm text-gray-600">Système opérationnel</p>
            </CardContent>
          </Card>
        </div>

        {/* Hotels List */}
        <Card>
          <CardHeader>
            <CardTitle>Liste des Hôtels</CardTitle>
            <CardDescription>
              Tous vos hôtels enregistrés
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Chargement...</p>
              </div>
            ) : error ? (
              <div className="text-center py-8 text-red-600">
                {error}
              </div>
            ) : hotels.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600 mb-4">Aucun hôtel enregistré</p>
                <Button onClick={handleAddHotel} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter votre premier hôtel
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {hotels.map((hotel) => (
                  <Card key={hotel.id} className="overflow-hidden">
                    {hotel.photo_url && (
                      <div className="h-48 overflow-hidden">
                        <img
                          src={hotel.photo_url}
                          alt={hotel.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-lg mb-2">{hotel.name}</h3>
                      <div className="space-y-2 text-sm text-gray-600 mb-4">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          <span className="truncate">{hotel.address}</span>
                        </div>
                        {hotel.phone && (
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4" />
                            <span>{hotel.phone}</span>
                          </div>
                        )}
                        {hotel.email && (
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4" />
                            <span className="truncate">{hotel.email}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex justify-between items-center mb-4">
                        <div>
                          <span className="text-2xl font-bold text-blue-600">
                            {hotel.price_per_night}
                          </span>
                          <span className="text-sm text-gray-600 ml-1">
                            {hotel.currency}/nuit
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditHotel(hotel)}
                          className="flex-1"
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Modifier
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteHotel(hotel.id)}
                          className="flex-1"
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Supprimer
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
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
  )
}
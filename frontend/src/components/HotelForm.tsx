import { useState, useEffect } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { X, Image as ImageIcon } from 'lucide-react'
import { Hotel, HotelFormData } from '../types/hotel'

interface HotelFormProps {
  hotel?: Hotel | null
  onSubmit: (formData: HotelFormData) => Promise<void>
  onCancel: () => void
  loading: boolean
}

export default function HotelForm({ hotel, onSubmit, onCancel, loading }: HotelFormProps) {
  const [formData, setFormData] = useState<HotelFormData>({
    name: '',
    address: '',
    email: '',
    phone: '',
    price_per_night: '',
    currency: 'XOF',
    photo: null
  })
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (hotel) {
      setFormData({
        name: hotel.name || '',
        address: hotel.address || '',
        email: hotel.email || '',
        phone: hotel.phone || '',
        price_per_night: hotel.price_per_night || '',
        currency: hotel.currency || 'XOF',
        photo: null
      })
      setPhotoPreview(hotel.photo_url || null)
    }
  }, [hotel])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData(prev => ({
        ...prev,
        photo: file
      }))
      const reader = new FileReader()
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removePhoto = () => {
    setFormData(prev => ({
      ...prev,
      photo: null
    }))
    setPhotoPreview(hotel?.photo_url || null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    const newErrors: Record<string, string> = {}
    if (!formData.name.trim()) newErrors.name = 'Le nom est requis'
    if (!formData.address.trim()) newErrors.address = 'L\'adresse est requise'
    if (!formData.price_per_night) newErrors.price_per_night = 'Le prix par nuit est requis'
    if (formData.price_per_night && Number(formData.price_per_night) <= 0) {
      newErrors.price_per_night = 'Le prix doit être supérieur à 0'
    }
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email invalide'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    try {
      await onSubmit(formData)
    } catch (error: any) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors)
      }
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>
            {hotel ? 'Modifier un hôtel' : 'Créer un nouveau hôtel'}
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onCancel}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Nom + Adresse */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">Nom de l'hôtel *</label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
              </div>
              <div className="space-y-2">
                <label htmlFor="address" className="text-sm font-medium">Adresse *</label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className={errors.address ? 'border-red-500' : ''}
                />
                {errors.address && <p className="text-sm text-red-600">{errors.address}</p>}
              </div>
            </div>

            {/* Email + Téléphone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">E-mail</label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={errors.email ? 'border-red-500' : ''}
                />
                {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
              </div>
              <div className="space-y-2">
                <label htmlFor="phone" className="text-sm font-medium">Numéro de téléphone</label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={errors.phone ? 'border-red-500' : ''}
                />
                {errors.phone && <p className="text-sm text-red-600">{errors.phone}</p>}
              </div>
            </div>

            {/* Prix + Devise */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="price_per_night" className="text-sm font-medium">Prix par nuit *</label>
                <Input
                  id="price_per_night"
                  name="price_per_night"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price_per_night}
                  onChange={handleInputChange}
                  className={errors.price_per_night ? 'border-red-500' : ''}
                />
                {errors.price_per_night && <p className="text-sm text-red-600">{errors.price_per_night}</p>}
              </div>
              <div className="space-y-2">
                <label htmlFor="currency" className="text-sm font-medium">Devise *</label>
                <select
                  id="currency"
                  name="currency"
                  value={formData.currency}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none"
                >
                  <option value="XOF">F XOF</option>
                  <option value="EUR">Euro (€)</option>
                  <option value="USD">Dollar ($)</option>
                </select>
              </div>
            </div>

            {/* Photo Upload */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Photo de l'hôtel</label>
              <div className="space-y-4">
                <div className="relative">
                  <input
                    type="file"
                    id="photo"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="photo"
                    className="block cursor-pointer group"
                  >
                    {photoPreview ? (
                      <div className="relative w-full h-48 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center p-6 text-center hover:border-blue-500 transition-colors">
                        <img 
                          src={photoPreview} 
                          alt="Aperçu de la photo" 
                          className="max-h-40 max-w-full object-contain rounded"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                          <div className="bg-white text-blue-600 px-4 py-2 rounded-md text-sm font-medium">
                            Changer la photo
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="w-full h-48 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center p-6 text-center hover:border-blue-500 transition-colors">
                        <div className="flex flex-col items-center">
                          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                            <ImageIcon className="h-6 w-6 text-gray-400" />
                          </div>
                          <p className="text-sm text-gray-600 mb-1">Glissez et déposez votre image ici</p>
                          <p className="text-xs text-gray-400 mb-3">ou</p>
                          <div className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors">
                            Choisir une photo
                          </div>
                        </div>
                      </div>
                    )}
                  </label>
                </div>
                {photoPreview && (
                  <div className="flex justify-end">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={removePhoto}
                      className="text-red-600 border-red-200 hover:bg-red-50"
                    >
                      <X className="h-4 w-4 mr-1" />
                      Supprimer la photo
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Submit */}
            <div className="flex justify-end pt-4">
              <Button
                type="submit"
                disabled={loading}
                className="bg-gray-800 hover:bg-gray-900"
              >
                {loading ? 'Enregistrement...' : 'Enregistrer'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

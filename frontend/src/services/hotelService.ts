import axios from 'axios'
import { Hotel, HotelFormData, ApiResponse } from '../types/hotel'

const API_BASE_URL = 'https://red-product-backend-brl6.onrender.com/api'

export const hotelService = {
  // Récupérer tous les hôtels
  getHotels: async (): Promise<Hotel[]> => {
    const response = await axios.get(`${API_BASE_URL}/hotels`)
    // Le backend renvoie un tableau brut d'hôtels
    return response.data as Hotel[]
  },

  // Récupérer un hôtel par ID
  getHotel: async (id: number): Promise<ApiResponse<Hotel>> => {
    const response = await axios.get(`${API_BASE_URL}/hotels/${id}`)
    return response.data
  },

  // Créer un nouvel hôtel
  createHotel: async (hotelData: HotelFormData): Promise<ApiResponse<Hotel>> => {
    const formData = new FormData()
    
    // Ajouter tous les champs au FormData
    Object.keys(hotelData).forEach(key => {
      const value = hotelData[key as keyof HotelFormData]
      if (value !== null && value !== undefined) {
        formData.append(key, value as string | Blob)
      }
    })

    const response = await axios.post(`${API_BASE_URL}/hotels`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },

  // Mettre à jour un hôtel
  updateHotel: async (id: number, hotelData: HotelFormData): Promise<ApiResponse<Hotel>> => {
    const formData = new FormData()
    
    // Ajouter tous les champs au FormData
    Object.keys(hotelData).forEach(key => {
      const value = hotelData[key as keyof HotelFormData]
      if (value !== null && value !== undefined) {
        formData.append(key, value as string | Blob)
      }
    })

    // Laravel ne supporte pas PUT avec FormData, on utilise POST avec _method
    formData.append('_method', 'PUT')

    const response = await axios.post(`${API_BASE_URL}/hotels/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },

  // Supprimer un hôtel
  deleteHotel: async (id: number): Promise<ApiResponse<null>> => {
    const response = await axios.delete(`${API_BASE_URL}/hotels/${id}`)
    return response.data
  }
}

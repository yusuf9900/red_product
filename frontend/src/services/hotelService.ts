import axios from 'axios'
import { Hotel, HotelFormData, ApiResponse } from '../types/hotel'

const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL?.toString() || import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'
const API_PREFIX = `${API_BASE_URL.replace(/\/$/, '')}/api`

export const hotelService = {
  // Récupérer tous les hôtels
  getHotels: async (): Promise<Hotel[]> => {
    const response = await axios.get(`${API_PREFIX}/hotels`)
    // Le backend renvoie un tableau brut d'hôtels
    return response.data as Hotel[]
  },

  // Récupérer un hôtel par ID
  getHotel: async (id: number): Promise<ApiResponse<Hotel>> => {
    const response = await axios.get(`${API_PREFIX}/hotels/${id}`)
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

    const response = await axios.post(`${API_PREFIX}/hotels`, formData, {
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

    const response = await axios.post(`${API_PREFIX}/hotels/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },

  // Supprimer un hôtel
  deleteHotel: async (id: number): Promise<ApiResponse<null>> => {
    const response = await axios.delete(`${API_PREFIX}/hotels/${id}`)
    return response.data
  }
}

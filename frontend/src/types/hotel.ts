export interface Hotel {
  id: number
  name: string
  address: string
  email?: string
  phone?: string
  price_per_night: number
  currency: string
  photo?: string
  photo_url?: string
  created_at?: string
  updated_at?: string
}

export interface HotelFormData {
  name: string
  address: string
  email: string
  phone: string
  price_per_night: string | number
  currency: string
  photo: File | null
}

export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
  errors?: Record<string, string[]>
}

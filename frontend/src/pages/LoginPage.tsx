import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await login(email, password)
      navigate('/dashboard')
    } catch (error: any) {
      setError(error.response?.data?.message || 'Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-start justify-center p-4 pt-[100px]" style={{
      backgroundColor: 'rgba(73, 76, 79, 0.9)',
      backgroundImage: 'url(/background-connexion.jpg)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundBlendMode: 'multiply'
    }}>
      <div className="w-[384px]" style={{
        height: 'auto',
        position: 'relative',
        opacity: 1
      }}>
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
        <img src="/logo-red-product.png" alt="logo-red-product" className="h-7 w-auto"/>
          <h1 className="text-2xl font-bold text-white">RED PRODUCT</h1>
        </div>

        <Card className="w-full">
          <CardHeader className="space-y-1">
            <CardTitle className="text-sm">Connectez-vous en tant que Admin</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              {error && (
                <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md mb-4">
                  {error}
                </div>
              )}
              
              <div className="space-y-1">
                <Input
                  type="email"
                  placeholder="E-mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full border-0 border-b border-gray-300 rounded-none focus-visible:ring-0 focus-visible:border-yellow-500 focus-visible:border-b-2 pb-10 px-1"
                />
              </div>
              
              <div className="space-y-1 mt-6">
                <Input
                  type="password"
                  placeholder="Mot de passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full border-0 border-b border-gray-300 rounded-none focus-visible:ring-0 focus-visible:border-yellow-500 focus-visible:border-b-2 pb-10 px-1"
                />
                <div className="flex items-center mt-4 mb-2">
                  <input
                    type="checkbox"
                    id="remember"
                    className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember" className="ml-2 block text-sm text-gray-700 py-3">
                    Gardez-moi connecté
                  </label>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gray-800 hover:bg-gray-700 mt-8"
                disabled={loading}
              >
                {loading ? 'Connexion...' : 'Se connecter'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="mt-6 text-center space-y-4">
          <div>
            <Link 
              to="/forgot-password" 
              className="text-sm text-yellow-500 hover:text-yellow-400 hover:underline"
            >
              Mot de passe oublié ?
            </Link>
          </div>
          
          <p className="text-sm text-gray-300">
            Vous n'avez pas de compte?{' '}
            <Link 
              to="/register" 
              className="font-semibold text-yellow-500 hover:text-yellow-400 hover:underline"
            >
              S'inscrire
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
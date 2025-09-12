import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'

export default function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await register(name, email, password)
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
      <div className="w-[384px] relative" style={{
        height: '597.59px',
        opacity: 1
      }}>
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-12">
          <img src="/logo-red-product.png" alt="logo-red-product" className="h-7 w-auto"/>
          <h1 className="text-2xl font-bold text-white">RED PRODUCT</h1>
        </div>

        <Card className="w-full">
          <CardHeader className="space-y-1">
            <CardTitle className="text-sm">Inscrivez-vous en tant que Admin</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                  {error}
                </div>
              )}
              
              <div className="space-y-1">
                <Input
                  type="text"
                  placeholder="Nom"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full border-0 border-b border-gray-300 rounded-none focus-visible:ring-0 focus-visible:border-yellow-500 focus-visible:border-b-2 px-0 pb-10"
                />
              </div>
              
              <div className="space-y-1">
                <Input
                  type="email"
                  placeholder="E-mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full border-0 border-b border-gray-300 rounded-none focus-visible:ring-0 focus-visible:border-yellow-500 focus-visible:border-b-2 px-0 pb-10"
                />
              </div>
              
              <div className="space-y-1">
                <Input
                  type="password"
                  placeholder="Mot de passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full border-0 border-b border-gray-300 rounded-none focus-visible:ring-0 focus-visible:border-yellow-500 focus-visible:border-b-2 px-0 pb-10"
                />
              </div>
              
              
              <div className="flex items-center mt-6 mb-2">
                <input
                  type="checkbox"
                  id="terms"
                  className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
                  required
                />
                <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                  Accepter les termes et la politique
                </label>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gray-800 hover:bg-gray-700 mt-10"
                disabled={loading}
              >
                {loading ? 'Inscription...' : 'S\'inscrire'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-300">
            Vous avez déjà un compte?{' '}
            <Link 
              to="/login" 
              className="font-semibold text-yellow-500 hover:text-yellow-400 hover:underline"
            >
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
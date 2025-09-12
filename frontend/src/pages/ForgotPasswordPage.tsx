import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setMessage('')
    setLoading(true)

    try {
      // Ici, vous devrez implémenter l'appel à votre API pour la réinitialisation du mot de passe
      // Par exemple : await api.forgotPassword(email)
      
      // Simulation d'un délai pour l'envoi de l'email
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setMessage('Si votre adresse email est valide, vous recevrez bientôt un lien pour réinitialiser votre mot de passe.')
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
            <CardTitle className="text-sm">Mot de passe oublié?</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                  {error}
                </div>
              )}
              
              {message ? (
                <div className="p-3 text-sm text-green-700 bg-green-50 border border-green-200 rounded-md">
                  {message}
                </div>
              ) : (
                <>
                  <p className="text-sm text-gray-600 mb-4">
                  Entrez votre adresse e-mail ci-dessous et nous vous envoyons des instructions sur la façon de modifier votre mot de passe.
                  </p>
                  
                  <div className="space-y-1">
                    <Input
                      type="email"
                      placeholder="Votre e-mail"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full border-0 border-b border-gray-300 rounded-none focus-visible:ring-0 focus-visible:border-yellow-500 focus-visible:border-b-2 pb-10 px-1"
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-gray-800 hover:bg-gray-700 mt-6"
                    disabled={loading}
                  >
                    {loading ? 'Envoi en cours...' : 'Envoyer'}
                  </Button>
                </>
              )}
            </form>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-300">
          Retour à la page de&nbsp;
            <Link 
              to="/login" 
              className="font-semibold text-yellow-500 hover:text-yellow-400 hover:underline"
            >
              connexion
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

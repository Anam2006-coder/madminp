import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { AlertCircle, Shield } from 'lucide-react'

export function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const success = await login(username, password)
      if (!success) {
        setError('Invalid username or password')
      }
    } catch (err) {
      setError('Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Auto 1-click login via URL params (?u=&p=)
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const u = params.get('u')
    const p = params.get('p')
    if (u && p) {
      handleQuickLogin(u, p)
    }
  }, [])

  const handleQuickLogin = async (u: string, p: string) => {
    setUsername(u)
    setPassword(p)
    await handleSubmit({ preventDefault: () => {} } as any)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-login py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Shield className="mx-auto h-8 w-8 text-primary" />
          <h2 className="mt-4 text-xl font-bold text-gray-900">
            Municipality Admin
          </h2>
          <p className="mt-1 text-xs text-gray-600">
            Sign in to manage complaints and analytics
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>
              Enter your credentials to access the dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label htmlFor="username" className="block text-xs font-medium text-gray-700 mb-1">
                  Username
                </label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  required
                  className="h-8 text-sm"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-xs font-medium text-gray-700 mb-1">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="h-8 text-sm"
                />
              </div>

              {error && (
                <div className="flex items-center space-x-2 text-red-600">
                  <AlertCircle className="h-3 w-3" />
                  <span className="text-xs">{error}</span>
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-8 text-sm"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            <div className="mt-4 border-t border-gray-200 pt-4">
              <div className="text-xs text-gray-600 space-y-2">
                <p className="font-medium">Try demo accounts:</p>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleQuickLogin('admin','password')}>Main Admin</Button>
                  <Button variant="outline" size="sm" onClick={() => handleQuickLogin('water_admin','password')}>Water Admin</Button>
                  <Button variant="outline" size="sm" onClick={() => handleQuickLogin('roads_admin','password')}>Roads Admin</Button>
                  <Button variant="outline" size="sm" onClick={() => handleQuickLogin('electricity_admin','password')}>Electricity Admin</Button>
                </div>
                <p className="text-[11px] text-gray-700">Or open: <a className="underline" href="?u=admin&p=password">1-click URL</a></p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


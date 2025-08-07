'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { loginApi } from './utils/api'
import { setToken } from './utils/auth'
import { AxiosResponse } from 'axios'

type LoginResponse = {
  access_token: string;
  message?: string;
};

type ApiError = {
  response?: {
    data?: {
      message?: string;
    };
    status: number;
  };
  request?: XMLHttpRequest;
  message: string;
};

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    debugger
    e.preventDefault()
    setLoading(true)
    setErrorMsg('')

    // Form validation
    if (!username.trim() || !password.trim()) {
      setErrorMsg('Username and password are required')
      setLoading(false)
      return
    }

    loginApi(username, password)
      .then((res) => {
        const response = res as AxiosResponse<LoginResponse>;
        if (response?.data?.access_token) {
          // Use auth utility to set token
          setToken(response.data.access_token)
          console.log('✅ Login successful - Token stored')
          router.push('/dashboard')
        } else {
          setErrorMsg(response.data?.message || 'Invalid credentials')
        }
      })
      .catch((err: ApiError) => {
        console.error('Login error:', err)
        
        if (err.response) {
          // Server responded with error status
          setErrorMsg(err.response.data?.message || `Error ${err.response.status}: Login failed`)
        } else if (err.request) {
          // Network error
          setErrorMsg('Network error: Unable to connect to server')
        } else {
          // Other errors
          setErrorMsg(err.message || 'Login failed')
        }
      })
      .finally(() => setLoading(false))
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded shadow-md w-80">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

        {errorMsg && (
          <div className="text-red-600 text-sm mb-4 text-center bg-red-50 p-3 rounded border border-red-200">
            {errorMsg}
          </div>
        )}
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Username</label>
          <input
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        <button
          type="submit"
          disabled={loading || !username.trim() || !password.trim()}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  )
}

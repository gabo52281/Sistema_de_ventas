import React, { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { login } = useContext(AuthContext)
  const navigate = useNavigate()
  const [error, setError] = useState(null)

  const submit = async (e) => {
    e.preventDefault()
    try {
      await login(email, password)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.error || 'Credenciales inválidas')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form 
        onSubmit={submit} 
        className="bg-white p-12 rounded-2xl shadow-lg w-full max-w-sm flex flex-col gap-5 h-[400px]"
      >
        <h2 className="text-2xl font-bold text-center">Iniciar sesión</h2>

        {error && <div className="text-red-600 text-center">{error}</div>}

        <input 
          value={email} 
          onChange={e=>setEmail(e.target.value)} 
          placeholder="Email" 
          className="w-full border p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" 
        />
        <input 
          value={password} 
          onChange={e=>setPassword(e.target.value)} 
          type="password" 
          placeholder="Contraseña" 
          className="w-full border p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" 
        />
        <button className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700 transition">
          Entrar
        </button>
      </form>
    </div>
  )
}
export default Login

import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import NotasLogin from "../components/NotasLogin";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Credenciales inválidas");
    }
  };
return (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 relative overflow-hidden">
    
    {/* Efecto de fondo animado sutil */}
    <div className="absolute inset-0 opacity-30">
      <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
    </div>

    {/* ✅ LOGO SUPERIOR IZQUIERDA */}
    <Link
      to="/"
      className="absolute top-6 left-8 text-2xl font-bold text-white hover:text-blue-300 transition-all duration-300 z-10 drop-shadow-lg"
      style={{ fontFamily: 'Montserrat, sans-serif' }}
    >
      Facturer
    </Link>

    {/* CONTENEDOR DEL LOGIN */}
    <form
      autoComplete="on"

      onSubmit={submit}
      className="bg-white/95 backdrop-blur-sm p-10 rounded-2xl shadow-2xl w-full max-w-sm space-y-6 relative z-10 border border-white/20"
    >
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-gray-800">Bienvenido</h2>
        <p className="text-gray-500 text-sm">Ingresa tus credenciales para continuar</p>
      </div>

      {error && (
        <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-lg border border-red-200 animate-shake">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div className="relative">
          <input
  type="email"
  autocomplete="email"
  name="email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  placeholder="Email"
  className="w-full border border-gray-300 p-3.5 rounded-lg"
/>
        </div>

        <div className="relative">
          <input
  type="password"
  autocomplete="current-password"
  name="password"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  placeholder="Contraseña"
  className="w-full border border-gray-300 p-3.5 rounded-lg"
/>
        </div>
      </div>

      <button
        type="submit"

      className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white p-3.5 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 cursor-pointer">
        
        Entrar
      </button>

      <div className="text-center">
        <a href="#" className="text-sm text-blue-600 hover:text-blue-700 hover:underline transition">
          ¿Olvidaste tu contraseña?
        </a>
      </div>
    </form>

    {/* NOTAS FLOTANTES (se mantienen discretas) */}
    <NotasLogin />
  </div>
);
};

export default Login;

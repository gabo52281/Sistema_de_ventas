import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex flex-col relative overflow-hidden">
      
      {/* Efecto de fondo animado sutil - igual al login */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      {/* NAVBAR */}
      <header className="flex justify-between items-center px-6 py-4 bg-white/10 backdrop-blur-md shadow-lg border-b border-white/20 relative z-10">
        <h1 className="text-2xl font-bold text-white drop-shadow-lg" style={{ fontFamily: 'Montserrat, sans-serif' }}>
          Facturer
        </h1>
        <Link
          to="/login"
          className="bg-white/95 text-blue-700 px-6 py-2.5 rounded-lg hover:bg-white transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          Ingresar al sistema
        </Link>
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1 flex flex-col md:flex-row items-center justify-center gap-12 px-6 relative z-10">
        <div className="max-w-lg text-center md:text-left">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 leading-tight drop-shadow-2xl">
            Control total de tus ventas y tu inventario
          </h2>
          <p className="text-blue-100 text-lg mb-8 leading-relaxed">
            Gestiona tus productos, clientes y facturas desde un solo lugar.
            Nuestro sistema te ofrece rapidez, seguridad y control para tu negocio.
          </p>
          <Link
            to="/login"
            className="inline-block bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3.5 rounded-lg text-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 font-semibold shadow-2xl hover:shadow-blue-500/50 transform hover:-translate-y-1"
          >
            Comenzar ahora
          </Link>
        </div>

        <div className="max-w-md animate-fadeIn">
          <img
            src="https://cdn-icons-png.flaticon.com/512/950/950258.png"
            alt="Ilustración de ventas e inventario"
            className="w-3/4 drop-shadow-2xl filter brightness-110"
          />
        </div>
      </main>

      <footer className="text-center py-4 text-blue-200/70 text-sm relative z-10">
        © {new Date().getFullYear()} Sistema de Ventas POS e Inventario
      </footer>
    </div>
  );
}
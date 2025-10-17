import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex flex-col">
      {/* NAVBAR */}
      <header className="flex justify-between items-center px-6 py-4 bg-white shadow">
        <h1 className="text-2xl font-bold text-blue-700">
          Sistema de Ventas POS e Inventario
        </h1>
        <Link
          to="/login"
          className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition font-medium"
        >
          Ingresar al sistema
        </Link>
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1 flex flex-col md:flex-row items-center justify-center gap-10 px-6">
        <div className="max-w-lg text-center md:text-left">
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-6 leading-tight">
            Control total de tus ventas y tu inventario
          </h2>
          <p className="text-gray-600 text-lg mb-8">
            Gestiona tus productos, clientes y facturas desde un solo lugar.
            Nuestro sistema te ofrece rapidez, seguridad y control para tu negocio.
          </p>
          <Link
            to="/login"
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg text-lg hover:bg-blue-700 transition"
          >
            Comenzar ahora
          </Link>
        </div>

        <div className="max-w-md animate-fadeIn">
          <img
            src="https://cdn-icons-png.flaticon.com/512/906/906175.png"
            alt="Ilustración de ventas e inventario"
            className="w-full drop-shadow-xl"
          />
        </div>
      </main>

      <footer className="text-center py-4 text-gray-500 text-sm">
        © {new Date().getFullYear()} Sistema de Ventas POS e Inventario
      </footer>
    </div>
  );
}

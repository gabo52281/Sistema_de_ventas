// src/components/NotasLogin.jsx
import React, { useEffect, useState } from "react";
import api from "../api/axios";

const NotasLogin = () => {
  const [contenido, setContenido] = useState("");
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    api.get("/notas")
      .then(res => setContenido(res.data.contenido || ""))
      .catch(() => setContenido("Error cargando notas"));
  }, []);

  const guardarNota = async () => {
    setLoading(true);
    try {
      await api.post("/notas", { contenido });
      setMensaje("✅ Guardado");
      setTimeout(() => setMensaje(""), 2000);
    } catch {
      setMensaje("❌ Error");
    }
    setLoading(false);
  };

  return (
    <div className="fixed top-4 right-4 w-85 bg-white border rounded-lg shadow-lg p-4 z-50">
      <h3 className="font-bold text-gray-700 mb-2">📝 Usuarios listos para probar el sistema:</h3>

      <textarea
        className="w-full border rounded p-2 text-sm h-80 resize-none"
        value={contenido}
        onChange={(e) => setContenido(e.target.value)}
      />

      <button
        onClick={guardarNota}
        disabled={loading}
        className="mt-2 bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 w-full"
      >
        {loading ? "Guardando..." : "💾 Guardar"}
      </button>

      {mensaje && <p className="text-center mt-2 text-sm">{mensaje}</p>}
    </div>
  );
};

export default NotasLogin;

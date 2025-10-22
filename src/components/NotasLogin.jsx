import React, { useEffect, useState } from "react";
import api from "../api/axios";

const NotasLogin = () => {
  const [contenido, setContenido] = useState("");
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState("");

  // ✅ Cargar nota al inicio
  useEffect(() => {
    api.get("/notas")
      .then(res => setContenido(res.data.contenido || ""))
      .catch(() => setContenido("Error cargando notas"));
  }, []);

  // ✅ Guardar cambios
  const guardarNota = async () => {
    setLoading(true);
    try {
      await api.post("/notas", { contenido });
      setMensaje("✅ Guardado correctamente");
      setTimeout(() => setMensaje(""), 2000);
    } catch (error) {
      setMensaje("❌ Error al guardar");
    }
    setLoading(false);
  };

  return (
    <div className="bg-white border rounded-lg shadow p-4 text-sm max-w-md mx-auto mt-6">
      <h3 className="font-bold text-gray-700 mb-2">📝 Notas públicas</h3>

      <textarea
        className="w-full border rounded p-2 text-sm h-40 resize-none"
        value={contenido}
        onChange={(e) => setContenido(e.target.value)}
      />

      <button
        onClick={guardarNota}
        disabled={loading}
        className="mt-2 bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 w-full"
      >
        {loading ? "Guardando..." : "💾 Guardar cambios"}
      </button>

      {mensaje && <p className="text-center mt-2">{mensaje}</p>}
    </div>
  );
};

export default NotasLogin;

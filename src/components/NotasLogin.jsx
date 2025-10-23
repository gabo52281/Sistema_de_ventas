import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { FaStickyNote, FaMinus, FaExpand } from "react-icons/fa";

const NotasLogin = () => {
  const [contenido, setContenido] = useState("");
  const [minimizado, setMinimizado] = useState(false);

  // ✅ Minimizar automáticamente si la pantalla es pequeña
  useEffect(() => {
    const manejarPantalla = () => {
      setMinimizado(window.innerWidth < 768);
    };
    manejarPantalla();
    window.addEventListener("resize", manejarPantalla);
    return () => window.removeEventListener("resize", manejarPantalla);
  }, []);

  // ✅ Cargar nota al inicio
  useEffect(() => {
    const obtenerNotas = async () => {
      try {
        const { data } = await api.get("/notas");
        if (data && data.contenido !== undefined) {
          setContenido(data.contenido); // ← aquí ya coincide con tu backend
        }
      } catch (error) {
        console.error("❌ Error al cargar notas:", error);
      }
    };

    obtenerNotas();
  }, []);

  // ✅ Auto-guardado usando POST (correcto con tu backend)
  useEffect(() => {
    const guardar = setTimeout(async () => {
      try {
        await api.post("/notas", { contenido });
        // console.log("✅ Nota guardada automáticamente");
      } catch (error) {
        console.error("❌ Error al guardar nota:", error);
      }
    }, 600); // espera 600ms para evitar guardar en cada tecla

    return () => clearTimeout(guardar);
  }, [contenido]);

  return (
    <div
      className={`${
        minimizado
          ? "fixed top-3 right-3 z-50 w-52"
          : "fixed top-5 right-5 z-50 w-[350px]"
      }`}
    >
      {/* ✅ Encabezado de la nota */}
      <div className="bg-white shadow-md rounded-lg border p-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <FaStickyNote className="text-yellow-500" />
          <span className="font-bold text-gray-700">Contraseñas aquí</span>
        </div>
        <button
          onClick={() => setMinimizado(!minimizado)}
          className="bg-gray-100 hover:bg-gray-200 transition p-1 rounded-md"
        >
          {minimizado ? <FaExpand /> : <FaMinus />}
        </button>
      </div>

      {/* ✅ Área de texto */}
      {!minimizado && (
        <div className="bg-white shadow-md rounded-lg border mt-2 p-3">
          <textarea
            value={contenido}
            onChange={(e) => setContenido(e.target.value)}
            className="w-full h-64 resize-none p-2 border rounded focus:outline-none"
            placeholder="Escribe tus notas aquí..."
          ></textarea>
        </div>
      )}
    </div>
  );
};

export default NotasLogin;

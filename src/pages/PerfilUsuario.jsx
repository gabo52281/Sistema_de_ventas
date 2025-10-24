import React, { useContext, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import { AuthContext } from "../context/AuthContext";
import api from "../api/axios";
import { ToastContext } from "../context/ToastContext";

const PerfilUsuario = () => {
  const { user, setUser } = useContext(AuthContext);
  const { addToast } = useContext(ToastContext);

  const [form, setForm] = useState({
    nombre: user?.nombre || "",
    email: user?.email || "",
    telefono: user?.telefono || "",
    direccion: user?.direccion || "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const guardarPerfil = async (e) => {
    e.preventDefault();
    try {
      await api.put("/users/perfil", {
        nombre: form.nombre,
        telefono: form.telefono,
        direccion: form.direccion,
      });

      // ✅ Actualizar datos en el AuthContext y LocalStorage
      const updatedUser = { ...user, ...form };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));

      addToast("Perfil actualizado", "success");
    } catch (error) {
      addToast("Error al actualizar perfil", "error");
    }
  };

  return (
    <MainLayout>
      <div className="max-w-lg mx-auto bg-white p-6 rounded-xl shadow">
        <h2 className="text-2xl font-bold mb-4">Mi Perfil</h2>

        <form onSubmit={guardarPerfil} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Nombre</label>
            <input
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              className="border p-2 rounded w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Email (no editable)</label>
            <input
              value={form.email}
              disabled
              className="border p-2 rounded w-full bg-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Teléfono</label>
            <input
              name="telefono"
              value={form.telefono}
              onChange={handleChange}
              className="border p-2 rounded w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Dirección</label>
            <input
              name="direccion"
              value={form.direccion}
              onChange={handleChange}
              className="border p-2 rounded w-full"
            />
          </div>

          <button className="bg-blue-600 text-white px-4 py-2 rounded w-full">
            Guardar cambios
          </button>
        </form>
      </div>
    </MainLayout>
  );
};

export default PerfilUsuario;

import React, { useContext, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import { AuthContext } from "../context/AuthContext";
import api from "../api/axios";
import { ToastContext } from "../context/ToastContext";

const PerfilUsuario = () => {
  const { user, setUser } = useContext(AuthContext);
  const { addToast } = useContext(ToastContext);

  const [editando, setEditando] = useState(false);

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

      const updatedUser = { ...user, ...form };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));

      addToast("Perfil actualizado", "success");
      setEditando(false);
    } catch (error) {
      addToast("Error al actualizar perfil", "error");
    }
  };

  const cancelarEdicion = () => {
    setForm({
      nombre: user?.nombre || "",
      email: user?.email || "",
      telefono: user?.telefono || "",
      direccion: user?.direccion || "",
    });
    setEditando(false);
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
              disabled={!editando}
              className={`border p-2 rounded w-full ${!editando && "bg-gray-200"}`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Email (no editable)</label>
            <input
              value={form.email}
              disabled
              className="border p-2 rounded w-full bg-gray-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Teléfono</label>
            <input
              name="telefono"
              value={form.telefono}
              onChange={handleChange}
              disabled={!editando}
              className={`border p-2 rounded w-full ${!editando && "bg-gray-200"}`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Dirección</label>
            <input
              name="direccion"
              value={form.direccion}
              onChange={handleChange}
              disabled={!editando}
              className={`border p-2 rounded w-full ${!editando && "bg-gray-200"}`}
            />
          </div>

          {/* ✅ Botones que aparecen/desaparecen según el estado */}
          {!editando ? (
            // ✅ Solo aparece cuando NO se está editando
            <button
              type="button"
              onClick={() => setEditando(true)}
              className="bg-yellow-500 text-white px-4 py-2 rounded w-full cursor-pointer"
            >
              Editar
            </button>
          ) : (
            // ✅ Solo aparece cuando SÍ se está editando
            <div className="flex gap-3">
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded w-full cursor-pointer"
              >
                Guardar cambios
              </button>

              <button
                type="button"
                onClick={cancelarEdicion}
                className="bg-gray-400 text-white px-4 py-2 rounded w-full cursor-pointer"
              >
                Cancelar
              </button>
            </div>
          )}
        </form>
      </div>
    </MainLayout>
  );
};

export default PerfilUsuario;

import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">📊 Panel de Administrador</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button 
          onClick={() => {
            localStorage.removeItem('token');
            window.location.href = '/';
          }}
          className="text-sm text-gray-600 hover:text-gray-900"
        >
          Cerrar sesión
        </button>
        <button 
          onClick={() => navigate('/admin/departamentos/crear')}
          className="p-4 bg-blue-100 hover:bg-blue-200 rounded text-left"
        >
          ➕ Crear departamento
        </button>
        <button 
          onClick={() => navigate('/admin/miembros/crear')}
          className="p-4 bg-green-100 hover:bg-green-200 rounded text-left"
        >
          ➕ Crear miembro
        </button>
        <button 
          onClick={() => navigate('/admin/lideres/crear')}
          className="p-4 bg-purple-100 hover:bg-purple-200 rounded text-left"
        >
          ➕ Crear líder
        </button>
        <button 
          onClick={() => navigate('/admin/asignar')}
          className="p-4 bg-yellow-100 hover:bg-yellow-200 rounded text-left"
        >
          ➕ Asignar miembro a departamento
        </button>
        <button 
          onClick={() => navigate('/admin/tareas/crear')}
          className="p-4 bg-blue-100 hover:bg-blue-200 rounded text-left"
        >
          ➕ Crear tarea
        </button>
      </div>
    </div>
  );
}
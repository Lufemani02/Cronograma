import { useNavigate } from "react-router-dom";
import './Dashboard.css'

export default function Dashboard() {
  const navigate = useNavigate();
  return (
    <div className="dashboard-container">
      <header className="panel-header">
        <div className="dept-logo">
          <img src="/iconos/AdminProfile.png" alt="Admin" className="dept-icon" />
        </div>
        <h1 className="panel-title">GESTIÓN DE USUARIOS</h1>
        <button 
          onClick={() => {
            localStorage.removeItem('token');
            window.location.href = '/';
          }}
          className="logout-button"
        >
          CERRAR SESIÓN
        </button>
      </header>
      <div className="p-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button 
              onClick={() => navigate('/admin/departamentos/crear')}
              className="p-4 bg-blue-100 hover:bg-blue-200 rounded text-center"
            >
              Crear departamento
            </button>
            <button 
              onClick={() => navigate('/admin/miembros/crear')}
              className="p-4 bg-green-100 hover:bg-green-200 rounded text-center"
            >
              Crear miembro
            </button>
            <button 
              onClick={() => navigate('/admin/lideres/crear')}
              className="p-4 bg-purple-100 hover:bg-purple-200 rounded text-center"
            >
              Crear líder
            </button>
            <button 
              onClick={() => navigate('/admin/asignar')}
              className="p-4 bg-yellow-100 hover:bg-yellow-200 rounded text-center"
            >
              Asignar miembro a departamento
            </button>
            <button 
              onClick={() => navigate('/admin/tareas/crear')}
              className="p-4 bg-blue-100 hover:bg-blue-200 rounded text-center"
            >
              Crear tarea por departamento
            </button>
      </div>
      </div>
    </div>
  );
}
import { useNavigate } from 'react-router-dom';
import './Dashboard.css'

export default function Dashboard() {
  const navigate = useNavigate();
  const handleEditar = () => {
    alert('⚠️ Para editar un miembro, primero debes crearlo.\nVe a "Crear" para agregar nuevos ministerios, líderes o miembros.');
  };

  const handleEliminar = () => {
    alert('⚠️ Para eliminar un miembro, primero debes crearlo.\nVe a "Crear" para agregar nuevos ministerios, líderes o miembros.');
  };

  return (
    <div className="dashboard-container">
      {/* Header */}
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

      {/* Contenido principal */}
      <main className="dashboard-content">
        <div className="max-w-5xl mx-auto p-6">

          {/* Botones Crear/Editar/Eliminar */}
          <div className="action-buttons">
            <button 
              onClick={() => navigate('/admin/layout')}
              className="btn-create"
            >
              Crear
            </button>
            <button 
              onClick={handleEditar}
              className="btn-edit"
            >
              Editar
            </button>
            <button 
              onClick={handleEliminar}
              className="btn-delete"
            >
              Eliminar
            </button>
          </div>

        </div>
      </main>
    </div>
  );
}
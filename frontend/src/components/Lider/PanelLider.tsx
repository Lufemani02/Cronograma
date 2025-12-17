import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import './PanelLider.css';

export default function PanelLider() {
  const navigate = useNavigate();

  useEffect(() => {
      const validarSesion = async () => {
        const token = localStorage.getItem('token');
        console.log('🔍 Token en localStorage:', token); // ← añade esto

        try {
          const response = await api.get('/lider/perfil');
          console.log('✅ /lider/perfil headers enviados:', response.config.headers); // ← añade esto
        } catch (err: any) {
          console.error('❌ Error en /lider/perfil:', err.response?.status, err.response?.data);
          // ...
        }
      };
      validarSesion();
    }, [navigate]);

  // ✅ Obtiene el primer departamento y su logo_url
 const imgUrl = '/departamentos/logo.jpg'; 

  return (
    <div className="panel-lider-container">
      {/* Header con imagen desde logo_url */}
      <header className="panel-header">
        <div className="dept-logo">
          <img src={imgUrl} alt="Logo" className="dept-icon" />
        </div>
        <h1 className="panel-title">GESTIÓN DE CRONOGRAMAS</h1>
        <button 
          onClick={() => {
            localStorage.removeItem('token');
            navigate('/');
          }}
          className="logout-button"
        >
          CERRAR SESIÓN
        </button>
      </header>

      {/* Contenido principal (igual que antes) */}
      <main className="panel-content">
        <div className="max-w-5xl mx-auto p-4 md:p-6">

  {/* Botón Crear */}
          <div className="contenedor-botones">
            <div className="text-center mt-8">
            <button
              onClick={() => navigate('/panel-lider/asignar')}
              className="btn-asignar"
            >
               Crear Cronogramas
            </button>
          </div>
  {/* Botón cronograma */}
          <div className="text-center mt-8">
          <button 
            onClick={() => navigate('/panel-lider/cronograma')}
            className="btn-cronograma"
          >
            Ver cronogramas
          </button>
          </div>
        </div>
        </div>
      </main>
    </div>
  );
}
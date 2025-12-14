import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import './PanelLider.css';

type Departamento = { id: number; nombre: string; logo_url: string }; // 👈 añadimos logo_url
type Miembro = { id: number; nombre: string; correo: string };
type Tarea = { id: number; nombre: string; departamento_id: number; departamento_nombre: string };

export default function PanelLider() {
  const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
  const [/*miembros*/, setMiembros] = useState<Miembro[]>([]);
  const [/*tareas*/, setTareas] = useState<Tarea[]>([]);
  const [cargando, setCargando] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        console.log('📌 Token en localStorage:', localStorage.getItem('token'));
        const res = await api.get('/lider/datos');
        setDepartamentos(res.data.departamentos);
        setMiembros(res.data.miembros);
        setTareas(res.data.tareas);
      } catch (err: any) {
        console.error('Error:', err);
        alert('No se pudieron cargar tus datos. ¿Sesión expirada?');
        localStorage.removeItem('token');
        navigate('/');
      } finally {
        setCargando(false);
      }
    };

    cargarDatos();
  }, [navigate]);

  // ✅ Obtiene el primer departamento y su logo_url
  const deptPrincipal = departamentos[0];
  const deptNombre = deptPrincipal?.nombre || 'Ministerio';
  const imgUrl = deptPrincipal?.logo_url || '/departamentos/default.png'; // fallback

  if (cargando) {
    return (
      <div className="panel-lider-container">
        <header className="panel-header">
          <div className="dept-logo">
            <div className="placeholder-logo"></div>
          </div>
          <h1 className="panel-title">CARGANDO...</h1>
          <div className="logout-placeholder"></div>
        </header>
        <div className="p-8 text-center">Cargando tus ministerios...</div>
      </div>
    );
  }

  return (
    <div className="panel-lider-container">
      {/* Header con imagen desde logo_url */}
      <header className="panel-header">
        <div className="dept-logo">
          <img src={imgUrl} alt={deptNombre} className="dept-icon" />
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

          {/* Ministerios 
          <section className="panel-section">
            <h2 className="section-title">Tus ministerios</h2>
            {departamentos.length === 0 ? (
              <p className="text-muted">No tienes ministerios asignados.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {departamentos.map(dep => (
                  <div key={dep.id} className="dept-card">
                    <h3 className="dept-card-title">{dep.nombre}</h3>
                  </div>
                ))}
              </div>
            )}
          </section>
*/}
          {/* Miembros 
          <section className="panel-section">
            <h2 className="section-title">Miembros disponibles</h2>
            {miembros.length === 0 ? (
              <p className="text-muted">No hay miembros asignados.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {miembros.map(m => (
                  <div key={m.id} className="member-card">
                    <p className="member-name">{m.nombre}</p>
                    <p className="member-email">{m.correo}</p>
                  </div>
                ))}
              </div>
            )}
          </section>
*/}
          {/* Tareas 
          <section className="panel-section">
            <h2 className="section-title">Tareas por ministerio</h2>
            {tareas.length === 0 ? (
              <p className="text-muted">No hay tareas definidas.</p>
            ) : (
              <div className="space-y-4">
                {departamentos.map(dep => {
                  const tareasDepto = tareas.filter(t => t.departamento_id === dep.id);
                  if (tareasDepto.length === 0) return null;
                  return (
                    <div key={dep.id} className="task-dept-card">
                      <h3 className="task-dept-title">{dep.nombre}</h3>
                      <div className="task-tags">
                        {tareasDepto.map(t => (
                          <span key={t.id} className="task-tag">
                            {t.nombre}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
*/}
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
 {/* Botón Editar 
          <div className="text-center mt-8">
            <button
              onClick={() => navigate('')}
              className="btn-editar"
            >
              Editar
            </button>
          </div>
          */}
  {/* Botón Eliminar 
          <div className="text-center mt-8">
            <button
              onClick={() => navigate('')}
              className="btn-eliminar"
            >
              Eliminar
            </button>
          </div>
          */}
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
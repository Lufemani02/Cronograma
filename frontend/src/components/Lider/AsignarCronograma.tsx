// src/pages/AsignarCronograma.tsx

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import './AsignarCronograma.css';

type Departamento = { id: number; nombre: string; logo_url?: string };
type Miembro = { id: number; nombre: string };
type Tarea = { id: number; nombre: string };

export default function AsignarCronograma() {
  const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
  const [miembros, setMiembros] = useState<Miembro[]>([]);
  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [formData, setFormData] = useState({
    departamento_id: '',
    usuario_id: '',
    tarea_id: '',
    fecha: ''
  });
  const [error, setError] = useState('');
  const [exito, setExito] = useState('');
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();

  // Cargar departamentos al inicio
  useEffect(() => {
    api.get('/lider/datos')
      .then(res => {
        setDepartamentos(res.data.departamentos);
        if (res.data.departamentos.length > 0) {
          setFormData(prev => ({ ...prev, departamento_id: String(res.data.departamentos[0].id) }));
        }
      })
      .catch(err => setError('Error al cargar ministerios'));
  }, []);

  // Cuando cambia el departamento, cargar miembros y tareas
  useEffect(() => {
    if (!formData.departamento_id) return;

    const deptoId = Number(formData.departamento_id);
    
    // Miembros del departamento
    api.get(`/lider/miembros?departamento_id=${deptoId}`)
      .then(res => setMiembros(res.data))
      .catch(() => setMiembros([]));

    // Tareas del departamento
    api.get(`/lider/tareas?departamento_id=${deptoId}`)
      .then(res => setTareas(res.data))
      .catch(() => setTareas([]));

  }, [formData.departamento_id]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setExito('');
    setCargando(true);

    try {
      await api.post('/cronograma', {
        departamento_id: Number(formData.departamento_id),
        usuario_id: Number(formData.usuario_id),
        tarea_id: Number(formData.tarea_id),
        fecha: formData.fecha
      });

      setExito('✅ Servicio asignado con éxito');
      setFormData(prev => ({
        ...prev,
        usuario_id: '',
        tarea_id: '',
        fecha: ''
      }));

    } catch (err: any) {
      const msg = err.response?.data?.error || 'Error al asignar';
      setError(`❌ ${msg}`);
    } finally {
      setCargando(false);
    }
  };

  // ✅ Obtener logo del primer departamento (fallback si no hay logo_url)
  const deptPrincipal = departamentos[0];
  const imgUrl = deptPrincipal?.logo_url || '/departamentos/default.png';

  return (
    <div className="asignar-cronograma-container">
      {/* Header */}
      <header className="panel-header">
        <div className="dept-logo">
          <img src={imgUrl} alt="Logo" className="dept-icon" />
        </div>
        <h1 className="panel-title">GESTION DE CRONOGRAMAS</h1>
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

      {/* Contenido principal */}
      <main className="asignar-content">
        <div className="max-w-3xl mx-auto p-4 md:p-6">

          {/* Volver al panel */}
          <button 
            onClick={() => navigate('/panel-lider')}
            className="back-button"
          >
            ← Volver al panel
          </button>

          {/* Mensajes */}
          {exito && <div className="message success">{exito}</div>}
          {error && <div className="message error">{error}</div>}

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="asignar-form">
            {/* Selects horizontales */}
            <div className="selects-row">
              <div className="select-wrapper">
                <select
                  name="usuario_id"
                  value={formData.usuario_id}
                  onChange={handleChange}
                  className="custom-select"
                  required
                  disabled={!formData.departamento_id}
                >
                  <option value="">Seleccione Miembro...</option>
                  {miembros.map(m => (
                    <option key={m.id} value={m.id}>{m.nombre}</option>
                  ))}
                </select>
              </div>

              <div className="select-wrapper">
                <select
                  name="tarea_id"
                  value={formData.tarea_id}
                  onChange={handleChange}
                  className="custom-select"
                  required
                  disabled={!formData.departamento_id}
                >
                  <option value="">Seleccione Servicio...</option>
                  {tareas.map(t => (
                    <option key={t.id} value={t.id}>{t.nombre}</option>
                  ))}
                </select>
              </div>

              <div className="select-wrapper">
                <input
                  type="date"
                  name="fecha"
                  value={formData.fecha}
                  onChange={handleChange}
                  className="custom-date"
                  required
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>

            {/* Botón Asignar */}
            <button
              type="submit"
              disabled={cargando}
              className="assign-button"
            >
              {cargando ? 'Asignando...' : 'Asignar servicio'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
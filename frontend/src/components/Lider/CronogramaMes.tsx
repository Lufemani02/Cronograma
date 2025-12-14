// src/pages/CronogramaMes.tsx

import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import html2canvas from 'html2canvas';
import './CronogramaMes.css'; //

type Asignacion = {
  fecha: string;
  miembro: string;
  tarea: string;
  ministerio: string;
};

// Colores por ministerio (ajusta según tus necesidades)
const ministerioToColor: Record<string, string> = {
  'Música': '#FFD700',        // Dorado
  'Ujieres': '#FF7F00',       // Naranja
  'Iglesia Infantil': '#8B0000', // Granate
  'Comunicaciones': '#0096FF',   // Azul brillante
  'default': '#64748b',       // Gris neutro
};

// Normalización para coincidir con claves
const getMinisterioColor = (nombre: string): string => {
  const normalized = nombre.trim().toLowerCase();
  for (const [key, color] of Object.entries(ministerioToColor)) {
    if (key.toLowerCase().includes(normalized) || normalized.includes(key.toLowerCase())) {
      return color;
    }
  }
  return ministerioToColor['default'];
};

export default function CronogramaMes() {
  const [asignaciones, setAsignaciones] = useState<Asignacion[]>([]);
  const [mes, setMes] = useState(new Date().getMonth() + 1);
  const [año, setAño] = useState(new Date().getFullYear());
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();
  const exportRef = useRef<HTMLDivElement>(null);

  const cargarCronograma = async () => {
    setCargando(true);
    try {
      const res = await api.get('/cronograma/mes', {
        params: { año, mes }
      });
      setAsignaciones(res.data);
    } catch (err) {
      alert('Error al cargar cronograma');
      console.error(err);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarCronograma();
  }, [mes, año]);

  const exportarJPG = () => {
    if (!exportRef.current) return;

    html2canvas(exportRef.current, { 
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff'
    }).then(canvas => {
      const link = document.createElement('a');
      link.download = `cronograma-${año}-${mes.toString().padStart(2, '0')}.jpg`;
      link.href = canvas.toDataURL('image/jpeg', 0.9);
      link.click();
    });
  };

  // ✅ Obtener logo del dept (mismo que PanelLider)
  // Si no tienes acceso aquí, puedes pasar por contexto o usar un fallback
  const imgUrl = '/departamentos/default.png'; // ← ajusta si tienes dept en localStorage

  return (
    <div className="cronograma-container">
      {/* Header igual que PanelLider */}
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

      <main className="cronograma-content">
        <div className="max-w-5xl mx-auto p-4 md:p-6">

          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">
              🗓️ Cronograma {new Date(año, mes-1).toLocaleString('es', { month: 'long', year: 'numeric' })}
            </h2>
            <button 
              onClick={() => navigate('/panel-lider')}
              className="back-button"
            >
              ← Volver al panel
            </button>
          </div>

          {/* Filtros */}
          <div className="filters-card mb-6">
            <div className="flex flex-wrap gap-3">
              <select 
                value={mes} 
                onChange={e => setMes(Number(e.target.value))}
                className="filter-select"
              >
                {Array.from({length: 12}, (_, i) => (
                  <option key={i+1} value={i+1}>
                    {new Date(0, i).toLocaleString('es', { month: 'long' })}
                  </option>
                ))}
              </select>

              <input
                type="number"
                value={año}
                onChange={e => setAño(Number(e.target.value))}
                className="filter-input"
                min="2020"
                max="2030"
              />

              <button 
                onClick={cargarCronograma}
                disabled={cargando}
                className="btn-load"
              >
                {cargando ? 'Cargando...' : 'Cargar cronograma'}
              </button>
            </div>
          </div>

          {/* Tabla */}
          <div ref={exportRef} className="cronograma-export bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 bg-gray-50 border-b">
              <h3 className="text-lg font-bold text-center text-gray-800">
                Cronograma de Servicio — {new Date(año, mes-1).toLocaleString('es', { month: 'long', year: 'numeric' })}
              </h3>
            </div>

            {cargando ? (
              <div className="p-8 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-green-500 border-t-transparent"></div>
                <p className="mt-2 text-gray-600">Cargando asignaciones...</p>
              </div>
            ) : asignaciones.length === 0 ? (
              <div className="p-12 text-center">
                <div className="text-4xl mb-2">📅</div>
                <p className="text-gray-500 font-medium">
                  No hay asignaciones para este mes.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-100 text-gray-700">
                      <th className="py-3 px-4 text-left font-semibold">Fecha</th>
                      <th className="py-3 px-4 text-left font-semibold">Miembro</th>
                      <th className="py-3 px-4 text-left font-semibold">Tarea</th>
                      <th className="py-3 px-4 text-left font-semibold">Ministerio</th>
                    </tr>
                  </thead>
                  <tbody>
                    {asignaciones.map((a, i) => {
                      const color = getMinisterioColor(a.ministerio);
                      return (
                        <tr 
                          key={i} 
                          className="border-b hover:bg-gray-50 transition-colors"
                        >
                          <td className="py-3 px-4 font-medium text-gray-800">
                            {new Date(a.fecha).toLocaleDateString('es')}
                          </td>
                          <td className="py-3 px-4 text-gray-700">{a.miembro}</td>
                          <td className="py-3 px-4 text-gray-700">{a.tarea}</td>
                          <td className="py-3 px-4">
                            <span 
                              className="inline-block px-3 py-1 rounded-full text-sm font-medium text-white"
                              style={{ backgroundColor: color }}
                            >
                              {a.ministerio}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Botón Exportar */}
          {asignaciones.length > 0 && (
            <div className="mt-8 text-center">
              <button
                onClick={exportarJPG}
                className="btn-export"
              >
                📤 Exportar cronograma a JPG
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
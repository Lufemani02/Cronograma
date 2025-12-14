import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import './Dashboard.css';

export default function CrearLider() {
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [departamentos, setDepartamentos] = useState<any[]>([]);
  const [departamentosSeleccionados, setDepartamentosSeleccionados] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [exito, setExito] = useState<{ nombre: string; correo: string } | null>(null);
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();

  // Cargar departamentos al montar
  useEffect(() => {
    api.get('/admin/departamentos')
      .then(res => setDepartamentos(res.data))
      .catch(err => {
        console.error('Error al cargar departamentos:', err);
        setError('No se pudieron cargar los ministerios');
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setExito(null);
    setCargando(true);

    try {
      // Validar
      if (!nombre.trim() || !correo.trim() || !contraseña.trim()) {
        throw new Error('Nombre, correo y contraseña son requeridos');
      }
      if (departamentosSeleccionados.length === 0) {
        throw new Error('Debes asignar al menos un ministerio');
      }

      const res = await api.post('/admin/lideres', {
        nombre: nombre.trim(),
        correo: correo.trim(),
        contraseña: contraseña.trim(),
        departamento_ids: departamentosSeleccionados.map(id => Number(id))
      });

      setExito({
        nombre: res.data.nombre,
        correo: res.data.correo
      });

      // Reset
      setNombre('');
      setCorreo('');
      setContraseña('');
      setDepartamentosSeleccionados([]);

    } catch (err: any) {
      const msg = err.response?.data?.error || err.message || 'Error al crear líder';
      setError(`❌ ${msg}`);
    } finally {
      setCargando(false);
    }
  };

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
    <div className="max-w-2xl mx-auto p-6">
      <button 
        onClick={() => navigate('/admin/layout')}
        className="mb-4 text-blue-600 hover:underline"
      >
        Volver al panel
      </button>

      <h2 className="text-2xl font-bold mb-4">Crear nuevo líder</h2>

      {exito && (
        <div className="mb-4 p-3 bg-green-100 text-green-800 rounded">
          ✅ Líder creado: <strong>{exito.nombre}</strong> ({exito.correo})
        </div>
      )}
      {error && <div className="mb-4 p-3 bg-red-100 text-red-800 rounded">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Nombre completo *</label>
          <input
            type="text"
            value={nombre}
            onChange={e => setNombre(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Correo *</label>
          <input
            type="email"
            value={correo}
            onChange={e => setCorreo(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Contraseña *</label>
          <input
            type="password"
            value={contraseña}
            onChange={e => setContraseña(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Ej: contraseña123"
            required
            minLength={6}
          />
          <p className="text-xs text-gray-500 mt-1">
            Definir contraseña (mínimo 6 caracteres)
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Asignar departamento's *</label>
          <select
            value={departamentosSeleccionados}
            onChange={e => {
              const selected = Array.from(e.target.selectedOptions, opt => opt.value);
              setDepartamentosSeleccionados(selected);
            }}
            className="w-full p-2 border rounded"
            required
          >
            <option value="" disabled>
              Seleccionar departamento
            </option>
            {departamentos.map(d => (
              <option key={d.id} value={d.id}>{d.nombre}</option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          disabled={cargando}
          className={`px-4 py-2 rounded font-medium ${
            cargando ? 'bg-gray-400' : 'bg-purple-600 hover:bg-purple-700'
          } text-white`}
        >
          {cargando ? 'Creando...' : 'Crear líder'}
        </button>
      </form>
    </div>
    </div>
  );
}
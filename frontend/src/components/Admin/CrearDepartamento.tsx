import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import './Dashboard.css';

export default function CrearDepartamento() {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [error, setError] = useState('');
  const [exito, setExito] = useState('');
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setExito('');
    setCargando(true);

    try {
      if (!nombre.trim()) {
        throw new Error('Nombre es requerido');
      }
      const res = await api.post('/admin/departamentos', {
        nombre: nombre.trim(),
        descripcion: descripcion.trim() || null
      });

      setExito(`✅ Departamento creado: ${res.data.nombre} (ID: ${res.data.id})`);
      setNombre('');
      setDescripcion('');
    } catch (err: any) {
      const msg = err.response?.data?.error || 'Error al crear departamento';
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
      <h2 className="text-2xl font-bold mb-4">Crear nuevo departamento</h2>
      {exito && <div className="mb-4 p-3 bg-green-100 text-green-800 rounded">{exito}</div>}
      {error && <div className="mb-4 p-3 bg-red-100 text-red-800 rounded">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Nombre Departamento*</label>
          <input
            type="text"
            value={nombre}
            onChange={e => setNombre(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Descripción (opcional)</label>
          <textarea
            value={descripcion}
            onChange={e => setDescripcion(e.target.value)}
            className="w-full p-2 border rounded"
            maxLength={255}
          />
        </div>
        <button
          type="submit"
          disabled={cargando || !nombre.trim()}
          className={`px-4 py-2 rounded font-medium ${
            cargando ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'
          } text-white`}
        >
          {cargando ? 'Creando...' : 'Crear departamento'}
        </button>
      </form>
    </div>
    </div>
  );
}
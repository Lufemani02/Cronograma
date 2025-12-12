import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

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
    <div className="max-w-2xl mx-auto p-6">
      <button 
        onClick={() => navigate('/admin')}
        className="mb-4 text-blue-600 hover:underline"
      >
        ← Volver al panel
      </button>

      <h2 className="text-2xl font-bold mb-4">➕ Crear nuevo departamento</h2>

      {exito && <div className="mb-4 p-3 bg-green-100 text-green-800 rounded">{exito}</div>}
      {error && <div className="mb-4 p-3 bg-red-100 text-red-800 rounded">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Nombre *</label>
          <input
            type="text"
            value={nombre}
            onChange={e => setNombre(e.target.value)}
            className="w-full p-2 border rounded"
            required
            maxLength={100}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Descripción (opcional)</label>
          <textarea
            value={descripcion}
            onChange={e => setDescripcion(e.target.value)}
            className="w-full p-2 border rounded"
            rows={3}
            maxLength={255}
          />
        </div>

        <button
          type="submit"
          disabled={cargando || !nombre.trim()}
          className={`px-4 py-2 rounded font-medium ${
            cargando ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
          } text-white`}
        >
          {cargando ? 'Creando...' : 'Crear departamento'}
        </button>
      </form>
    </div>
  );
}
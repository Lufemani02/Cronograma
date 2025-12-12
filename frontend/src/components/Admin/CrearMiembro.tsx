import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

export default function CrearMiembro() {
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [telefono, setTelefono] = useState('');
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
      const res = await api.post('/admin/miembros', {
        nombre: nombre.trim(),
        correo: correo.trim(),
        telefono: telefono.trim() || null
      });

      setExito(`✅ Miembro creado: ${res.data.nombre}`);
      setNombre('');
      setCorreo('');
      setTelefono('');
    } catch (err: any) {
      const msg = err.response?.data?.error || 'Error al crear miembro';
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

      <h2 className="text-2xl font-bold mb-4">👤 Crear nuevo miembro</h2>

      {exito && <div className="mb-4 p-3 bg-green-100 text-green-800 rounded">{exito}</div>}
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
          <label className="block text-sm font-medium mb-1">Teléfono (opcional)</label>
          <input
            type="tel"
            value={telefono}
            onChange={e => setTelefono(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <button
          type="submit"
          disabled={cargando}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          {cargando ? 'Creando...' : 'Crear miembro'}
        </button>
      </form>
    </div>
  );
}
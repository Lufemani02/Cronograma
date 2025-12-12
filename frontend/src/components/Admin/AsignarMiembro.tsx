import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

export default function AsignarMiembro() {
  const [miembros, setMiembros] = useState<any[]>([]);
  const [departamentos, setDepartamentos] = useState<any[]>([]);
  const [usuario_id, setUsuarioId] = useState('');
  const [departamento_id, setDepartamentoId] = useState('');
  const [error, setError] = useState('');
  const [exito, setExito] = useState('');
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();

  // Cargar datos al montar
  useEffect(() => {
    Promise.all([
      api.get('/usuarios'),
      api.get('/admin/departamentos')
    ]).then(([userRes, depRes]) => {
      setMiembros(userRes.data.filter((u: any) => !u.es_lider));
      setDepartamentos(depRes.data);
    }).catch(err => {
      setError('Error al cargar datos');
      console.error(err);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setExito('');
    setCargando(true);

    try {
      await api.post('/admin/asignar', {
        usuario_id: Number(usuario_id),
        departamento_id: Number(departamento_id)
      });

      setExito(`✅ Asignación creada`);
      setUsuarioId('');
      setDepartamentoId('');
    } catch (err: any) {
      const msg = err.response?.data?.error || 'Error al asignar';
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

      <h2 className="text-2xl font-bold mb-4">🔀 Asignar miembro a departamento</h2>

      {exito && <div className="mb-4 p-3 bg-green-100 text-green-800 rounded">{exito}</div>}
      {error && <div className="mb-4 p-3 bg-red-100 text-red-800 rounded">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Miembro *</label>
          <select
            value={usuario_id}
            onChange={e => setUsuarioId(e.target.value)}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Selecciona un miembro</option>
            {miembros.map(m => (
              <option key={m.id} value={m.id}>{m.nombre} ({m.correo})</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Departamento *</label>
          <select
            value={departamento_id}
            onChange={e => setDepartamentoId(e.target.value)}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Selecciona un departamento</option>
            {departamentos.map(d => (
              <option key={d.id} value={d.id}>{d.nombre}</option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={cargando || !usuario_id || !departamento_id}
          className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
        >
          {cargando ? 'Asignando...' : 'Asignar'}
        </button>
      </form>
    </div>
  );
}
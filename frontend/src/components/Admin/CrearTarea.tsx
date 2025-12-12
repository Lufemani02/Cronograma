import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

export default function CrearTarea() {
  const [nombre, setNombre] = useState('');
  const [departamento_id, setDepartamentoId] = useState('');
  const [departamentos, setDepartamentos] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [exito, setExito] = useState('');
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/admin/departamentos')
      .then(res => setDepartamentos(res.data))
      .catch(() => setError('Error al cargar departamentos'));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setExito('');
    setCargando(true);

    try {
      await api.post('/admin/tareas', {
        nombre: nombre.trim(),
        departamento_id: Number(departamento_id)
      });

      setExito(`✅ Tarea creada: "${nombre}"`);
      setNombre('');
    } catch (err: any) {
      const msg = err.response?.data?.error || 'Error al crear tarea';
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

      <h2 className="text-2xl font-bold mb-4">🔧 Crear tarea para departamento</h2>

      {exito && <div className="mb-4 p-3 bg-green-100 text-green-800 rounded">{exito}</div>}
      {error && <div className="mb-4 p-3 bg-red-100 text-red-800 rounded">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
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

        <div>
          <label className="block text-sm font-medium mb-1">Nombre de la tarea *</label>
          <input
            type="text"
            value={nombre}
            onChange={e => setNombre(e.target.value)}
            className="w-full p-2 border rounded"
            required
            maxLength={100}
          />
        </div>

        <button
          type="submit"
          disabled={cargando || !nombre.trim() || !departamento_id}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {cargando ? 'Creando...' : 'Crear tarea'}
        </button>
      </form>
    </div>
  );
}
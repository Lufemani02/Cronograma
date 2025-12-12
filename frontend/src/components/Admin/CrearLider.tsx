import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

export default function CrearLider() {
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [error, setError] = useState('');
  const [exito, setExito] = useState<{ nombre: string; correo: string; contraseña: string } | null>(null);
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setExito(null);
    setCargando(true);

    try {
      const res = await api.post('/admin/lideres', {
        nombre: nombre.trim(),
        correo: correo.trim()
      });

      // Guardamos temporalmente la contraseña para mostrarla
      setExito({
        nombre: res.data.nombre,
        correo: res.data.correo,
        contraseña: res.data.contraseña_generada
      });
      setNombre('');
      setCorreo('');
    } catch (err: any) {
      const msg = err.response?.data?.error || 'Error al crear líder';
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

      <h2 className="text-2xl font-bold mb-4">👑 Crear nuevo líder</h2>

      {exito ? (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded">
          <h3 className="font-bold text-green-800">✅ Líder creado con éxito</h3>
          <p><strong>Nombre:</strong> {exito.nombre}</p>
          <p><strong>Correo:</strong> {exito.correo}</p>
          <div className="mt-2 p-3 bg-white border-l-4 border-yellow-500">
            <p className="font-mono text-lg">{exito.contraseña}</p>
            <p className="text-sm text-gray-600 mt-1">
              🔑 <strong>Esta es la contraseña temporal.</strong> 
              Compártela con el líder. No se volverá a mostrar.
            </p>
          </div>
          <button
            onClick={() => setExito(null)}
            className="mt-3 text-sm text-blue-600 hover:underline"
          >
            Crear otro líder
          </button>
        </div>
      ) : (
        <>
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
                maxLength={150}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Correo institucional *</label>
              <input
                type="email"
                value={correo}
                onChange={e => setCorreo(e.target.value)}
                className="w-full p-2 border rounded"
                required
                maxLength={150}
              />
            </div>

            <button
              type="submit"
              disabled={cargando || !nombre.trim() || !correo.trim()}
              className={`px-4 py-2 rounded font-medium ${
                cargando ? 'bg-gray-400' : 'bg-purple-600 hover:bg-purple-700'
              } text-white`}
            >
              {cargando ? 'Creando...' : 'Crear líder'}
            </button>
          </form>
        </>
      )}
    </div>
  );
}
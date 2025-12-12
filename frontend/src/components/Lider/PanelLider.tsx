import { useState, useEffect } from 'react';
import api from '../../services/api';

export default function PanelLider() {
  // Estado para departamentos
  const [departamentos, setDepartamentos] = useState<any[]>([]);
  const [cargando, setCargando] = useState(true);

  // Estado para crear miembro
  const [nuevoMiembro, setNuevoMiembro] = useState({ nombre: '', correo: '', telefono: '' });
  const [mensaje, setMensaje] = useState('');

  // Cargar departamentos
  useEffect(() => {
    api.get('/departamentos/mios')
      .then(res => {
        setDepartamentos(res.data);
        setCargando(false);
      })
      .catch(err => {
        console.error(err);
        alert('Error al cargar ministerios');
        setCargando(false);
      });
  }, []);

  // Crear miembro
  const handleCrearMiembro = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje('');

    try {
      const res = await api.post('/usuarios', nuevoMiembro);
      setMensaje(`✅ Miembro creado: ${res.data.nombre} (ID: ${res.data.id})`);
      setNuevoMiembro({ nombre: '', correo: '', telefono: '' });
    } catch (err: any) {
      const msg = err.response?.data?.error || 'Error al crear miembro';
      setMensaje(`❌ ${msg}`);
    }
  };

  if (cargando) return <div className="p-8 text-center">Cargando...</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Panel de Líder</h1>
        <button 
          onClick={() => {
            localStorage.removeItem('token');
            window.location.href = '/';
          }}
          className="text-sm text-gray-600 hover:text-gray-900"
        >
          Cerrar sesión
        </button>
      </div>

      {/* Lista de ministerios */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-3">Tus ministerios</h2>
        {departamentos.length === 0 ? (
          <p>No tienes ministerios asignados.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {departamentos.map(dep => (
              <div key={dep.id} className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-bold text-blue-700">{dep.nombre}</h3>
                <p className="text-sm text-gray-600">{dep.descripcion}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Formulario crear miembro */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">➕ Crear nuevo miembro</h2>
        
        {mensaje && (
          <div className={`mb-4 p-3 rounded ${mensaje.startsWith('✅') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {mensaje}
          </div>
        )}

        <form onSubmit={handleCrearMiembro} className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1">Nombre completo</label>
            <input
              type="text"
              value={nuevoMiembro.nombre}
              onChange={e => setNuevoMiembro({...nuevoMiembro, nombre: e.target.value})}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Correo</label>
            <input
              type="email"
              value={nuevoMiembro.correo}
              onChange={e => setNuevoMiembro({...nuevoMiembro, correo: e.target.value})}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Teléfono (opcional)</label>
            <input
              type="tel"
              value={nuevoMiembro.telefono}
              onChange={e => setNuevoMiembro({...nuevoMiembro, telefono: e.target.value})}
              className="w-full p-2 border rounded"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Crear miembro
          </button>
        </form>
      </div>
    </div>
  );
}
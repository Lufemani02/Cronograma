import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LoginAdmin() {
  const [correo, setCorreo] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // 👇 Log para verificar envío
    console.log('📌 Enviando al backend:', { correo, contraseña, rol: 'admin' });

    try {
      const response = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          correo,
          contraseña,
          rol: 'admin'  // ← único cambio vs LoginLider
        }),
      });

      const data = await response.json();
      console.log('📌 Respuesta del backend:', { status: response.status, data });

      if (!response.ok) {
        throw new Error(data.error || 'Error desconocido');
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('usuario', JSON.stringify(data.usuario));

      navigate('/admin');

    } catch (err: any) {
      setError(err.message);
      console.error('❌ Error en login admin:', err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow w-96">
        <h2 className="text-xl font-bold mb-4 text-blue-700">🔐 Iniciar sesión como Administrador</h2>

        {error && <div className="bg-red-100 text-red-700 p-2 mb-4 rounded">{error}</div>}

        <div className="mb-3">
          <label className="block text-sm mb-1">Correo</label>
          <input
            type="email"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm mb-1">Contraseña</label>
          <input
            type="password"
            value={contraseña}
            onChange={(e) => setContraseña(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Ej: lider123"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700"
        >
          Entrar como Admin
        </button>

        <button
          type="button"
          onClick={() => navigate('/')}
          className="mt-3 text-sm text-gray-600 hover:underline"
        >
          ← Cambiar rol
        </button>
      </form>
    </div>
  );
}
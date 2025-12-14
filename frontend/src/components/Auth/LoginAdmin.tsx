import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AuthLayout.css';

export default function LoginAdmin() {
  const [correo, setCorreo] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

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
          rol: 'admin'  // ← clave: rol 'admin'
        }),
      });

      const data = await response.json();
      console.log('📌 Respuesta del backend:', { status: response.status, data });

      if (!response.ok) {
        throw new Error(data.error || 'Error desconocido');
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('usuario', JSON.stringify(data.usuario));
      await new Promise(resolve => setTimeout(resolve, 10));

      navigate('/admin'); // ← ajusta si tu ruta es otra

    } catch (err: any) {
      setError(err.message);
      console.error('❌ Error en login admin:', err);
    }
  };

  return (
    <div className="login-background">
      <div className="login-card">
        <h2 className="login-title">INICIAR SESIÓN</h2>

        {/* Avatar de ADMIN (usa un ícono diferente, ej: corona o llave) */}
        <div className="avatar-container">
          <img
            src="/iconos/AdminProfile.png" // 👈 nueva imagen
            alt="Administrador"
            className="avatar"
          />
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && <div className="error-message">{error}</div>}

          {/* Campo Email */}
          <div className="input-group">
            <span className="icon">
              <img src="/iconos/email.png" alt="Correo" className="icon-img" />
            </span>
            <input
              type="email"
              placeholder="Ingrese su correo electrónico"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              required
              className="input-field"
            />
          </div>

          {/* Campo Contraseña */}
          <div className="input-group">
            <span className="icon">
              <img src="/iconos/lock.png" alt="Contraseña" className="icon-img" />
            </span>
            <input
              type="password"
              placeholder="Ingrese su contraseña"
              value={contraseña}
              onChange={(e) => setContraseña(e.target.value)}
              required
              className="input-field"
            />
          </div>

          {/* Recordar datos + Recuperar contraseña */}
          <div className="options-row">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
              />
              Recordar datos
            </label>
            <a href="#" className="forgot-password">
              Recuperar contraseña
            </a>
          </div>

          {/* Botón Iniciar */}
          <button type="submit" className="login-button">
            Entrar
          </button>

          {/* Cambiar rol */}
          <button
            type="button"
            onClick={() => navigate('/')}
            className="change-role-button"
          >
            ← Cambiar rol
          </button>
        </form>
      </div>
    </div>
  );
}
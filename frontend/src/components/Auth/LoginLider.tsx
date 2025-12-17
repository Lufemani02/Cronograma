import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AuthLayout.css';
import api from '../../services/api';

export default function LoginLider() {
  const [correo, setCorreo] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // 👇 Log para verificar qué se envía
    console.log('📌 Enviando al backend:', { correo, contraseña, rol: 'lider' });
    
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          correo,
          contraseña,
          rol: 'lider'  
        }),
      });

      const data = await response.json();

      console.log('📌 Respuesta del backend:', { status: response.status, data });

      if (!response.ok) {
        throw new Error(data.error || 'Error desconocido');
      }

      // Guardar en localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('usuario', JSON.stringify(data.usuario));
      // Esperar un tick para que localStorage se actualice
      await new Promise(resolve => setTimeout(resolve, 10));

      // Luego redirigir
      navigate('/panel-lider');

    } catch (err: any) {
      setError(err.message);
      console.error('❌ Error en login:', err);
    }
  };
   
  return (
    <div className="login-background">
      <div className="login-card">
        <h2 className="login-title">INICIAR SESIÓN</h2>

        {/* Avatar */}
        <div className="avatar-container">
          <img
            src="/iconos/Perfil.png" // Reemplaza con tu imagen local
            alt="Avatar"
            className="avatar"
          />
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && <div className="bg-red-100 text-red-700 p-2 mb-4 rounded">{error}</div>}
          {/* Campo Email */}
          <div className="input-group">
            <span className="icon">
              <img src="/iconos/email.png" alt="Correo" className="icon" />
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
              <img src="/iconos/lock.png" alt="Correo" className="icon" />
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

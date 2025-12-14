import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SelectorRol: React.FC = () => {
  const [rolSeleccionado, setRolSeleccionado] = useState<'admin' | 'lider' | ''>('');
  const navigate = useNavigate();

  // Definimos los departamentos con sus datos
  const departamentos = [
    {
      id: 'comunicaciones',
      nombre: 'Comunicaciones',
      img: '/departamentos/Comunicaciones.png'
    },
    {
      id: 'iglesia-infantil',
      nombre: 'Iglesia Infantil - Maestros',
      img: '/departamentos/IglesiaInfantil.png'
    },
    {
      id: 'ujieres',
      nombre: 'Ujieres',
      img: '/departamentos/Ujieres.png'
    },
    {
      id: 'musica',
      nombre: 'Música',
      img: '/departamentos/Musica.png'
    }
  ];

  const handleDepartamentoClick = (departamentoId: string) => {
  if (rolSeleccionado !== 'lider') {
    alert('Por favor, selecciona "Líder de comité" primero.');
    return;
  }

  navigate(`/login/lider?dept=${departamentoId}`);
};

  return (
    <div className="selector-rol-container">
      {/* Menú desplegable de rol */}
      <div className="role-selector">
        <select
          value=""
          onChange={(e) => {
            const valor = e.target.value;
            if (valor === 'admin') {
              // Ir directo al login de admin (sin dept)
              navigate('/login/admin');
            } else if (valor === 'lider') {
              // Quedarse acá y marcar rol como líder
              setRolSeleccionado('lider');
            }
            // Reset select para que muestre "Seleccione Rol..." otra vez
            e.target.value = '';
          }}
          className="role-dropdown"
        >
          <option value="" disabled>
            Seleccione Rol...
          </option>
          <option value="admin">Administrador</option>
          <option value="lider">Líder de comité</option>
        </select>
      </div>

      {/* Título principal */}
      <h1 className="main-title">SISTEMA DE GESTIÓN<br />DE CRONOGRAMAS IPUC</h1>

      {/* Subtítulo */}
      <h2 className="subtitle">ELIGE TU DEPARTAMENTO</h2>

      {/* Departamentos */}
      <div className="departamentos-grid">
        {departamentos.map((dept) => (
          <div
            key={dept.id}
            className="departamento-card"
            onClick={() => handleDepartamentoClick(dept.id)}
          >
            <div className="dept-background" style={{ backgroundImage: `url(${dept.img})` }}></div>
            <div className="dept-name">{dept.nombre}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SelectorRol;
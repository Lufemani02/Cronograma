import { Routes, Route } from 'react-router-dom';
import LoginForm from './components/Auth/LoginForm';
import PanelLider from './components/Lider/PanelLider';
import AdminLayout from './components/Admin/AdminLayout';
import Dashboard from './components/Admin/Dashboard';
import CrearDepartamento from './components/Admin/CrearDepartamento';
import CrearLider from './components/Admin/CrearLider';
import CrearMiembro from './components/Admin/CrearMiembro';
import AsignarMiembro from './components/Admin/AsignarMiembro';
import CrearTarea from './components/Admin/CrearTarea';
/*import Dashboard from './components/Admin/Dashboard';*/


export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route path="/admin/lideres/crear" element={<CrearLider />} />
        <Route path="/admin/miembros/crear" element={<CrearMiembro />} />
        <Route path="/admin/departamentos/crear" element={<CrearDepartamento />} />
        <Route path="/admin/asignar" element={<AsignarMiembro />} />
        <Route path="/admin/tareas/crear" element={<CrearTarea />} />
        <Route path="/admin" element={<Dashboard />} />
        <Route path="/admin" element={
          <AdminLayout>
            <div>Contenido del admin</div>
          </AdminLayout>
        } /> 
        <Route path="/" element={<LoginForm />} />
        <Route path="/panel-lider" element={<PanelLider />} />
      </Routes>
      
             
        {/*<Route path="/admin/*" element={
        <AdminLayout>
          <Routes>
            <Route index element={<Dashboard />} />
            <Route path="departamentos" element={<div>Lista + Formulario</div>} />
            <Route path="miembros" element={<div>Lista + Formulario</div>} />
            <Route path="lideres" element={<div>Formulario crear líder</div>} />
            <Route path="asignar" element={<div>Asignar miembro a depto</div>} />
          </Routes>
        </AdminLayout>
      } />*/}
    </div>
  );
}
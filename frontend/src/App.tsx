import { Routes, Route } from 'react-router-dom';
import PanelLider from './components/Lider/PanelLider';
import LoginLider from './components/Auth/LoginLider';
import LoginAdmin from './components/Auth/LoginAdmin';
import AdminLayout from './components/Admin/AdminLayout';
import Dashboard from './components/Admin/Dashboard';
import CrearDepartamento from './components/Admin/CrearDepartamento';
import CrearLider from './components/Admin/CrearLider';
import CrearMiembro from './components/Admin/CrearMiembro';
import AsignarMiembro from './components/Admin/AsignarMiembro';
import CrearTarea from './components/Admin/CrearTarea';
import SelectorRol from './components/Auth/SelectorRol';
import AsignarCronograma from './components/Lider/AsignarCronograma';
import CronogramaMes from './components/Lider/CronogramaMes';


export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 App">
      <Routes>
        <Route path="/" element={<SelectorRol/>} />
        <Route path="/selector-rol" element={<SelectorRol/>} />
        <Route path="/panel-lider" element={<PanelLider />} />
        <Route path="/login/lider" element={<LoginLider />} />
        <Route path="/login/admin" element={<LoginAdmin />} />
        <Route path="/admin/lideres/crear" element={<CrearLider />} />
        <Route path="/admin/miembros/crear" element={<CrearMiembro />} />
        <Route path="/admin/departamentos/crear" element={<CrearDepartamento />} />
        <Route path="/admin/asignar" element={<AsignarMiembro />} />
        <Route path="/panel-lider/asignar" element={<AsignarCronograma />} />
        <Route path="/panel-lider/cronograma" element={<CronogramaMes />} />
        <Route path="/admin/tareas/crear" element={<CrearTarea />} />
        <Route path="/admin" element={<AdminLayout><Dashboard /></AdminLayout>} />
      </Routes>
    </div>
  );
}
// frontend/src/components/Admin/AdminLayout.tsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('⚠️ Sesión requerida. Redirigiendo al login...');
      navigate('/');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-700 text-white p-4">
        <h1 className="text-xl font-bold">⛪ Panel de Administrador</h1>
      </header>
      <main className="p-6">
        {children}
      </main>
    </div>
  );
}
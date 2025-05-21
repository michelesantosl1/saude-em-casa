// src/app/admin/layout.js
import Sidebar from './components/Sidebar'; 

export default function AdminLayout({ children }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      {/* Conteúdo com cor de fundo */}
      <main className="flex-1 p-6 bg-green-400">{children}</main>
    </div>
  );
}

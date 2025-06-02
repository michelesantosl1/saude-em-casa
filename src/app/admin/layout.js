// src/app/admin/layout.js
import Sidebar from './components/Sidebar';

export default function AdminLayout({ children }) {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-6 bg-gradient-to-tr from-pink-50 via-yellow-50 to-blue-50">
        {children}
      </main>
    </div>
  );
}

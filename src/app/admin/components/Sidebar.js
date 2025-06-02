'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Home,
  Users,
  CalendarPlus,
  UserPlus,
  LogOut,
  Menu,
  ClipboardPlus,
} from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { name: 'Painel', href: '/admin/painel', icon: <Home className="w-5 h-5" /> },
  { name: 'Profissionais', href: '/admin/profissionais', icon: <Users className="w-5 h-5" /> },
  { name: 'Cadastrar', href: '/admin/profissionais/novo', icon: <UserPlus className="w-5 h-5" /> },
  { name: 'Nova Tarefa', href: '/admin/tarefas/nova', icon: <CalendarPlus className="w-5 h-5" /> },
  { name: 'Novo Serviço', href: '/admin/tipos-de-servico/novo', icon: <ClipboardPlus className="w-5 h-5" /> },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('usuario'); 
    router.push('/login');
  };

  const handleNavClick = () => {
    if (window.innerWidth < 768) setIsOpen(false);
  };

  return (
    <>
      {/* Botão mobile */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden p-4 text-blue-600 fixed top-0 left-0 z-50"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Overlay para mobile */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black opacity-40 z-30 md:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed z-40 bg-white h-screen w-64 border-r shadow-md transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static md:block`}
      >
        <div className="flex flex-col h-full p-4">
          <div className="text-2xl font-bold mb-6 text-blue-600">Saúde em Casa</div>

          {/* Menu de navegação */}
          <nav className="flex flex-col gap-2 flex-1">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} onClick={handleNavClick}>
                <div
                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-blue-100 ${
                    pathname === item.href ? 'bg-blue-100 text-blue-700' : 'text-gray-700'
                  }`}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </div>
              </Link>
            ))}
          </nav>

          {/* Botão Sair */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 p-3 rounded-lg text-red-600 hover:bg-red-100"
          >
            <LogOut className="w-5 h-5" />
            Sair
          </button>
        </div>
      </aside>
    </>
  );
}

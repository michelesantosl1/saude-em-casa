'use client';

import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      {/* Nome como logotipo */}
      <div className="text-4xl font-extrabold text-green-600 mb-6">
        Saúde em Casa
      </div>

      <h1 className="text-3xl font-bold text-gray-800 mb-2">
        Bem-vindo ao Saúde em Casa
      </h1>

      <p className="text-gray-600 mb-8 text-center max-w-md">
        Organize e acompanhe os atendimentos domiciliares com eficiência e simplicidade.
      </p>

      <button
        onClick={() => router.push('/login')}
        className="px-6 py-3 bg-green-600 text-white rounded-full shadow hover:bg-green-700 transition"
      >
        Iniciar Sessão
      </button>
    </div>
  );
}

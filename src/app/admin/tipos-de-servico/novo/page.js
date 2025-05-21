'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function NovoTipoServico() {
  const router = useRouter();
  const [nome, setNome] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [erro, setErro] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setMensagem('');
    setErro('');

    const { error } = await supabase.from('tipos_servico').insert([{ nome }]);

    if (error) {
      console.error('Erro ao salvar tipo de serviço:', error);
      setErro('❌ Erro ao salvar o tipo de serviço.');
    } else {
      setMensagem('✅ Tipo de serviço cadastrado com sucesso!');
      setTimeout(() => {
        router.push('/tipos-servico');
      }, 2000);
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10 bg-white shadow-md rounded-xl p-6 border border-gray-200">
      <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
        Novo Tipo de Serviço
      </h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nome do serviço
          </label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
            placeholder="Ex: Atendimento domiciliar"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 transition-colors text-white font-semibold py-2 rounded-lg shadow"
        >
          Salvar
        </button>
      </form>

      {mensagem && (
        <p className="mt-4 text-green-600 text-center font-medium">{mensagem}</p>
      )}
      {erro && (
        <p className="mt-4 text-red-600 text-center font-medium">{erro}</p>
      )}
    </div>
  );
}

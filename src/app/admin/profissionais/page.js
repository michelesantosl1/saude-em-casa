'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Trash } from 'lucide-react';

export default function ListaProfissionais() {
  const [profissionais, setProfissionais] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarProfissionais();
  }, []);

  async function carregarProfissionais() {
    setLoading(true);
    const { data, error } = await supabase
      .from('profissionais')
      .select('id, nome, telefone, especialidade');

    if (error) {
      console.error('Erro ao buscar profissionais:', error);
    } else {
      setProfissionais(data);
    }

    setLoading(false);
  }

  async function deletarProfissional(id) {
    const confirmar = window.confirm('Tem certeza que deseja excluir este profissional?');

    if (!confirmar) return;

    const { error } = await supabase
      .from('profissionais')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erro ao deletar profissional:', error);
      alert('Erro ao deletar profissional.');
    } else {
      setProfissionais(profissionais.filter((prof) => prof.id !== id));
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-40">
        <span className="text-gray-600">🔄 Carregando profissionais...</span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Profissionais Cadastrados
      </h1>

      {profissionais.length === 0 ? (
        <p className="text-center text-gray-500">Nenhum profissional encontrado.</p>
      ) : (
        <ul className="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
          {profissionais.map((prof) => (
            <li
              key={prof.id}
              className="relative border border-gray-200 rounded-2xl shadow-sm p-5 bg-white hover:shadow-md transition"
            >
              {/* Botão de Lixeira com ícone Trash */}
              <button
                onClick={() => deletarProfissional(prof.id)}
                className="absolute top-3 right-3 text-red-500 hover:text-red-700"
                title="Excluir profissional"
              >
                <Trash size={18} />
              </button>

              <h2 className="text-xl font-semibold text-black mb-2">{prof.nome}</h2>
              <p className="text-gray-700">
                <strong>📞 Telefone:</strong> {prof.telefone}
              </p>
              <p className="text-gray-700">
                <strong>💼 Especialidade:</strong> {prof.especialidade}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

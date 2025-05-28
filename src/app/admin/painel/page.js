'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Trash } from 'lucide-react';

export default function PainelAdmin() {
  const [tarefas, setTarefas] = useState([]);
  const [filtro, setFiltro] = useState('todos');
  const [busca, setBusca] = useState('');
  const [loading, setLoading] = useState(true);
  const [mensagem, setMensagem] = useState('');

  useEffect(() => {
    async function carregarTarefas() {
      const { data, error } = await supabase
        .from('tarefas')
        .select(`
          id,
          data_hora,
          local,
          status,
          profissionais (id, nome, link_unico),
          tipos_servico:tipo_servico_id (nome)
        `)
        .order('data_hora', { ascending: true });

      if (error) {
        console.error('Erro ao buscar tarefas:', error);
      } else {
        setTarefas(data);
      }

      setLoading(false);
    }

    carregarTarefas();
  }, []);

  async function excluirTarefa(id) {
    const confirmar = confirm('Tem certeza que deseja excluir esta tarefa?');
    if (!confirmar) return;

    const { error } = await supabase.from('tarefas').delete().eq('id', id);

    if (error) {
      console.error('Erro ao excluir:', error);
      setMensagem('Erro ao excluir tarefa.');
    } else {
      setTarefas((prev) => prev.filter((t) => t.id !== id));
      setMensagem('Tarefa excluída com sucesso!');
    }

    setTimeout(() => setMensagem(''), 2000);
  }

  const tarefasFiltradas =
    filtro === 'todos' ? tarefas : tarefas.filter((t) => t.status === filtro);

  const tarefasBuscadas = tarefasFiltradas.filter((t) =>
    t.profissionais?.nome?.toLowerCase().includes(busca.toLowerCase())
  );

  if (loading)
    return <div className="p-4 text-center text-gray-500">Carregando tarefas...</div>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Painel de Tarefas
      </h1>

      {/* Filtros */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div className="space-x-2 text-center">
          <button
            onClick={() => setFiltro('todos')}
            className={`px-4 py-2 rounded-full ${
              filtro === 'todos' ? 'bg-gray-800 text-white' : 'bg-gray-600'
            }`}
          >
            Todos
          </button>
          <button
            onClick={() => setFiltro('pendente')}
            className={`px-4 py-2 rounded-full ${
              filtro === 'pendente' ? 'bg-yellow-500 text-white' : 'bg-yellow-600'
            }`}
          >
            Pendentes
          </button>
          <button
            onClick={() => setFiltro('concluida')}
            className={`px-4 py-2 rounded-full ${
              filtro === 'concluida' ? 'bg-green-800 text-white' : 'bg-green-600'
            }`}
          >
            Concluídas
          </button>
        </div>

        <input
          type="text"
          placeholder="Buscar por profissional..."
          className="border border-gray-300 rounded-full px-4 py-2 w-full md:w-80"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
      </div>

      {mensagem && (
        <p className="text-center text-green-600 mb-4">{mensagem}</p>
      )}

      {tarefasBuscadas.length === 0 ? (
        <p className="text-gray-500 text-center">Nenhuma tarefa encontrada.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tarefasBuscadas.map((tarefa) => (
            <div
              key={tarefa.id}
              className="bg-white border rounded-2xl p-5 shadow hover:shadow-lg transition relative"
            >
              {/* Lixeira */}
              <button
                onClick={() => excluirTarefa(tarefa.id)}
                className="absolute top-3 right-3 text-red-500 hover:text-red-700"
                title="Excluir tarefa"
              >
                <Trash size={18} />
              </button>

              <p className="text-lg font-semibold text-gray-700 mb-2">
                {tarefa.profissionais?.nome || 'Profissional não atribuído'}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Data:</strong> {new Date(tarefa.data_hora).toLocaleString()}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Local:</strong> {tarefa.local}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Serviço:</strong> {tarefa.tipos_servico?.nome || 'Indefinido'}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Status:</strong>{' '}
                <span
                  className={`px-2 py-1 rounded-full text-white text-xs ${
                    tarefa.status === 'concluida'
                      ? 'bg-green-500'
                      : tarefa.status === 'pendente'
                      ? 'bg-yellow-500'
                      : 'bg-gray-600'
                  }`}
                >
                  {tarefa.status}
                </span>
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { LogOut } from 'lucide-react';

export default function PaginaProfissional({ linkUnico }) {
  const [tarefas, setTarefas] = useState([]);
  const [tarefasFiltradas, setTarefasFiltradas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusMsg, setStatusMsg] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('todos');

  useEffect(() => {
    if (linkUnico) {
      buscarTarefasDoProfissional();
    }
  }, [linkUnico]);

  useEffect(() => {
    aplicarFiltro();
  }, [filtroStatus, tarefas]);

  async function buscarTarefasDoProfissional() {
    setLoading(true);
    setStatusMsg('');

    const { data: profissional, error: erroProf } = await supabase
      .from('profissionais')
      .select('id')
      .eq('link_unico', linkUnico)
      .single();

    if (erroProf || !profissional) {
      console.error('Profissional não encontrado:', erroProf);
      setLoading(false);
      return;
    }

    const { data: tarefas, error: erroTarefas } = await supabase
      .from('tarefas')
      .select('*, tipos_servico (nome)')
      .eq('profissional_id', profissional.id)
      .order('data_hora', { ascending: true });

    if (erroTarefas) {
      console.error('Erro ao buscar tarefas:', erroTarefas);
    } else {
      setTarefas(tarefas);
    }

    setLoading(false);
  }

  async function atualizarStatus(tarefaId, novoStatus) {
    const { error } = await supabase
      .from('tarefas')
      .update({ status: novoStatus })
      .eq('id', tarefaId);

    if (error) {
      console.error('Erro ao atualizar status:', error);
      setStatusMsg('Erro ao atualizar status.');
    } else {
      setTarefas((prev) =>
        prev.map((t) =>
          t.id === tarefaId ? { ...t, status: novoStatus } : t
        )
      );
      setStatusMsg('Status atualizado com sucesso!');
      setTimeout(() => setStatusMsg(''), 2000);
    }
  }

  function aplicarFiltro() {
    if (filtroStatus === 'todos') {
      setTarefasFiltradas(tarefas);
    } else {
      setTarefasFiltradas(tarefas.filter(t => t.status === filtroStatus));
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-tr from-pink-50 via-yellow-50 to-blue-50 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-center mt-10 mb-6 text-gray-800">
          Tarefas do Profissional
        </h1>

        <div className="flex justify-between items-center mb-6">
          <div className="space-x-2">
            <button
              onClick={() => setFiltroStatus('todos')}
              className={`px-3 py-1 rounded text-sm font-medium ${
                filtroStatus === 'todos' ? 'bg-gray-800 text-white' : 'bg-gray-600 text-white'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setFiltroStatus('pendente')}
              className={`px-3 py-1 rounded text-sm font-medium ${
                filtroStatus === 'pendente' ? 'bg-yellow-500 text-white' : 'bg-yellow-600 text-white'
              }`}
            >
              Pendentes
            </button>
            <button
              onClick={() => setFiltroStatus('concluida')}
              className={`px-3 py-1 rounded text-sm font-medium ${
                filtroStatus === 'concluida' ? 'bg-green-800 text-white' : 'bg-green-600 text-white'
              }`}
            >
              Concluídas
            </button>
          </div>

          <button
            onClick={buscarTarefasDoProfissional}
            className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded text-sm font-medium"
          >
            Atualizar tarefas
          </button>
        </div>

        {loading ? (
          <p className="text-center text-gray-600">Carregando tarefas...</p>
        ) : tarefasFiltradas.length === 0 ? (
          <p className="text-center text-gray-600">Nenhuma tarefa encontrada.</p>
        ) : (
          <div className="space-y-6">
            {tarefasFiltradas.map((tarefa) => (
              <div
                key={tarefa.id}
                className="bg-white border border-gray-200 rounded-lg shadow-sm p-5"
              >
                <div className="space-y-1 text-gray-700">
                  <p><strong>Data:</strong> {new Date(tarefa.data_hora).toLocaleString()}</p>
                  <p><strong>Local:</strong> {tarefa.local}</p>
                  <p><strong>Serviço:</strong> {tarefa.tipos_servico?.nome || 'N/A'}</p>
                  <p><strong>Status atual:</strong> {tarefa.status}</p>
                </div>

                <div className="mt-4 flex gap-6">
                  <label className="flex items-center gap-2 text-sm text-gray-600">
                    <input
                      type="radio"
                      name={`status-${tarefa.id}`}
                      checked={tarefa.status === 'pendente'}
                      onChange={() => atualizarStatus(tarefa.id, 'pendente')}
                      className="accent-yellow-500"
                    />
                    Pendente
                  </label>

                  <label className="flex items-center gap-2 text-sm text-gray-600">
                    <input
                      type="radio"
                      name={`status-${tarefa.id}`}
                      checked={tarefa.status === 'concluida'}
                      onChange={() => atualizarStatus(tarefa.id, 'concluida')}
                      className="accent-green-600"
                    />
                    Concluída
                  </label>
                </div>
              </div>
            ))}
          </div>
        )}

        {statusMsg && (
          <p className="mt-6 text-center font-medium text-blue-700">
            {statusMsg}
          </p>
        )}
      </div>

      {/* Botão de logout fixo */}
      <button
        onClick={() => {
          localStorage.removeItem('usuario');
          window.location.href = '/login';
        }}
        className="fixed top-4 right-4 z-50 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full shadow-md text-sm font-medium flex items-center gap-2"
      >
        <LogOut className="w-4 h-4" />
        Sair
      </button>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function NovaTarefa() {
  const router = useRouter();

  const [dataHora, setDataHora] = useState('');
  const [local, setLocal] = useState('');
  const [tipoServicoId, setTipoServicoId] = useState('');
  const [status, setStatus] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [profissionalId, setProfissionalId] = useState('');

  const [profissionais, setProfissionais] = useState([]);
  const [tiposServico, setTiposServico] = useState([]);

  useEffect(() => {
    async function buscarProfissionais() {
      const { data, error } = await supabase
        .from('profissionais')
        .select('id, nome');
      if (error) {
        console.error('Erro ao buscar profissionais:', error);
      } else {
        setProfissionais(data);
      }
    }

    buscarProfissionais();
  }, []);

  useEffect(() => {
    async function buscarTiposServico() {
      const { data, error } = await supabase
        .from('tipos_servico')
        .select('id, nome');
      if (error) {
        console.error('Erro ao buscar tipos de serviço:', error);
      } else {
        setTiposServico(data);
      }
    }

    buscarTiposServico();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();

    const tarefa = {
      data_hora: dataHora,
      local,
      tipo_servico_id: tipoServicoId,
      status: status || 'pendente',
      observacoes,
      profissional_id: profissionalId || null,
    };

    const { error } = await supabase.from('tarefas').insert([tarefa]);

    if (error) {
      console.error('❌ Erro ao salvar tarefa:', JSON.stringify(error, null, 2));
      alert('Erro ao salvar tarefa. Veja o console para detalhes.');
    } else {
      alert('✅ Tarefa criada com sucesso!');
      router.push('/admin/painel');
    }
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-md rounded-md">
      <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">Nova Tarefa</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Data e Hora</label>
          <input
            type="datetime-local"
            value={dataHora}
            onChange={(e) => setDataHora(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-md px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Local</label>
          <input
            type="text"
            value={local}
            onChange={(e) => setLocal(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-md px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Serviço</label>
          <select
            value={tipoServicoId}
            onChange={(e) => setTipoServicoId(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-md px-3 py-2"
          >
            <option value="">-- Selecione --</option>
            {tiposServico.map((tipo) => (
              <option key={tipo.id} value={tipo.id}>
                {tipo.nome}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Observações</label>
          <textarea
            value={observacoes}
            onChange={(e) => setObservacoes(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 min-h-[100px]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Profissional</label>
          <select
            value={profissionalId}
            onChange={(e) => setProfissionalId(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
          >
            <option value="">-- Selecione --</option>
            {profissionais.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nome}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 text-white font-medium py-2 rounded-md hover:bg-green-700 transition-colors"
        >
          Salvar Tarefa
        </button>
      </form>
    </div>
  );
}

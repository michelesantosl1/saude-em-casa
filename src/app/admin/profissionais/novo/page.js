'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { v4 as uuidv4 } from 'uuid'
import bcrypt from 'bcryptjs'
import { supabase } from '@/lib/supabaseClient'

export default function NovoProfissional() {
  const [nome, setNome] = useState('')
  const [telefone, setTelefone] = useState('')
  const [especialidade, setEspecialidade] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const router = useRouter()

const handleSubmit = async (e) => {
  e.preventDefault();

  // Verifica se o e-mail já está cadastrado na tabela `usuarios`
  const { data: emailExistente, error: emailCheckError } = await supabase
    .from('usuarios')
    .select('id')
    .eq('email', email)
    .single();

  if (emailExistente) {
    alert('❌ Já existe um profissional com esse e-mail cadastrado.');
    return;
  }

  const link_unico = uuidv4();

  const { data: profissional, error: profError } = await supabase
    .from('profissionais')
    .insert([{ nome, telefone, especialidade, email, link_unico }])
    .select()
    .single();

  if (profError) {
    console.error(profError);
    alert('Erro ao cadastrar profissional.');
    return;
  }

  try {
    const response = await fetch('/api/enviar-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, nome, senha }),
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'Erro ao enviar e-mail');
  } catch (err) {
    console.error('Erro ao enviar o e-mail:', err);
    alert('Profissional cadastrado, mas houve um erro ao enviar o e-mail.');
  }

  const senha_hash = await bcrypt.hash(senha, 10);

  const { data: userData, error: userError } = await supabase
    .from('usuarios')
    .insert([{ email, senha_hash, tipo: 'profissional', ref_id: profissional.id }])
    .select()
    .single();

  if (userError) {
    console.error('Erro ao criar login do profissional:', userError);
    alert('Erro ao criar login do profissional.');
    return;
  }

  alert('✅ Profissional cadastrado com sucesso!');
  router.push('/admin/profissionais');
};

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-md rounded-md">
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Cadastrar Novo Profissional</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
    <input
      className="w-full p-2 border border-gray-300 rounded-md text-gray-800 placeholder-gray-500"
      value={nome}
      onChange={e => setNome(e.target.value)}
      placeholder="Digite o nome"
      required
    />
  </div>

  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
    <input
      className="w-full p-2 border border-gray-300 rounded-md text-gray-800 placeholder-gray-500"
      value={telefone}
      onChange={e => setTelefone(e.target.value)}
      placeholder="Digite o telefone"
      required
    />
  </div>

  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">Especialidade</label>
    <input
      className="w-full p-2 border border-gray-300 rounded-md text-gray-800 placeholder-gray-500"
      value={especialidade}
      onChange={e => setEspecialidade(e.target.value)}
      placeholder="Ex: Fisioterapia"
      required
    />
  </div>

  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
    <input
      type="email"
      className="w-full p-2 border border-gray-300 rounded-md text-gray-800 placeholder-gray-500"
      value={email}
      onChange={e => setEmail(e.target.value)}
      placeholder="exemplo@dominio.com"
      required
    />
  </div>

  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
    <input
      type="password"
      className="w-full p-2 border border-gray-300 rounded-md text-gray-800 placeholder-gray-500"
      value={senha}
      onChange={e => setSenha(e.target.value)}
      placeholder="Digite uma senha segura"
      required
    />
  </div>

  <button
    type="submit"
    className="w-full bg-green-600 text-white p-2 rounded-md hover:bg-green-700 transition-colors"
  >
    Salvar
  </button>
</form>

    </div>
  )
}

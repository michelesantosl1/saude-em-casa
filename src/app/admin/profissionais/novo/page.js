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
    e.preventDefault()
    const link_unico = uuidv4()

    const { data: profissional, error: profError } = await supabase
      .from('profissionais')
      .insert([{ nome, telefone, especialidade, email, link_unico }])
      .select()
      .single()

    if (profError) {
      console.error(profError)
      alert('Erro ao cadastrar profissional.')
      return
    }

    const senha_hash = await bcrypt.hash(senha, 10)

    const { data: userData, error: userError } = await supabase
      .from('usuarios')
      .insert([{ email, senha_hash, tipo: 'profissional', ref_id: profissional.id }])
      .select()
      .single()

    if (userError) {
      console.error('Erro ao criar login do profissional:', JSON.stringify(userError, null, 2))
      alert('Erro ao criar login do profissional.')
      return
    }

    alert('✅ Profissional cadastrado com sucesso!')
    router.push('/admin/profissionais')
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-md rounded-md">
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Cadastrar Novo Profissional</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="w-full p-2 border border-gray-300 rounded-md"
          value={nome}
          onChange={e => setNome(e.target.value)}
          placeholder="Nome"
          required
        />
        <input
          className="w-full p-2 border border-gray-300 rounded-md"
          value={telefone}
          onChange={e => setTelefone(e.target.value)}
          placeholder="Telefone"
          required
        />
        <input
          className="w-full p-2 border border-gray-300 rounded-md"
          value={especialidade}
          onChange={e => setEspecialidade(e.target.value)}
          placeholder="Especialidade"
          required
        />
        <input
          className="w-full p-2 border border-gray-300 rounded-md"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Email"
          type="email"
          required
        />
        <input
          className="w-full p-2 border border-gray-300 rounded-md"
          value={senha}
          onChange={e => setSenha(e.target.value)}
          placeholder="Senha"
          type="password"
          required
        />
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

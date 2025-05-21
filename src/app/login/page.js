'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import bcrypt from 'bcryptjs'
import { supabase } from '@/lib/supabaseClient'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const router = useRouter()

  const handleLogin = async (e) => {
    e.preventDefault()
    setErro('')

    const { data: usuario, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('email', email)
      .single()

    if (!usuario || !usuario.senha_hash) {
      setErro('Usuário não encontrado ou senha incorreta.')
      return
    }

    try {
      const senhaOk = await bcrypt.compare(senha, usuario.senha_hash)

      if (!senhaOk) {
        setErro('Senha incorreta.')
        return
      }

      localStorage.setItem('usuario', JSON.stringify(usuario))

      if (usuario.tipo === 'admin') {
        router.push('/admin')
      } else {
        const { data: profissional } = await supabase
          .from('profissionais')
          .select('link_unico')
          .eq('id', usuario.ref_id)
          .single()

        router.push(`/profissional/${profissional.link_unico}`)
      }

    } catch (err) {
      console.error('Erro ao comparar senha:', err)
      setErro('Erro ao verificar a senha.')
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-2xl font-bold text-center text-green-600 mb-6">
          Entrar no Saúde em Casa
        </h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Email"
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="password"
            value={senha}
            onChange={e => setSenha(e.target.value)}
            placeholder="Senha"
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {erro && (
            <p className="text-red-500 text-sm text-center">{erro}</p>
          )}
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  )
}

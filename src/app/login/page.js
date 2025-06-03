'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const router = useRouter()

  const handleLogin = async (e) => {
  e.preventDefault()
  setErro('')

  try {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, senha })
    })

    const data = await res.json()

    if (!res.ok) {
      setErro(data.error || 'Erro ao fazer login.')
      return
    }

    // Redireciona com base na resposta da API (não tenta decodificar o token httpOnly!)
    if (data.tipo === 'admin') {
      router.push('/admin')
    } else if (data.tipo === 'profissional' && data.link_unico) {
      router.push(`/profissional/${data.link_unico}`)
    } else {
      setErro('Tipo de usuário inválido ou link não encontrado.')
    }

  } catch (err) {
    console.error('Erro no login:', err)
    setErro('Erro ao fazer login. Tente novamente.')
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

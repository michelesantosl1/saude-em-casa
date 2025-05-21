'use client'

export default function AdminLogin() {
  return (
    <div className="min-h-screen flex items-center justify-center ">
      <div className="max-w-xl w-full bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-3xl font-bold text-green-600 mb-4 text-center">
          Bem-vindo ao Painel Administrativo
        </h1>

        <p className="text-gray-700 text-center">
          Utilize o menu lateral para acessar as funcionalidades do sistema. 
          Aqui você pode gerenciar os atendimentos, profissionais e acompanhar o desempenho da plataforma.
        </p>
      </div>
    </div>
  )
}

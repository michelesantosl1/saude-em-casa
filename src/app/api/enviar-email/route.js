import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
  const { email, nome, senha } = await req.json();

  try {
    const { data, error } = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: email,
      subject: 'Seus dados de acesso - Saúde em Casa',
      html: `
        <p>Olá, ${nome}!</p>
        <p>Você foi cadastrado como profissional no sistema <strong>Saúde em Casa</strong>.</p>
        <p><strong>Credenciais:</strong></p>
        <ul>
          <li><strong>Email:</strong> ${email}</li>
          <li><strong>Senha:</strong> ${senha}</li>
        </ul>
        <p>Acesse sua página de login pelo link abaixo:</p>
        <p><a href="https://saude-em-casa.vercel.app/" target="_blank">https://saude-em-casa.vercel.app/</a></p>
        <p>Atenciosamente,<br/>Equipe Saúde em Casa</p>
      `,
    });

    if (error) return NextResponse.json({ error }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Erro ao enviar com Resend:', JSON.stringify(err, null, 2));
    return NextResponse.json({ error: err.message || 'Erro desconhecido' }, { status: 500 });
  }
}

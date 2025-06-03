import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';
import bcrypt from 'bcryptjs';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(req) {
  const { email, senha } = await req.json();

  const { data: usuario, error } = await supabase
    .from('usuarios')
    .select('*')
    .eq('email', email)
    .single();

  if (!usuario || error) {
    return NextResponse.json({ error: 'Usuário ou senha inválidos' }, { status: 401 });
  }

  const senhaValida = await bcrypt.compare(senha, usuario.senha_hash);
  if (!senhaValida) {
    return NextResponse.json({ error: 'Usuário ou senha inválidos' }, { status: 401 });
  }

  // Buscar dados adicionais se profissional
  let link_unico = null;
  if (usuario.tipo === 'profissional') {
    const { data: prof } = await supabase
      .from('profissionais')
      .select('link_unico')
      .eq('id', usuario.ref_id)
      .single();
    link_unico = prof?.link_unico || '';
  }

  const token = jwt.sign(
  {
    id: usuario.id,
    email: usuario.email,
    tipo: usuario.tipo,
    link_unico: usuario.link_unico, // <== importante!
  },
  process.env.JWT_SECRET,
  { expiresIn: '1d' }
);


  const response = NextResponse.json({
    success: true,
    tipo: usuario.tipo,
    link_unico,
  });

  response.headers.set(
    'Set-Cookie',
    serialize('auth_token', token, {
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24,
      sameSite: 'lax',
      secure: false, // true em produção
    })
  );

  return response;
}

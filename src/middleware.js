import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const PROTECTED_ROUTES = true; // protege tudo, exceto o que for explicitamente ignorado no matcher

export async function middleware(req) {
  const token = req.cookies.get('auth_token')?.value;

  // Se não houver token, redireciona
  if (!token) {
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = '/login';
    return NextResponse.redirect(loginUrl);
  }

  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET)
    );

    return NextResponse.next();
  } catch (err) {
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = '/login';
    return NextResponse.redirect(loginUrl);
  }
}

// Protege todas as rotas, exceto as públicas
export const config = {
  matcher: [
    // ignora:
    // - arquivos internos (_next)
    // - API routes (/api)
    // - login
    // - raiz (opcional)
    '/((?!_next/static|_next/image|favicon.ico|api|login|$).*)',
  ],
};

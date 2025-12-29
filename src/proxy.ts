import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function proxy(request: NextRequest) {
    let response = NextResponse.next({
        request: { headers: request.headers },
    });

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

    // Fail-safe para evitar o crash de build/runtime
    if (!url || !key) {
        console.error("❌ Supabase Env Variables are missing!");
        return response;
    }

    const supabase = createServerClient(url, key, {
        cookies: {
            getAll: () => request.cookies.getAll(),
            setAll: (cookiesToSet) => {
                cookiesToSet.forEach(({ name, value, options }) =>
                    request.cookies.set({ name, value, ...options })
                );
                response = NextResponse.next({
                    request: { headers: request.headers },
                });
                cookiesToSet.forEach(({ name, value, options }) =>
                    response.cookies.set({ name, value, ...options })
                );
            },
        },
    });

    // Refresh da sessão (importante para manter o usuário logado)
    const { data: { user } } = await supabase.auth.getUser();

    // Proteção de rotas privadas (dashboard, app, admin, onboarding)
    const isProtectedRoute =
        request.nextUrl.pathname.startsWith('/dashboard') ||
        request.nextUrl.pathname.startsWith('/app') ||
        request.nextUrl.pathname.startsWith('/admin') ||
        request.nextUrl.pathname.startsWith('/onboarding');

    // 1. Se não estiver logado e tentar acessar rota protegida -> Login
    if (isProtectedRoute && !user) {
        const url = request.nextUrl.clone();
        url.pathname = '/login';
        return NextResponse.redirect(url);
    }

    // 2. Lógica de Organização (Multi-tenancy)
    if (isProtectedRoute && user) {
        const orgId = request.cookies.get('current_org_id')?.value;
        const isOnboarding = request.nextUrl.pathname === '/onboarding';

        if (!orgId) {
            // Tenta buscar a primeira organização do usuário
            const { data: memberships } = await supabase
                .from('memberships')
                .select('org_id')
                .eq('user_id', user.id)
                .limit(1);

            if (memberships && memberships.length > 0) {
                // Usuário tem org, mas estava sem cookie. Define e segue.
                const firstOrgId = memberships[0].org_id;
                response.cookies.set('current_org_id', firstOrgId, {
                    path: '/',
                    httpOnly: true,
                    sameSite: 'lax',
                    maxAge: 60 * 60 * 24 * 30
                });
                // Se estava indo pro onboarding mas já tem org, manda pro dashboard
                if (isOnboarding) {
                    const url = request.nextUrl.clone();
                    url.pathname = '/dashboard';
                    return NextResponse.redirect(url);
                }
            } else {
                // Usuário NÃO tem org. Se não estiver no onboarding, força ir.
                if (!isOnboarding) {
                    const url = request.nextUrl.clone();
                    url.pathname = '/onboarding';
                    return NextResponse.redirect(url);
                }
            }
        } else {
            // Tem orgId no cookie. Se tentar ir pro onboarding, redireciona pro dashboard (opcional, mas boa UX)
            // Mas permite criar nova org se clicou intencionalmente? 
            // O fluxo "Criar Nova Org" geralmente é dentro do dashboard ou uma rota específica. 
            // O /onboarding é pra "Primeira Org".
            if (isOnboarding) {
                const url = request.nextUrl.clone();
                url.pathname = '/dashboard';
                return NextResponse.redirect(url);
            }
        }
    }

    return response;
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};

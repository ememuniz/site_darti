//#region importações
import { NextRequest, NextResponse } from 'next/server';
import { decrypt } from './lib/session';
//#endregion

//#region Rotas de Autenticação
// As rotas podem ser adicionadas posteriormente, caso seja necessário
// protectedRoutes são rotas que necessitam de autenticação para serem acessadas
// authRoutes são rotas que não necessitam de autenticação para serem acessadas mas que são para autenticação, como login e registro
const protectedRoutes = ['/admin', '/membro', '/lider', '/aluno']
const authRoutes = ['/login', '/registro']
//#endregion

//#region Função de Proxy
export default async function proxy(req: NextRequest) {
    //#region Recuperação e Solicitação
    const path = req.nextUrl.pathname;
    const isProtectedRoute = protectedRoutes.some((route) => path.startsWith(route));
    const isAuthRoute = authRoutes.some((route) => path.startsWith(route));
    //#endregion

    //#region Autenticação
    const cookie = req.cookies.get('session')?.value;
    const session = await decrypt(cookie)
    //#endregion

    //#region ProtectedDeslogado
    if (isProtectedRoute && !session?.userId) {
        return NextResponse.redirect(new URL('/login', req.nextUrl))
    }
    //#endregion

    //#region AuthLogado
    if (isAuthRoute && session?.userId) {
        let destination;
        switch (session.role) {
            case 'ADMIN': destination = '/admin'; break;
            case 'MEMBER': destination = '/membro'; break;
            case 'LEADER': destination = '/lider'; break;
            case 'STUDENT': destination = '/aluno'; break;
            default: destination = '/login';
        }
        return NextResponse.redirect(new URL(destination, req.nextUrl))
    }
    //#endregion

    //#region Controle de acesso por papel (RBAC) - ProtectedLogado
    //#region Admin bloqueado
    if (path.startsWith('/admin') && session?.role !== 'ADMIN') {
        let destination;
        switch (session?.role) {
            case 'MEMBER': destination = '/membro'; break;
            case 'LEADER': destination = '/lider'; break;
            case 'STUDENT': destination = '/aluno'; break;
            default: destination = '/login';
        }
        return NextResponse.redirect(new URL(destination, req.nextUrl))
    }
    //#endregion
    
    //region Membro bloqueado
    if (path.startsWith('/membro') && session?.role !== 'MEMBER') {
        let destination;
        switch (session?.role) {
            case 'ADMIN': destination = '/admin'; break;
            case 'LEADER': destination = '/lider'; break;
            case 'STUDENT': destination = '/aluno'; break;
            default: destination = '/login';
        }
        return NextResponse.redirect(new URL(destination, req.nextUrl))
    }
    //#endregion

    //region Líder bloqueado
    if (path.startsWith('/lider') && session?.role !== 'LEADER') {
        let destination;
        switch (session?.role) {
            case 'ADMIN': destination = '/admin'; break;
            case 'MEMBER': destination = '/membro'; break;
            case 'STUDENT': destination = '/aluno'; break;
            default: destination = '/login';
        }
        return NextResponse.redirect(new URL(destination, req.nextUrl))
    }
    //#endregion

    //region Aluno bloqueado
    if (path.startsWith('/aluno') && session?.role !== 'STUDENT') {
        let destination;
        switch (session?.role) {
            case 'ADMIN': destination = '/admin'; break;
            case 'MEMBER': destination = '/membro'; break;
            case 'LEADER': destination = '/lider'; break;
            default: destination = '/login';
        }
        return NextResponse.redirect(new URL(destination, req.nextUrl))
    }
    //#endregion

    return NextResponse.next();
    
}

//#endregion

//#region Ignorar arquivos estáticos e imagens
export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
//#endregion


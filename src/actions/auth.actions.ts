'use server';

//#region Importações
import { validateCredentials } from '@/services/auth.service';
import { createSession, deleteSession } from '@/lib/session';
import { redirect } from 'next/navigation';
//#endregion

//#region Login Action
    // Essa função segue as seguintes etapas:
    // 1. Recebe um email e uma senha dos formulários do frontend
    // 2. Faz a validação das credenciais chamando a função validateCredentials dos services
    // 3. Se retornar null, devolve um erro generico de credenciais inválidas
    // 4. Se retornar um usuário e a senha bater, cria a sessão chamando a função createSession dos lib/session

export async function loginAction(prevState: unknown, formData: FormData) {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!email || !password) return { error: 'Prencha todos os campos!' };

    const user = await validateCredentials(email, password);

    if (!user) return { error: 'Email ou senha inválidos' };

    await createSession(user.id, user.role, user.email);

    let destination;

    switch (user.role) {
        case 'ADMIN': destination = '/admin'; break;
        case 'MEMBER': destination = '/membro'; break;
        case 'LEADER': destination = '/lider'; break;
        case 'STUDENT': destination = '/aluno'; break;
        default: destination = '/login';
    }

    redirect(destination);
}
//#endregion


//#region Logout Action
export async function logoutAction() {
    await deleteSession();
    redirect('/login');
}
//#endregion

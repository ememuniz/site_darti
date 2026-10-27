'use server';

import { updateUserData } from '@/services/set.service';
import { validateCredentials } from '@/services/auth.service';
import { cookies } from 'next/headers';
import { decrypt } from '@/lib/session';
import { revalidatePath } from 'next/cache';
import bcrypt from 'bcryptjs';

export async function updateUserDataAction(prevState: unknown, formData: FormData) {
    // O operador '?.' evita que o código quebre caso o input não exista na aba atual
    const name = (formData.get('name') as string | null)?.trim() || undefined;
    const socialName = (formData.get('socialName') as string | null)?.trim() || undefined;
    const email = (formData.get('email') as string | null)?.trim() || undefined;
    const dateOfBirth = (formData.get('dateOfBirth') as string | null)?.trim() || undefined;
    const bio = (formData.get('bio') as string | null)?.trim() || undefined;

    const passwordAtual = (formData.get('passwordAtual') as string | null)?.trim();
    const passwordNova = (formData.get('passwordNova') as string | null)?.trim();
    const passwordConfirmacao = (formData.get('passwordConfirmacao') as string | null)?.trim();

    const linkedin = (formData.get('linkedin') as string | null)?.trim() || undefined;
    const github = (formData.get('github') as string | null)?.trim() || undefined;

    const dateOfBirthDate = dateOfBirth ? new Date(dateOfBirth) : undefined;
    

    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session')?.value;
    const session = sessionCookie ? await decrypt(sessionCookie) : null;

    if (!session?.email) {
        return { isCorrect: false, message: 'Sessão inválida. Por favor, faça login novamente.' };
    }

    let hashedPassword: string | undefined = undefined;

    // Só valida e gera hash de senha se o usuário estiver enviando os campos da aba Segurança
    if (passwordAtual || passwordNova || passwordConfirmacao) {
        if (!passwordAtual || !passwordNova || !passwordConfirmacao) {
            return { isCorrect: false, message: 'Preencha todos os campos de senha.' };
        }

        const user = await validateCredentials(session.email, passwordAtual);
        if (!user) {
            return { isCorrect: false, message: 'Senha atual incorreta. Por favor, tente novamente.' };
        }

        if (passwordNova !== passwordConfirmacao) {
            return { isCorrect: false, message: 'A nova senha e a confirmação não coincidem.' };
        }

        hashedPassword = await bcrypt.hash(passwordNova, 10);
    }

    const userUpdateData = await updateUserData({
        name,
        socialName,
        email,
        dateOfBirth: dateOfBirthDate,
        bio,
        password: hashedPassword,
        sessionEmail: session.email,
        linkedin,
        github,
    });

    if (userUpdateData.isCorrect) {
        revalidatePath('/admin');
    }

    return userUpdateData;
}
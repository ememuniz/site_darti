'use server';

import { createInvite, getAllInvites, toggleInviteStatus } from '@/services/invite.service';
import { Role } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { createUser } from '@/services/auth.service';
import { redirect } from 'next//navigation';

const VALID_ROLES: Role[] = ['ADMIN', 'MEMBER', 'LEADER', 'STUDENT'];

export async function createInviteAction(prevState: unknown, formData: FormData) {
    const email = (formData.get('email') as string | null)?.trim();
    const role = (formData.get('role') as string | null)?.trim() as Role | undefined;

    if (!email || !role) {
        return { success: false, message: 'Preencha todos os campos!' };
    }

    if (!VALID_ROLES.includes(role)) {
        return { success: false, message: 'Função inválida!' };
    }

    const response = await createInvite({ email, role });

    if (response.success) {
        revalidatePath('/admin');
    }

    return response;
}

export async function getInvitesAction() {
    return await getAllInvites();
}

export async function toggleInviteStatusAction(id: number, newStatus: boolean) {
    const response = await toggleInviteStatus(id, newStatus);
    if (response.success) {
        revalidatePath('/admin');
    }
    return response;
}

export async function registerWithInviteAction(prevState: unknown, formData: FormData) {
    const token = formData.get('token') as string;
    const role = formData.get('role') as Role | undefined;
    const name = (formData.get('name') as string | null)?.trim();
    const email = (formData.get('email') as string | null)?.trim();
    const password = formData.get('password') as string | null;

    if (!name || !email || !password || !token || !role) {
        return { success: false, message: 'Preencha todos os campos obrigatórios.' };
    }

    if (!VALID_ROLES.includes(role)) {
        return { success: false, message: 'Função inválida!' };
    }

    const response = await createUser({ name, email, password, token, role });

    if (response.isRegistered) {
        redirect('/login');
    }

    if (response.success) {
        revalidatePath('/login');
    }

    
}
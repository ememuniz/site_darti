'use server';

import { getAllMembros, toggleUserStatus } from '@/services/membros.service';
import { revalidatePath } from 'next/cache';

export async function getMembrosAction() {
    return await getAllMembros();
}

export async function toggleUserStatusAction(userId: number, isActive: boolean) {
    const response = await toggleUserStatus(userId, isActive);
    if (response.success) {
        revalidatePath('/admin');
    }
    return response;
}
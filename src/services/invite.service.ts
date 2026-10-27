import crypto from "crypto";
import { Role } from "@prisma/client";
import { prisma } from "@/lib/prisma";


interface createInviteProps {
    email: string;
    role: Role;
}

export async function createInvite({ email, role }: createInviteProps) {
    try {
        const token = crypto.randomBytes(24).toString('hex');
        const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000); 

        await prisma.invite.create({
            data: {
                token,
                email,
                role,
                expiresAt,
            }
        })

        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
        return { success: true, link: `${baseUrl}/cadastro/${token}`, message: 'Convite criado com sucesso!' };
    } catch (error) {
        console.error('❌ Erro ao gerar convite:', error);
        return { success: false, message: 'Erro ao criar o convite.' };
    }
}

export async function getAllInvites() {
    try {
        const invites = await prisma.invite.findMany({
            orderBy: { createdAt: 'desc' },
        });

        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

        return invites.map((invite) => ({
            id: invite.id,
            email: invite.email,
            role: invite.role,
            token: invite.token,
            link: `${baseUrl}/cadastro/${invite.token}`,
            used: invite.used,
            usedAt: invite.usedAt ? invite.usedAt.toISOString() : null,
            isActive: invite.isActive,
            createdAt: invite.createdAt.toISOString(),
        }));
    } catch (error) {
        console.error('❌ Erro ao buscar convites:', error);
        return [];
    }
}

export async function toggleInviteStatus(id: number, isActive: boolean) {
    try {
        const dataToUpdate: { isActive: boolean; expiresAt?: Date } = { isActive };

        // Se estiver reativando o convite, renova a validade por mais 48h
        if (isActive) {
            dataToUpdate.expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000);
        }

        await prisma.invite.update({
            where: { id },
            data: dataToUpdate,
        });

        return { success: true };
    } catch (error) {
        console.error('❌ Erro ao alterar status do convite:', error);
        return { success: false, message: 'Não foi possível alterar o status do convite.' };
    }
}
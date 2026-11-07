import { prisma } from '@/lib/prisma';

//#region Procura todos os membros
export async function getAllMembros() {
    try {
        const users = await prisma.user.findMany({
            orderBy: { name: 'asc' },
        });

        return users.map((user) => {
            const fullName = user.name || 'Sem Nome';
            const socialName = user.socialName || fullName;
            
            // Iniciais para o avatar
            const nameParts = socialName.split(' ');
            const initials = nameParts.length > 1 
                ? `${nameParts[0][0]}${nameParts.at(-1)?.[0] || ''}`.toUpperCase()
                : nameParts[0].substring(0, 2).toUpperCase();

            return {
                id: user.id,
                name: fullName,
                socialName: socialName,
                initials: initials,
                email: user.email,
                jobTitle: user.jobTitle || 'Sem Cargo',
                role: user.jobTitle || user.role,
                isActive: user.isActive,
                dateOfBirth: user.dateOfBirth ? user.dateOfBirth.toISOString() : null,
                bio: user.bio || 'Nenhuma biografia informada.',
                linkedin: user.linkedin || '',
                github: user.github || '',
                board: user.board,
                club: user.club,
            };
        });
    } catch (error) {
        console.error('❌ Erro ao buscar membros:', error);
        return [];
    }
}
//#endregion


//#region Ativa ou desativa um membro
export async function toggleUserStatus(userId: number, isActive: boolean) {
    try {
        await prisma.user.update({
            where: { id: userId },
            data: { isActive },
        });
        return { success: true };
    } catch (error) {
        console.error('❌ Erro ao alterar status do usuário:', error);
        return { success: false, message: 'Erro ao atualizar o acesso do membro.' };
    }
}
//#endregion
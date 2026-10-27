import { prisma } from '@/lib/prisma'

interface userUpdateDataProps {
    name?: string;
    socialName?: string;
    email?: string;
    dateOfBirth?: Date;
    bio?: string;
    password?: string;
    linkedin?: string;
    github?: string;
    sessionEmail: string | undefined;
}

export async function updateUserData({ 
    name, 
    socialName, 
    email, 
    dateOfBirth, 
    bio, 
    password,
    linkedin,
    github,
    sessionEmail 
}: userUpdateDataProps) {
    try {
        const userUpdateData = await prisma.user.update({
            where: { email: sessionEmail },
            data: {
                name,
                socialName,
                email,
                dateOfBirth,
                bio,
                linkedin,
                github,
                password,
            }
        })
        return { 
            isCorrect: true, 
            message: 'Dados do usuário atualizados com sucesso.', 
            data: userUpdateData }
    } catch (error) {
        console.error('❌ Erro real do Prisma:', error);
        return { isCorrect: false, message: 'Erro ao atualizar os dados do usuário.' };
    }
}
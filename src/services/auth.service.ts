//#region Importações
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
//#endregion

//#region Validação de credenciais
    // Essa função segue as seguintes etapas:
    // 1. Recebe um email e uma senha como parâmetros.
    // 2. Busca o usuário pelo email no BD
    // 3. Se o usuário não for encontrado, retorna null.
    // 4. Se o usuário for encontrado, compara a senha fornecida com a senha armazenada no BD
    // 5. Se a senha não corresponder, retorna null.
    // 6. Se a senha corresponder, retorna o usuário encontrado.

    export async function validateCredentials(email:string, password:string) {
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) return null

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) return null

        return user;
    }

    interface createUserProps {
        name: string;
        email: string;
        password: string;
        token: string;
    }


    export async function createUser({ name, email, password, token }: createUserProps) {
        let isRegistered = false;
        try {
            // Verifica se o convite existe, não foi usado e não expirou
            const invite = await prisma.invite.findUnique({
                where: { token },
            });

            if (!invite || invite.used || invite.expiresAt < new Date()) {
                return { success: false, message: 'Este convite é inválido, expirou ou já foi utilizado.' };
            }

            // Verifica se o e-mail já está em uso
            const existingUser = await prisma.user.findUnique({
                where: { email },
            });

            if (existingUser) {
                return { success: false, message: 'Este e-mail já está cadastrado.' };
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            // Executa a criação do usuário e a queima do token na mesma operação
            await prisma.$transaction([
                prisma.user.create({
                    data: {
                        name,
                        email,
                        password: hashedPassword,
                        board: [],
                        club: [],
                    },
                }),
                prisma.invite.update({
                    where: { id: invite.id },
                    data: { used: true },
                }),
            ]);
            isRegistered = true;

            return { isRegistered, success: true, message: 'Cadastro realizado com sucesso! Você já pode fazer login.' };
        } catch (error) {
            console.error('Erro ao registrar com convite:', error);
            return { success: false, message: 'Erro interno ao realizar o cadastro.' };
        }
    }
//#endregion


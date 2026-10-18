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
//#endregion


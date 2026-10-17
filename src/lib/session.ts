import { SignJWT, jwtVerify } from 'jose';
import { cookies } from "next/headers";
import { Role } from "@prisma/client";

const secretKey = process.env.SESSION_SECRET;
const encodedKey = new TextEncoder().encode(secretKey);

//#region SessionPayload
// SessionPayload -> é o tipo de dado que será armazenado na sessão do usuário e usadas para autenticação e autorização.
export type SessionPayload = {
    userId: number;
    role: Role;
    email: string;
}
//#endregion

//#region encrypt
// encrypt -> função que recebe um payload do tipo SessionPayload e retorna uma Promise<string> que representa o token JWT assinado com a chave secreta. 
    //Ele segue as seguintes etapas:
    // 1. Cria um novo objeto SignJWT com o payload fornecido.
    // 2. Define o cabeçalho protegido do JWT com o algoritmo de assinatura "HS256".
    // 3. Define a data de emissão do token.
    // 4. Define o tempo de expiração do token para 1 dia.
    // 5. Assina o token usando a chave secreta codificada e retorna o token assinado como uma Promise<string>.
export async function encrypt(payload:SessionPayload) {
    return new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("1d")
        .sign(encodedKey);
}
//#endregion

//#region decrypt
// decrypt -> função que recebe um token JWT e retorna uma Promise<SessionPayload | null> que representa o payload decodificado do token, ou null se o token for inválido.
    // Ele segue as seguintes etapas:
    // 1. Tenta verificar o token usando a chave secreta codificada e o algoritmo de assinatura "HS256".
    // 2. Se a verificação for bem-sucedida, retorna o payload decodificado como um objeto do tipo SessionPayload.
    // 3. Se a verificação falhar, retorna null.
export async function decrypt(session:string | undefined= '') {
    try {
        const { payload } = await jwtVerify(session, encodedKey, { algorithms: ["HS256"] });
        return payload as unknown as SessionPayload;
    } catch {
        return null;
    }
}
//#endregion

//#region createSession
// createSession -> função que cria uma sessão de usuário, armazenando um token JWT em um cookie HTTP-only.
    // Ele segue as seguintes etapas:
    // 1. Calcula a data de expiração do cookie para 1 dia a partir do momento atual.
    // 2. Chama a função encrypt para gerar um token JWT com o payload fornecido (userId, role, email).
    // 3. Obtém o objeto cookieStore usando cookies() do Next.js.
    // 4. Define o cookie "session" com o token JWT, configurando as opções de segurança (httpOnly, secure, expires, sameSite, path).
export async function createSession(userId: number, role: Role, email: string) {
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 7 dias em milissegundos
    const session = await encrypt({ userId, role, email });
    const cookieStore = await cookies();

    cookieStore.set('session', session, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        expires: expiresAt,
        sameSite: 'lax',
        path: '/',
    });
}
//#endregion

//#region deleteSession
// deleteSession -> função que exclui a sessão de usuário, removendo o cookie "session" do navegador.
    // Ele segue as seguintes etapas:
    // 1. Obtém o objeto cookieStore usando cookies() do Next.js.
    // 2. Chama o método delete do cookieStore para remover o cookie "session".
export async function deleteSession() {
    const cookieStore = await cookies();
    cookieStore.delete('session');
}
//#endregion


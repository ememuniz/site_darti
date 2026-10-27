import { prisma } from '@/lib/prisma';
import RegisterInviteForm from '@/components/RegisterInviteForm';

export const instant = false;

interface CadastroPageProps {
    params: Promise<{ token: string }>;
}

export default async function CadastroConvitePage({ params }: CadastroPageProps) {
    const { token } = await params;

    const invite = await prisma.invite.findUnique({
        where: { token },
    });

    const isInvalid = !invite || invite.used || invite.expiresAt < new Date();

    if (isInvalid) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-foreground text-background p-5">
                <div className="bg-darkDarti p-8 rounded-3xl border border-redDarti/40 text-center max-w-md w-full">
                    <h1 className="text-xl font-bold text-redDarti mb-2">Convite Inválido</h1>
                    <p className="text-sm font-light text-zinc-300">
                        Este link de convite já foi utilizado ou expirou. Solicite um novo link ao administrador do DARTI.
                    </p>
                </div>
            </main>
        );
    }

    return (
        <main className="flex min-h-screen items-center justify-center bg-foreground text-background p-5">
            <RegisterInviteForm token={token} />
        </main>
    );
}
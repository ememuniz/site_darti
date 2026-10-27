'use client';

import { useActionState } from 'react';
import { registerWithInviteAction } from '@/actions/invite.actions';

export default function RegisterInviteForm({ token }: { token: string }) {
    const [state, formAction, isPending] = useActionState(registerWithInviteAction, null);

    if (state?.success) {
        return (
            <div className="bg-darkDarti p-8 rounded-3xl border border-greenDarti/40 text-center max-w-md w-full">
                <h2 className="text-xl font-bold text-greenDarti mb-2">Conta Criada!</h2>
                <p className="text-sm text-zinc-300 mb-4">{state.message}</p>
                <a href="/login" className="bg-orangeDarti text-white font-semibold py-2 px-6 rounded-[10px] inline-block">
                    Ir para o Login
                </a>
            </div>
        );
    }

    return (
        <form action={formAction} className="bg-darkDarti p-8 rounded-3xl border border-darkDarti/80 flex flex-col gap-4 max-w-md w-full">
            <h1 className="text-xl font-bold text-orangeDarti">Cadastro de Membro</h1>
            
            {/* Envia o token de forma oculta junto com o formulário */}
            <input type="hidden" name="token" value={token} />

            <div className="flex flex-col gap-1">
                <label className="text-orangeDarti text-sm font-semibold">Nome Completo</label>
                <input
                    type="text"
                    name="name"
                    required
                    className="bg-greyDarti/30 text-sm border border-greyDarti/50 rounded-[10px] py-2 px-4"
                />
            </div>

            <div className="flex flex-col gap-1">
                <label className="text-orangeDarti text-sm font-semibold">Email</label>
                <input
                    type="email"
                    name="email"
                    required
                    className="bg-greyDarti/30 text-sm border border-greyDarti/50 rounded-[10px] py-2 px-4"
                />
            </div>

            <div className="flex flex-col gap-1">
                <label className="text-orangeDarti text-sm font-semibold">Senha</label>
                <input
                    type="password"
                    name="password"
                    required
                    className="bg-greyDarti/30 text-sm border border-greyDarti/50 rounded-[10px] py-2 px-4"
                />
            </div>

            {state?.message && (
                <p className="text-xs font-semibold text-redDarti">{state.message}</p>
            )}

            <button
                type="submit"
                disabled={isPending}
                className="bg-orangeDarti text-white font-semibold py-2 px-4 rounded-[10px] hover:bg-orangeDarti/80 mt-2"
            >
                {isPending ? 'Cadastrando...' : 'Finalizar Cadastro'}
            </button>
        </form>
    );
}
'use client';

//#region Importações
import { useActionState } from 'react';
import Link from 'next/link';
import { loginAction } from '@/actions/auth.actions';
import Image from 'next/image';
import logo from '@/assets/DartiColorido.png';
import ParticleBackground from '@/components/ParticleBackground';
//#endregion

//#region LoginPage
export default function LoginPage() {
    const [state, formAction, isPending] = useActionState(loginAction, null);
    // state serve para verificar o estado da ação (sucesso, erro, carregando, etc.)
    // formAction é a função que será chamada quando o formulário for enviado, no caso, a função loginAction
    // isPending é um booleano que indica se a ação está em andamento ou não
    return (
        <main className="flex bg-greyLightDarti text-darkDarti h-screen justify-center pt-5 mt-16 border">
            <ParticleBackground />
            <div className="h-fit w-[500px]  flex flex-col justify-start items-center px-15 pt-10 pb-10">
                <Image src={logo} alt="Logo Darti" className="object-contain px-15" />
                <h1 className="font-bold text-[35pt] font-poppins text-blueDarti">Login</h1>
                <p className="text-center text-greyDarti/80 pb-5">Entre com suas credenciais</p>
                <form action={formAction} className="flex flex-col gap-2 w-full">
                    <div className="flex flex-col gap-3">
                        <div className="flex flex-col gap-1">
                            <label htmlFor="email" className="text-blueDarti font-bold">Email</label>
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                className="bg-greyDarti/30 border border-greyDarti/50 rounded-[10px] py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label htmlFor="password" className="text-blueDarti font-bold">Senha</label>
                            <input
                                type="password"
                                name="password"
                                placeholder="Senha"
                                className="bg-greyDarti/30 border border-greyDarti/50 rounded-[10px] py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-[10px] transition duration-200 w-full"
                    >
                        Entrar
                    </button>
                </form>


            </div>
        </main>
    )
}

//#endregion
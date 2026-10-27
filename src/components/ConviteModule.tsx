'use client';

import { UserPlus, Copy, Check, Ban, RotateCcw, Search } from "lucide-react";
import {
    createInviteAction,
    getInvitesAction,
    toggleInviteStatusAction,
} from "@/actions/invite.actions";
import { useActionState, useEffect, useState, useTransition } from "react";

interface InviteItem {
    id: number;
    email: string;
    role: string;
    token: string;
    link: string;
    used: boolean;
    usedAt: string | null;
    isActive: boolean;
    createdAt: string;
}

type FilterType = 'ALL' | 'UNUSED' | 'USED' | 'DEACTIVATED';

const ROLE_LABELS: Record<string, string> = {
    MEMBER: 'Membro',
    ADMIN: 'Administrador',
    LEADER: 'Líder',
    STUDENT: 'Estudante',
};

function formatInviteDate(isoDate: string) {
    const date = new Date(isoDate);
    const today = new Date();
    const isToday =
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear();

    if (isToday) {
        return `Hoje, ${date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
    }

    return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });
}

export default function ConviteModule() {
    const [state, formInviteData, isPending] = useActionState(createInviteAction, null);
    const [invites, setInvites] = useState<InviteItem[]>([]);
    const [filter, setFilter] = useState<FilterType>('ALL');
    const [search, setSearch] = useState('');
    const [copiedId, setCopiedId] = useState<number | null>(null);
    const [isToggling, startTransition] = useTransition();

    console.log('isPending:', isPending);

    async function loadInvites() {
        const data = await getInvitesAction();
        setInvites(data);
    }

    useEffect(() => {
        let cancelled = false;

        void getInvitesAction().then((data) => {
            if (!cancelled) {
                setInvites(data);
            }
        });

        return () => {
            cancelled = true;
        };
    }, [state]);

    // Contadores dinâmicos para os Indicativos de Status
    const pendentesCount = invites.filter((i) => !i.used && i.isActive).length;
    const utilizadosCount = invites.filter((i) => i.used).length;
    const desativadosCount = invites.filter((i) => !i.used && !i.isActive).length;

    // Filtro por abas e barra de busca
    const filteredInvites = invites.filter((invite) => {
        const matchesTab =
            filter === 'ALL' ||
            (filter === 'UNUSED' && !invite.used && invite.isActive) ||
            (filter === 'USED' && invite.used) ||
            (filter === 'DEACTIVATED' && !invite.used && !invite.isActive);

        const roleLabel = (ROLE_LABELS[invite.role] || invite.role).toLowerCase();
        const query = search.toLowerCase().trim();
        const matchesSearch =
            !query ||
            invite.email.toLowerCase().includes(query) ||
            roleLabel.includes(query);

        return matchesTab && matchesSearch;
    });

    function handleCopy(id: number, link: string) {
        navigator.clipboard.writeText(link);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    }

    function handleToggleStatus(id: number, newStatus: boolean) {
        startTransition(async () => {
            await toggleInviteStatusAction(id, newStatus);
            await loadInvites();
        });
    }

    return (
        <main className="flex flex-col flex-9 bg-foreground p-5 text-background gap-5">
            {/*---------------------------------- TITULO --------------------------------------*/}
            <div className='flex flex-col p-2 h-fit justify-center gap-1 py-4'>
                <h1 className="text-[15pt] font-bold font-poppins text-orangeDarti">Convites</h1>
                <p className='font-thin text-[10pt]'>Gerencie os convites para novos membros</p>
            </div>

            {/*---------------------------------- INDICATIVOS DE STATUS --------------------------------------*/}
            <div className='flex h-[40px] justify-start pl-5 items-center gap-3'>
                <div className='flex h-fit w-fit py-1.4 px-3 items-center gap-1.5'>
                    <div className='w-3 h-3 bg-orangeDarti rounded-full shadow-md'></div>
                    <div>Pendentes: {pendentesCount}</div>
                </div>

                <div className='flex h-fit w-fit py-1.4 px-3 items-center gap-1.5'>
                    <div className='w-3 h-3 bg-greenDarti rounded-full shadow-md'></div>
                    <div>Utilizados: {utilizadosCount}</div>
                </div>

                <div className='flex h-fit w-fit py-1.4 px-3 items-center gap-1.5'>
                    <div className='w-3 h-3 bg-greyDarti rounded-full shadow-md'></div>
                    <div>Desativados: {desativadosCount}</div>
                </div>
            </div>

            {/*---------------------------------- CRIAR CONVITES --------------------------------------*/}

            <div className='flex h-fit gap-5 px-6 pb-7 flex-col bg-darkDarti py-6 rounded-[20px]'>
                {/*------------------------TITULO DE CRIAR CONVITES ------------------------ */}
                <div className='flex h-fit w-full justify-start items-center gap-4'>
                    <UserPlus size={30} className="text-orangeDarti bg-orangeDarti/20 p-1 rounded-[5px]" />
                    <div className='flex flex-col'>
                        <div className='text-orangeDarti font-semibold text-[17pt]'>Criar Novo Link de Convite</div>
                        <div className='font-thin text-[10pt]'>O link gerado estará vinculado ao e-mail e ao cargo escolhido abaixo</div>
                    </div>
                </div>

                {/*---------------------- FORMULÁRIO DE CRIAR CONVITES --------------------- */}
                <form action={formInviteData} className='flex h-fit gap-5 items-center'>
                    <div className='flex-2 flex flex-col gap-1'>
                        <label htmlFor="email" className='text-orangeDarti font-semibold'>
                            Email do Convidado:
                        </label>
                        <input 
                            type="email"
                            name="email"
                            placeholder="Digite o email do convidado"
                            className='bg-greyDarti/30 border border-greyDarti/50 rounded-[10px] py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full'
                        />
                    </div>
                    <div className='flex-2 flex flex-col gap-1'>
                        <label htmlFor="role" className='text-orangeDarti font-semibold'>
                            Papel na Organização:
                        </label>
                        <select 
                            name="role" 
                            defaultValue=""
                            className="bg-darkDarti/100 border border-greyDarti/50 rounded-[10px] py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 text-background cursor-pointer"
                        >
                            <option className="font-bold" value="" disabled>
                                Selecione uma opção...
                            </option>
                            <option className="font-bold" value="MEMBER">Membro</option>
                            <option className="font-bold" value="ADMIN">Administrador</option>
                            <option className="font-bold" value="LEADER">Líder</option>
                            <option className="font-bold" value="STUDENT">Estudante</option>

                        </select>
                    </div>
                    <div className='flex h-full justify-end items-end'>
                        <button 
                            type="submit" 
                            className='h-fit w-fit px-7 py-2 bg-orangeDarti hover:bg-orangeDarti/60 transition duration-200 rounded-[12px] text-white font-semibold flex justify-center items-center gap-1'>
                            Gerar Link
                        </button>
                    </div>
                </form>

                {state?.message && (
                    <div className={`text-sm font-semibold ${state && "success" in state && state.success ? 'text-greenDarti' : 'text-redDarti'}`}>
                        <p>{state.message}</p>
                        {"link" in state && state.link && (
                            <p className="text-xs text-zinc-300 mt-1 select-all bg-darkDarti p-2 rounded-lg border border-greyDarti/40">
                                Link: {state.link}
                            </p>
                        )}
                    </div>
                )}
                
            </div>

            {/*---------------------------------- LISTA DE CONVITES --------------------------------------*/}

            <div className="h-fit gap-5 flex flex-col bg-darkDarti rounded-[20px] p-6">
                {/* Cabeçalho da Lista + Abas de Filtro + Busca */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-greyDarti/30 pb-4">
                    <div className="flex flex-col">
                        <div className="text-orangeDarti font-semibold text-[15pt]">
                            Histórico de Convites Enviados
                        </div>
                        <div className="font-thin text-[10pt]">
                            Copie links pendentes ou gerencie a validade de cada convite.
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        {/* Abas de Filtro */}
                        <div className="flex items-center bg-greyDarti/20 p-1 rounded-[10px] border border-greyDarti/40 text-[9pt]">
                            <button
                                type="button"
                                onClick={() => setFilter('ALL')}
                                className={`px-3 py-1.5 rounded-[8px] font-semibold transition cursor-pointer ${
                                    filter === 'ALL'
                                        ? 'bg-orangeDarti text-white'
                                        : 'text-zinc-300 hover:text-orangeDarti'
                                }`}
                            >
                                Todos ({invites.length})
                            </button>
                            <button
                                type="button"
                                onClick={() => setFilter('UNUSED')}
                                className={`px-3 py-1.5 rounded-[8px] font-semibold transition cursor-pointer ${
                                    filter === 'UNUSED'
                                        ? 'bg-orangeDarti text-white'
                                        : 'text-zinc-300 hover:text-orangeDarti'
                                }`}
                            >
                                Não Utilizados
                            </button>
                            <button
                                type="button"
                                onClick={() => setFilter('USED')}
                                className={`px-3 py-1.5 rounded-[8px] font-semibold transition cursor-pointer ${
                                    filter === 'USED'
                                        ? 'bg-orangeDarti text-white'
                                        : 'text-zinc-300 hover:text-orangeDarti'
                                }`}
                            >
                                Utilizados
                            </button>
                            <button
                                type="button"
                                onClick={() => setFilter('DEACTIVATED')}
                                className={`px-3 py-1.5 rounded-[8px] font-semibold transition cursor-pointer ${
                                    filter === 'DEACTIVATED'
                                        ? 'bg-orangeDarti text-white'
                                        : 'text-zinc-300 hover:text-orangeDarti'
                                }`}
                            >
                                Desativados
                            </button>
                        </div>

                        {/* Busca */}
                        <div className="relative">
                            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Buscar e-mail ou cargo..."
                                className="bg-greyDarti/30 border border-greyDarti/50 rounded-[10px] pl-9 pr-4 py-1.5 text-[9pt] focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                </div>

                {/* Tabela de Convites */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-greyDarti/30 text-[8pt] uppercase text-zinc-400">
                                <th className="py-3 px-4 font-semibold">Destinatário & Papel</th>
                                <th className="py-3 px-4 font-semibold">Link de Uso Único</th>
                                <th className="py-3 px-4 font-semibold">Status do Link</th>
                                <th className="py-3 px-4 font-semibold text-right">Ação</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-greyDarti/20 text-[10pt]">
                            {filteredInvites.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="py-8 text-center font-thin text-zinc-400">
                                        Nenhum convite encontrado.
                                    </td>
                                </tr>
                            ) : (
                                filteredInvites.map((invite) => {
                                    const isDeactivated = !invite.used && !invite.isActive;
                                    const isUnused = !invite.used && invite.isActive;

                                    return (
                                        <tr key={invite.id} className="hover:bg-greyDarti/10 transition">
                                            {/* Destinatário & Papel */}
                                            <td className="py-4 px-4">
                                                <div className={`font-semibold ${isDeactivated ? 'line-through text-zinc-500' : ''}`}>
                                                    {invite.email}
                                                </div>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="px-2 py-0.5 text-[8pt] font-semibold rounded-[6px] bg-orangeDarti/20 text-orangeDarti border border-orangeDarti/40">
                                                        {ROLE_LABELS[invite.role] || invite.role}
                                                    </span>
                                                    <span className="text-[8pt] font-thin text-zinc-400">
                                                        Criado: {formatInviteDate(invite.createdAt)}
                                                    </span>
                                                </div>
                                            </td>

                                            {/* Link de Uso Único + Botão Copiar */}
                                            <td className="py-4 px-4">
                                                <div className="flex items-center gap-2">
                                                    <div
                                                        className={`px-3 py-1.5 rounded-[8px] border text-[9pt] font-mono max-w-[260px] truncate ${
                                                            isUnused
                                                                ? 'bg-greyDarti/30 border-greyDarti/50 text-zinc-200'
                                                                : 'bg-greyDarti/10 border-greyDarti/20 text-zinc-500'
                                                        }`}
                                                    >
                                                        {invite.link}
                                                    </div>

                                                    <button
                                                        type="button"
                                                        disabled={!isUnused}
                                                        onClick={() => handleCopy(invite.id, invite.link)}
                                                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] border text-[9pt] font-semibold transition ${
                                                            isUnused
                                                                ? 'bg-greyDarti/30 border-greyDarti/50 hover:border-orangeDarti cursor-pointer'
                                                                : 'bg-greyDarti/10 border-greyDarti/20 text-zinc-500 opacity-50 cursor-not-allowed'
                                                        }`}
                                                    >
                                                        {copiedId === invite.id ? (
                                                            <>
                                                                <Check size={14} className="text-greenDarti" />
                                                                <span className="text-greenDarti">Copiado</span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Copy size={14} />
                                                                <span>Copiar</span>
                                                            </>
                                                        )}
                                                    </button>
                                                </div>
                                            </td>

                                            {/* Status do Link */}
                                            <td className="py-4 px-4">
                                                {invite.used ? (
                                                    <div className="flex flex-col items-start gap-0.5">
                                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[8pt] font-semibold bg-greenDarti/20 text-greenDarti border border-greenDarti/40">
                                                            <span className="w-2 h-2 rounded-full bg-greenDarti"></span>
                                                            Utilizado
                                                        </span>
                                                        {invite.usedAt && (
                                                            <span className="text-[8pt] font-thin text-zinc-400 pl-1">
                                                                em {formatInviteDate(invite.usedAt)}
                                                            </span>
                                                        )}
                                                    </div>
                                                ) : isDeactivated ? (
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[8pt] font-semibold bg-greyDarti/30 text-zinc-400 border border-greyDarti/50">
                                                        <span className="w-2 h-2 rounded-full bg-greyDarti"></span>
                                                        Desativado
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[8pt] font-semibold bg-orangeDarti/20 text-orangeDarti border border-orangeDarti/40">
                                                        <span className="w-2 h-2 rounded-full bg-orangeDarti"></span>
                                                        Não utilizado
                                                    </span>
                                                )}
                                            </td>

                                            {/* Ação */}
                                            <td className="py-4 px-4 text-right">
                                                {invite.used ? (
                                                    <span className="text-[9pt] italic font-thin text-zinc-400">
                                                        Cadastro concluído
                                                    </span>
                                                ) : isDeactivated ? (
                                                    <button
                                                        type="button"
                                                        disabled={isToggling}
                                                        onClick={() => handleToggleStatus(invite.id, true)}
                                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] text-[9pt] font-semibold bg-greenDarti/20 text-greenDarti border border-greenDarti/40 hover:bg-greenDarti/30 transition cursor-pointer disabled:opacity-50"
                                                    >
                                                        <RotateCcw size={14} />
                                                        Ativar novamente
                                                    </button>
                                                ) : (
                                                    <button
                                                        type="button"
                                                        disabled={isToggling}
                                                        onClick={() => handleToggleStatus(invite.id, false)}
                                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] text-[9pt] font-semibold bg-redDarti/20 text-redDarti border border-redDarti/40 hover:bg-redDarti/30 transition cursor-pointer disabled:opacity-50"
                                                    >
                                                        <Ban size={14} />
                                                        Desativar link
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </main>
    );
}
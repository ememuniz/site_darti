'use client';

import { useState, useEffect, useTransition } from 'react';
import { Search, Eye, X, Link2, GitBranch, CheckCircle, XCircle } from 'lucide-react';
import { getMembrosAction, toggleUserStatusAction } from '@/actions/membros.actions';

interface Membro {
    id: number;
    name: string;
    socialName: string;
    initials: string;
    email: string;
    role: string;
    isActive: boolean;
    dateOfBirth: string | null;
    bio: string;
    linkedin: string;
    github: string;
    board: string[];
    club: string[];
}

type FilterTab = 'ALL' | 'ACTIVE' | 'INACTIVE';
type SortOrder = 'BIRTH_DATE' | 'ALPHA_ASC' | 'ALPHA_DESC' | 'BIRTH_YEAR';

const JOB_LABELS: Record<string, string> = {
    PRESIDENTE: 'Presidente',
    VICE_PRESIDENTE: 'Vice-Presidente',
    DIRETOR: 'Diretor',
    LIDER: 'Líder',
    MEMBRO: 'Membro',
    ADMIN: 'Administrador',
    STUDENT: 'Estudante',
};

function formatBirthDate(isoDate: string | null) {
    if (!isoDate) return 'Não informada';
    const date = new Date(isoDate);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    const monthsNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    const monthShort = monthsNames[date.getMonth()];

    return {
        full: `${day}/${month}/${year}`,
        anniversary: `${day} de ${monthShort}`,
    };
}

export default function MembrosModule() {
    const [membros, setMembros] = useState<Membro[]>([]);
    const [filterTab, setFilterTab] = useState<FilterTab>('ALL');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortOrder, setSortOrder] = useState<SortOrder>('BIRTH_DATE');
    const [selectedMembro, setSelectedMembro] = useState<Membro | null>(null);
    const [isPending, startTransition] = useTransition();

    async function loadData() {
        const data = await getMembrosAction();
        setMembros(data);
    }

    useEffect(() => {
        let isMounted = true;

        getMembrosAction().then((data) => {
            if (isMounted) {
                setMembros(data);
            }
        });

        return () => {
            isMounted = false;
        };
    }, []);

    // Contadores
    const totalCount = membros.length;
    const activeCount = membros.filter((m) => m.isActive).length;
    const inactiveCount = membros.filter((m) => !m.isActive).length;

    // Ações de status
    function handleToggleStatus(id: number, currentStatus: boolean, e?: React.MouseEvent) {
        e?.stopPropagation();
        startTransition(async () => {
            await toggleUserStatusAction(id, !currentStatus);
            await loadData();
            // Atualiza o modal se estiver aberto
            if (selectedMembro && selectedMembro.id === id) {
                setSelectedMembro((prev) => prev ? { ...prev, isActive: !currentStatus } : null);
            }
        });
    }

    // Filtragem e Ordenação
    const filteredMembros = membros
        .filter((m) => {
            const matchesTab =
                filterTab === 'ALL' ||
                (filterTab === 'ACTIVE' && m.isActive) ||
                (filterTab === 'INACTIVE' && !m.isActive);

            const query = searchQuery.toLowerCase().trim();
            const roleName = (JOB_LABELS[m.role] || m.role).toLowerCase();
            const matchesSearch =
                !query ||
                m.socialName.toLowerCase().includes(query) ||
                m.email.toLowerCase().includes(query) ||
                roleName.includes(query);

            return matchesTab && matchesSearch;
        })
        .sort((a, b) => {
            if (sortOrder === 'ALPHA_ASC') {
                return a.socialName.localeCompare(b.socialName);
            }
            if (sortOrder === 'ALPHA_DESC') {
                return b.socialName.localeCompare(a.socialName);
            }
            // Ordenação por Data de Aniversário (Mês/Dia) ou Ano
            if (!a.dateOfBirth) return 1;
            if (!b.dateOfBirth) return -1;
            
            const dateA = new Date(a.dateOfBirth);
            const dateB = new Date(b.dateOfBirth);

            if (sortOrder === 'BIRTH_DATE') {
                const mmddA = dateA.getMonth() * 100 + dateA.getDate();
                const mmddB = dateB.getMonth() * 100 + dateB.getDate();
                return mmddA - mmddB;
            }
            return dateA.getTime() - dateB.getTime();
        });

    return (
        <main className="flex flex-col flex-9 bg-foreground p-5 text-background gap-5 relative">
            {/* TÍTULO E CABEÇALHO */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-2">
                <div className="flex flex-col gap-1">
                    <h1 className="text-[16pt] font-bold font-poppins text-orangeDarti">Membros da Equipe</h1>
                    <p className="font-thin text-[10pt]">
                        Consulte integrantes, gerencie permissões de acesso e clique no nome para ver o perfil completo[cite: 8, 9, 10].
                    </p>
                </div>

                {/* INDICATIVOS DE STATUS NO TOPO */}
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 bg-darkDarti px-3.5 py-1.5 rounded-full border border-greyDarti/30 text-xs font-semibold">
                        <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                        <span className="text-zinc-300">Total: <strong className="text-white">{totalCount}</strong></span>
                    </div>
                    <div className="flex items-center gap-2 bg-darkDarti px-3.5 py-1.5 rounded-full border border-greyDarti/30 text-xs font-semibold">
                        <span className="w-2.5 h-2.5 rounded-full bg-greenDarti"></span>
                        <span className="text-zinc-300">Ativos: <strong className="text-white">{activeCount}</strong></span>
                    </div>
                    <div className="flex items-center gap-2 bg-darkDarti px-3.5 py-1.5 rounded-full border border-greyDarti/30 text-xs font-semibold">
                        <span className="w-2.5 h-2.5 rounded-full bg-redDarti"></span>
                        <span className="text-zinc-300">Inativos: <strong className="text-white">{inactiveCount}</strong></span>
                    </div>
                </div>
            </div>

            {/* BARRA DE FILTROS, BUSCA E ORDENAÇÃO */}
            <div className="flex flex-wrap items-center justify-between gap-4 bg-darkDarti p-4 rounded-[20px] border border-darkDarti/80 shadow-md">
                <div className="flex flex-wrap items-center gap-4 flex-1">
                    {/* Busca */}
                    <div className="relative min-w-[280px] flex-1">
                        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Buscar por nome social, e-mail ou cargo..."
                            className="bg-foreground/50 border border-greyDarti/40 rounded-[12px] pl-10 pr-4 py-2 text-xs text-background placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-orangeDarti w-full"
                        />
                    </div>

                    {/* Abas de Filtro */}
                    <div className="flex items-center bg-foreground/40 p-1 rounded-[12px] border border-greyDarti/30 text-xs">
                        <button
                            type="button"
                            onClick={() => setFilterTab('ALL')}
                            className={`px-3.5 py-1.5 rounded-[9px] font-semibold transition cursor-pointer ${
                                filterTab === 'ALL' ? 'bg-orangeDarti text-white shadow' : 'text-zinc-300 hover:text-orangeDarti'
                            }`}
                        >
                            Todos ({totalCount})
                        </button>
                        <button
                            type="button"
                            onClick={() => setFilterTab('ACTIVE')}
                            className={`px-3.5 py-1.5 rounded-[9px] font-semibold transition cursor-pointer ${
                                filterTab === 'ACTIVE' ? 'bg-orangeDarti text-white shadow' : 'text-zinc-300 hover:text-orangeDarti'
                            }`}
                        >
                            Ativos ({activeCount})
                        </button>
                        <button
                            type="button"
                            onClick={() => setFilterTab('INACTIVE')}
                            className={`px-3.5 py-1.5 rounded-[9px] font-semibold transition cursor-pointer ${
                                filterTab === 'INACTIVE' ? 'bg-orangeDarti text-white shadow' : 'text-zinc-300 hover:text-orangeDarti'
                            }`}
                        >
                            Inativos ({inactiveCount})
                        </button>
                    </div>
                </div>

                {/* Ordenação */}
                <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-orangeDarti uppercase tracking-wider">Ordenar:</span>
                    <select
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value as SortOrder)}
                        className="bg-foreground/50 border border-greyDarti/40 rounded-[12px] py-2 px-3 text-xs text-background font-medium focus:outline-none focus:ring-2 focus:ring-orangeDarti cursor-pointer"
                    >
                        <option value="BIRTH_DATE">Data de Aniversário (Jan - Dez)[cite: 9]</option>
                        <option value="ALPHA_ASC">Ordem Alfabética (A - Z)[cite: 9]</option>
                        <option value="ALPHA_DESC">Ordem Alfabética (Z - A)[cite: 9]</option>
                        <option value="BIRTH_YEAR">Data de Nascimento (Ano)[cite: 9]</option>
                    </select>
                </div>
            </div>







            {/* TABELA DE MEMBROS */}
            <div className="bg-darkDarti rounded-[20px] border border-darkDarti/80 shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-greyDarti/20 text-[8pt] uppercase tracking-wider text-zinc-400 bg-foreground/30">
                                <th className="py-3.5 px-6 font-semibold">Nome Social & Cargo</th>
                                <th className="py-3.5 px-6 font-semibold">E-mail</th>
                                <th className="py-3.5 px-6 font-semibold">Data de Nascimento</th>
                                <th className="py-3.5 px-6 font-semibold">Status da Conta</th>
                                <th className="py-3.5 px-6 font-semibold text-right">Controle de Acesso</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-greyDarti/15 text-sm">
                            {filteredMembros.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="py-10 text-center text-xs text-zinc-400">
                                        Nenhum membro encontrado com os filtros selecionados.
                                    </td>
                                </tr>
                            ) : (
                                filteredMembros.map((membro) => {
                                    const dob = formatBirthDate(membro.dateOfBirth);
                                    return (
                                        <tr
                                            key={membro.id}
                                            onClick={() => setSelectedMembro(membro)}
                                            className="hover:bg-foreground/20 transition cursor-pointer group"
                                        >
                                            {/* Coluna 1: Nome & Avatar & Cargo */}
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="bg-orangeDarti text-foreground font-extrabold text-sm p-2 rounded-full h-10 w-10 flex items-center justify-center shrink-0 shadow">
                                                        {membro.initials}
                                                    </div>
                                                    <div>
                                                        <div className="font-semibold text-background group-hover:text-orangeDarti transition flex items-center gap-1.5">
                                                            {membro.socialName}
                                                            <Eye size={13} className="text-zinc-500 group-hover:text-orangeDarti" />
                                                        </div>
                                                        <div className="text-[9pt] font-light text-zinc-400">
                                                            {JOB_LABELS[membro.role] || membro.role}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Coluna 2: E-mail */}
                                            <td className="py-4 px-6 text-xs text-zinc-300 font-mono">
                                                {membro.email}
                                            </td>

                                            {/* Coluna 3: Data de Nascimento */}
                                            <td className="py-4 px-6">
                                                <div className="text-xs font-medium text-background">
                                                    {typeof dob === 'object' ? dob.full : dob}
                                                </div>
                                                {typeof dob === 'object' && (
                                                    <div className="text-[8pt] text-zinc-400">
                                                        Aniversário: {dob.anniversary}
                                                    </div>
                                                )}
                                            </td>

                                            {/* Coluna 4: Status da Conta */}
                                            <td className="py-4 px-6">
                                                {membro.isActive ? (
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9pt] font-semibold bg-greenDarti/15 text-greenDarti border border-greenDarti/30">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-greenDarti"></span>
                                                        Conta Ativa
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9pt] font-semibold bg-redDarti/15 text-redDarti border border-redDarti/30">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-redDarti"></span>
                                                        Conta Inativa
                                                    </span>
                                                )}
                                            </td>

                                            {/* Coluna 5: Controle de Acesso */}
                                            <td className="py-4 px-6 text-right">
                                                {membro.isActive ? (
                                                    <button
                                                        type="button"
                                                        disabled={isPending}
                                                        onClick={(e) => handleToggleStatus(membro.id, true, e)}
                                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[10px] text-xs font-semibold bg-redDarti/15 text-redDarti border border-redDarti/30 hover:bg-redDarti/25 transition cursor-pointer disabled:opacity-50"
                                                    >
                                                        <XCircle size={14} />
                                                        Desativar acesso
                                                    </button>
                                                ) : (
                                                    <button
                                                        type="button"
                                                        disabled={isPending}
                                                        onClick={(e) => handleToggleStatus(membro.id, false, e)}
                                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[10px] text-xs font-semibold bg-greenDarti/15 text-greenDarti border border-greenDarti/30 hover:bg-greenDarti/25 transition cursor-pointer disabled:opacity-50"
                                                    >
                                                        <CheckCircle size={14} />
                                                        Ativar acesso
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











            {/* MODAL DE PERFIL COMPLETO (POPUP)[cite: 10] */}
            {selectedMembro && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-darkDarti border border-greyDarti/40 rounded-[24px] shadow-2xl max-w-2xl w-full p-6 relative flex flex-col gap-5 max-h-[90vh] overflow-y-auto">
                        
                        {/* Botão Fechar */}
                        <button
                            type="button"
                            onClick={() => setSelectedMembro(null)}
                            className="absolute right-5 top-5 bg-foreground/40 hover:bg-foreground text-zinc-300 hover:text-white p-2 rounded-full transition cursor-pointer"
                        >
                            <X size={18} />
                        </button>

                        {/* Cabeçalho do Modal */}
                        <div className="flex items-center gap-4 border-b border-greyDarti/20 pb-5">
                            <div className="bg-orangeDarti text-foreground font-extrabold text-xl p-4 rounded-full h-16 w-16 flex items-center justify-center shrink-0 shadow-lg">
                                {selectedMembro.initials}
                            </div>
                            <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-3">
                                    <h2 className="text-xl font-bold text-background">{selectedMembro.socialName}</h2>
                                    {selectedMembro.isActive ? (
                                        <span className="px-2.5 py-0.5 rounded-full text-[8pt] font-semibold bg-greenDarti/15 text-greenDarti border border-greenDarti/30">
                                            • Conta Ativa
                                        </span>
                                    ) : (
                                        <span className="px-2.5 py-0.5 rounded-full text-[8pt] font-semibold bg-redDarti/15 text-redDarti border border-redDarti/30">
                                            • Conta Inativa
                                        </span>
                                    )}
                                </div>
                                <div className="text-sm font-semibold text-orangeDarti">
                                    {JOB_LABELS[selectedMembro.role] || selectedMembro.role}
                                </div>
                                <div className="text-xs text-zinc-400 font-mono">
                                    {selectedMembro.email}
                                </div>
                            </div>
                        </div>

                        {/* Seções do Perfil */}
                        <div className="flex flex-col gap-4 text-xs">
                            {/* Biografia */}
                            <div className="flex flex-col gap-1.5">
                                <span className="font-bold text-orangeDarti uppercase tracking-wider text-[8pt]">
                                    Biografia / Resumo Profissional
                                </span>
                                <div className="bg-foreground/40 border border-greyDarti/30 rounded-[12px] p-3.5 text-zinc-200 font-light leading-relaxed">
                                    {selectedMembro.bio}
                                </div>
                            </div>

                            {/* Data de Nascimento & E-mail */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col gap-1.5">
                                    <span className="font-bold text-orangeDarti uppercase tracking-wider text-[8pt]">
                                        Data de Nascimento
                                    </span>
                                    <div className="bg-foreground/40 border border-greyDarti/30 rounded-[12px] p-3 font-medium text-background">
                                        {(() => {
                                            const birthDate = formatBirthDate(selectedMembro.dateOfBirth);
                                            return typeof birthDate === 'object' ? birthDate.full : birthDate;
                                        })()}
                                    </div>
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <span className="font-bold text-orangeDarti uppercase tracking-wider text-[8pt]">
                                        E-mail Institucional
                                    </span>
                                    <div className="bg-foreground/40 border border-greyDarti/30 rounded-[12px] p-3 font-mono text-zinc-200 truncate">
                                        {selectedMembro.email}
                                    </div>
                                </div>
                            </div>

                            {/* Diretoria & Clubes */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col gap-1.5">
                                    <span className="font-bold text-orangeDarti uppercase tracking-wider text-[8pt]">
                                        Diretorias que faz parte
                                    </span>
                                    <div className="bg-foreground/40 border border-greyDarti/30 rounded-[12px] p-3 flex flex-wrap gap-1.5 min-h-[48px] items-center">
                                        {selectedMembro.board && selectedMembro.board.length > 0 ? (
                                            selectedMembro.board.map((b, idx) => (
                                                <span key={idx} className="px-2.5 py-1 bg-orangeDarti/20 text-orangeDarti border border-orangeDarti/40 rounded-[8px] text-[9pt] font-semibold capitalize">
                                                    {b.replace(/_/g, ' ').toLowerCase()}
                                                </span>
                                            ))
                                        ) : (
                                            <span className="text-zinc-500 italic">Nenhuma diretoria vinculada</span>
                                        )}
                                    </div>
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <span className="font-bold text-orangeDarti uppercase tracking-wider text-[8pt]">
                                        Clubes que faz parte
                                    </span>
                                    <div className="bg-foreground/40 border border-greyDarti/30 rounded-[12px] p-3 flex flex-wrap gap-1.5 min-h-[48px] items-center">
                                        {selectedMembro.club && selectedMembro.club.length > 0 ? (
                                            selectedMembro.club.map((c, idx) => (
                                                <span key={idx} className="px-2.5 py-1 bg-orangeDarti/20 text-orangeDarti border border-orangeDarti/40 rounded-[8px] text-[9pt] font-semibold capitalize">
                                                    {c.replace(/_/g, ' ').toLowerCase()}
                                                </span>
                                            ))
                                        ) : (
                                            <span className="text-zinc-500 italic">Nenhum clube vinculado</span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Redes & Portfólio */}
                            <div className="flex flex-col gap-1.5">
                                <span className="font-bold text-orangeDarti uppercase tracking-wider text-[8pt]">
                                    Redes & Portfólio
                                </span>
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-2 bg-foreground/40 border border-greyDarti/30 rounded-[12px] px-3 py-2 flex-1">
                                        <Link2 size={15} className="text-blue-400 shrink-0" />
                                        <span className="text-zinc-300 truncate">{selectedMembro.linkedin || 'Não informado'}</span>
                                    </div>
                                    <div className="flex items-center gap-2 bg-foreground/40 border border-greyDarti/30 rounded-[12px] px-3 py-2 flex-1">
                                        <GitBranch size={15} className="text-zinc-200 shrink-0" />
                                        <span className="text-zinc-300 truncate">{selectedMembro.github || 'Não informado'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Rodapé do Modal com Ações */}
                        <div className="flex items-center justify-between border-t border-greyDarti/20 pt-4 mt-2">
                            {selectedMembro.isActive ? (
                                <button
                                    type="button"
                                    onClick={(e) => handleToggleStatus(selectedMembro.id, true, e)}
                                    className="px-4 py-2 rounded-[12px] text-xs font-semibold bg-redDarti/15 text-redDarti border border-redDarti/30 hover:bg-redDarti/25 transition cursor-pointer"
                                >
                                    Desativar acesso deste membro
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    onClick={(e) => handleToggleStatus(selectedMembro.id, false, e)}
                                    className="px-4 py-2 rounded-[12px] text-xs font-semibold bg-greenDarti/15 text-greenDarti border border-greenDarti/30 hover:bg-greenDarti/25 transition cursor-pointer"
                                >
                                    Reativar acesso deste membro
                                </button>
                            )}

                            <button
                                type="button"
                                onClick={() => setSelectedMembro(null)}
                                className="px-6 py-2 bg-foreground hover:bg-foreground/80 text-background font-semibold rounded-[12px] transition cursor-pointer"
                            >
                                Fechar Perfil
                            </button>
                        </div>

                    </div>
                </div>
            )}
        </main>
    );
}
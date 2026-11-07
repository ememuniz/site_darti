'use client';

import { useEffect, useState, useTransition } from "react";
import { getMembrosAction, toggleUserStatusAction } from "@/actions/membros.actions";
import { Search } from "lucide-react";


interface Membro {
    id: number;
    name: string;
    socialName: string;
    initials: string;
    email: string;
    role: string;
    jobTitle: string;
    isActive: boolean;
    dateOfBirth: string | null;
    bio: string;
    linkedin: string;
    github: string;
    board: string[];
    club: string[];
}



type FilterTab = 'ALL' | 'PRESIDENTE' | 'VICE-PRESIDENTE' | 'DIRETOR' | 'LÍDER' | 'MEMBRO' | 'INACTIVE';
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


export default function CargosModule() {
    const [membros, setMembros] = useState<Membro[]>([]);
    const [filterTab, setFilterTab] = useState<FilterTab>('ALL');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [sortOrder, setSortOrder] = useState<SortOrder>('BIRTH_DATE');
    const [selectedMembro, setSelectedMembro] = useState<Membro | null>(null);
    const [screenSetCargo, setScreenSetCargo] = useState<boolean>(false);

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
    const totalCount = membros.length;
    const presidenteCount = membros.filter((membro) => membro.jobTitle === "PRESIDENTE").length;
    const vicePresidenteCount = membros.filter((membro) => membro.jobTitle === "VICE-PRESIDENTE").length;
    const diretorCount = membros.filter((membro) => membro.jobTitle === "DIRETOR").length;
    const liderCount = membros.filter((membro) => membro.jobTitle === "LÍDER").length;
    const membroCount = membros.filter((membro) => membro.jobTitle === "MEMBRO").length;


    const filteredMembros = membros
        .filter((m) => {
            const matchesTab =
                filterTab === 'ALL' ||
                (filterTab === 'PRESIDENTE' && m.jobTitle === 'PRESIDENTE') ||
                (filterTab === 'VICE-PRESIDENTE' && m.jobTitle === 'VICE-PRESIDENTE') ||
                (filterTab === 'DIRETOR' && m.jobTitle === 'DIRETOR') ||
                (filterTab === 'LÍDER' && m.jobTitle === 'LÍDER') ||
                (filterTab === 'MEMBRO' && m.jobTitle === 'MEMBRO');

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
            return 0;
        })

    return (
        <main className='flex flex-col flex-9 bg-foreground p-5 text-background gap-5 relative'>
            {/* TITULO E CABEÇALHO */}
            <div className='flex flex-wrap items-center justify-between gap-4 p-2'>
                <div className='flex flex-col gap-1' >
                    <h1 className='text-[16pt] font-bold font-poppins text-orangeDarti'>Cargos da Equipe</h1>
                    <p className='font-thin text-[10pt]'>
                        Consulte os cargos dos membros da equipe e gerencie esses cargos, adicionando ou removendo cargos dos membros da equipe.
                    </p>
                </div>

                {/* INDICATIVOS DE STATUS NO TOPO */}
                <div className='flex items-center gap-3'>
                    <div className='flex items-center gap-2 bg-darkDarti px-3.5 py-1.5 rounded-full border border-greyDarti/30 text-xs font-semibold'>
                        <span className='w-2.5 h-2.5 rounded-full bg-blue-500'></span>
                        <span className='flex text-zinc-300 gap-2'>
                            Todos os Membros:
                            <strong className='text-white'>{totalCount}</strong>
                        </span>
                    </div>

                    <div className="flex items-center gap-2 bg-darkDarti px-3.5 py-1.5 rounded-full border border-greyDarti/30 text-xs font-semibold">
                        <span className="w-2.5 h-2.5 rounded-full bg-greenDarti"></span>
                        <span className="flex text-zinc-300 gap-2">
                            Presidente:
                            <strong className="text-white">{presidenteCount}</strong></span>
                    </div>

                    <div className="flex items-center gap-2 bg-darkDarti px-3.5 py-1.5 rounded-full border border-greyDarti/30 text-xs font-semibold">
                        <span className="w-2.5 h-2.5 rounded-full bg-yellow-500"></span>
                        <span className="flex text-zinc-300 gap-2">
                            Vice-Presidente:
                            <strong className="text-white">{vicePresidenteCount}</strong></span>
                    </div>

                    <div className="flex items-center gap-2 bg-darkDarti px-3.5 py-1.5 rounded-full border border-greyDarti/30 text-xs font-semibold">
                        <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
                        <span className="flex text-zinc-300 gap-2">
                            Diretor:
                            <strong className="text-white">{diretorCount}</strong></span>
                    </div>

                    <div className="flex items-center gap-2 bg-darkDarti px-3.5 py-1.5 rounded-full border border-greyDarti/30 text-xs font-semibold">
                        <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
                        <span className="flex text-zinc-300 gap-2">
                            Líder:
                            <strong className="text-white">{liderCount}</strong></span>
                    </div>

                    <div className="flex items-center gap-2 bg-darkDarti px-3.5 py-1.5 rounded-full border border-greyDarti/30 text-xs font-semibold">
                        <span className="w-2.5 h-2.5 rounded-full bg-gray-500"></span>
                        <span className="flex text-zinc-300 gap-2">
                            Membro:
                            <strong className="text-white">{membroCount}</strong></span>
                    </div>
                </div>
            </div>

            {/* BARRA DE FILTROS, BUSCA E ORDENAÇÃO */}
            <div className='flex flex-col w-full items-start justify-between gap-4 bg-darkDarti p-4 rounded-[20px] border border-darkDarti/80 shadow-md'>
                <div className='flex w-full items-center justify-between gap-4 flex-1'>
                    {/* Busca */}
                    <div className='relative min-w-[280px] flex-4'>
                        <Search
                            className='absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400'
                        />
                        <input 
                            type="text"
                            value={searchQuery}
                            onChange={
                                (e) => setSearchQuery(e.target.value )
                            } 
                            placeholder="Buscar por nome social, email ou cargo..." 
                            className='bg-foreground/50 border border-greyDarti/40 rounded-[12px] pl-10 pr-4 py-2 text-xs text-background placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-orangeDarti w-full'
                        />
                    </div>
                    {/* Ordenação */}
                    <div className='flex flex-2 items-center gap-2'>
                        <span className='text-xs font-semibold text-orangeDarti uppercase tracking-wider'>
                            Ordenar:
                        </span>

                        <select
                            value={sortOrder}
                            onChange={(e) => setSortOrder(e.target.value as SortOrder)}
                            className='bg-foreground/50 border border-greyDarti/40 rounded-[12px] py-2 px-6 text-xs text-background font-medium focus:outline-none focus:ring-2 focus:ring-orangeDarti cursor-pointer w-full'
                        >
                            <option value="ALPHA_ASC">Ordem Alfabética (A-Z)</option>
                            <option value="ALPHA_DESC">Ordem Alfabética (Z-A)</option>
                        </select>
                    </div>            
                </div>

                {/* Abas de Filtro */}
                <div className='flex items-center bg-foreground/40 p-1 rounded-[12px] border border-greyDarti/30 text-xs'>
                    <button
                        type="button"
                        onClick={() => setFilterTab('ALL')}
                        className={`px-3.5 py-1.5 rounded-[9px] font-semibold transition cursor-pointer 
                            ${filterTab === 'ALL' ? 'bg-orangeDarti text-white shadow' : 'text-zinc-300 hover:text-orangeDarti'}`}
                    >
                        Todos ({totalCount})
                    </button>
                    <button
                        type="button"
                        onClick={() => setFilterTab('PRESIDENTE')}
                        className={`px-3.5 py-1.5 rounded-[9px] font-semibold transition cursor-pointer 
                            ${filterTab === 'PRESIDENTE' ? 'bg-orangeDarti text-white shadow' : 'text-zinc-300 hover:text-orangeDarti'}`}
                    >
                        Presidente ({presidenteCount})
                    </button>
                    <button
                        type="button"
                        onClick={() => setFilterTab('VICE-PRESIDENTE')}
                        className={`px-3.5 py-1.5 rounded-[9px] font-semibold transition cursor-pointer 
                            ${filterTab === 'VICE-PRESIDENTE' ? 'bg-orangeDarti text-white shadow' : 'text-zinc-300 hover:text-orangeDarti'}`}
                    >
                        Vice-Presidente ({vicePresidenteCount})
                    </button>
                    <button
                        type="button"
                        onClick={() => setFilterTab('DIRETOR')}
                        className={`px-3.5 py-1.5 rounded-[9px] font-semibold transition cursor-pointer 
                            ${filterTab === 'DIRETOR' ? 'bg-orangeDarti text-white shadow' : 'text-zinc-300 hover:text-orangeDarti'}`}
                    >
                        Diretor ({diretorCount})
                    </button>
                    <button
                        type="button"
                        onClick={() => setFilterTab('LÍDER')}
                        className={`px-3.5 py-1.5 rounded-[9px] font-semibold transition cursor-pointer 
                            ${filterTab === 'LÍDER' ? 'bg-orangeDarti text-white shadow' : 'text-zinc-300 hover:text-orangeDarti'}`}
                    >
                        Líder ({liderCount})
                    </button>
                    <button
                        type="button"
                        onClick={() => setFilterTab('MEMBRO')}
                        className={`px-3.5 py-1.5 rounded-[9px] font-semibold transition cursor-pointer 
                            ${filterTab === 'MEMBRO' ? 'bg-orangeDarti text-white shadow' : 'text-zinc-300 hover:text-orangeDarti'}`}
                    >
                        Membro ({membroCount})
                    </button>
                </div>
            </div>

            {/* TABELA DE MEMBROS */}
            <div className='bg-darkDarti rounded-[20px] border border-darkDarti/80 shadow-md overflow-hidden'>
                <div className='overflow-x-auto'>
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className='border-b border-greyDarti/20 text-[8pt] uppercase tracking-wider text-zinc-400 bg-foreground/30'>
                                <th className='py-3.5 px-6 font-semibold'>Nome Social</th>
                                <th className='py-3.5 px-6 font-semibold'>E-mail</th>
                                <th className='py-3.5 px-6 font-semibold'>Cargo</th>
                                <th className='py-3.5 px-6 font-semibold text-right'>Confirmar Cargo</th>
                            </tr>
                        </thead>

                        <tbody className='divide-y divide-greyDarti/15 text-sm'>
                            {filteredMembros.length === 0 ?
                            (
                                <tr>
                                    <td colSpan={5} className='py-10 text-center text-xs text-zinc-400'>
                                        Nenhum membro encontrado com os filtros selecionados.
                                    </td>
                                </tr>
                            ) : (
                                filteredMembros.map((membro) => {
                                    return (
                                        <tr
                                            key={membro.id}
                                            onClick={() => setSelectedMembro(membro)}
                                            className='hover:bg-foreground/20 transition cursor-pointer group'
                                        >
                                            {/* Social Name */}
                                            <td className='py-4 px-6'>
                                                <div className='flex items-center gap-3'>
                                                    <div className='bg-orangeDarti text-foreground font-extrabold text-sm p-2 rounded-full h-10 w-10 flex items-center justify-center shrink-0 shadow'>
                                                        {membro.initials}
                                                    </div>
                                                    <div className='font-semibold text-background group-hover:text-orangeDarti transition flex items-center gap-1.5'>
                                                        {membro.socialName}
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Email */}
                                            <td className='py-4 px-6 text-xs text-zinc-300 font-mono'>
                                                {membro.email}
                                            </td>

                                            {/* Job Title */}
                                            <td className="py-4 px-6">
                                                {membro.jobTitle === 'PRESIDENTE' ? (
                                                    <span
                                                        className='inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9pt] font-semibold bg-greenDarti/15 text-greenDarti border border-greenDarti/30'
                                                    >
                                                        <span
                                                            className='w-1.5 h-1.5 rounded-full bg-greenDarti'
                                                        >
                                                        </span>
                                                        {membro.jobTitle}
                                                    </span>
                                                ):(
                                                    membro.jobTitle === 'VICE-PRESIDENTE' ? (
                                                        <span 
                                                            className='inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9pt] font-semibold bg-yellow-500/15 text-yellow-500 border border-yellow-500/30'
                                                        >
                                                            <span
                                                                className='w-1.5 h-1.5 rounded-full bg-yellow-500'
                                                            >
                                                            </span>
                                                            {membro.jobTitle}
                                                        </span>

                                                    ):(
                                                        membro.jobTitle === 'DIRETOR' ? (
                                                            <span
                                                                className='inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9pt] font-semibold bg-red-500/15 text-red-500 border border-red-500/30'
                                                            >
                                                                <span
                                                                    className='w-1.5 h-1.5 rounded-full bg-red-500'
                                                                >
                                                                </span>
                                                                {membro.jobTitle}
                                                            </span>
                                                        ):(
                                                            membro.jobTitle === 'LÍDER' ? (
                                                                <span
                                                                    className='inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9pt] font-semibold bg-purple-500/15 text-purple-500 border border-purple-500/30'
                                                                >
                                                                    <span
                                                                        className='w-1.5 h-1.5 rounded-full bg-purple-500'
                                                                    >
                                                                    </span>
                                                                    {membro.jobTitle}
                                                                </span>
                                                            ):(
                                                                <span
                                                                    className='inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9pt] font-semibold bg-gray-500/15 text-gray-500 border border-gray-500/30'
                                                                >
                                                                    <span
                                                                        className='w-1.5 h-1.5 rounded-full bg-gray-500'
                                                                    >
                                                                    </span>
                                                                    {membro.jobTitle}
                                                                </span>
                                                            )
                                                        )
                                                    )

                                                )}
                                            </td>

                                            {/* Atualizar Cargo */}
                                            <td className='py-4 px-6 text-right'>
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setSelectedMembro(membro);
                                                        setScreenSetCargo(true);
                                                    }}
                                                    className='bg-orangeDarti hover:bg-blue-600 text-white text-xs font-semibold py-1.5 px-3 rounded-[9px] transition'
                                                >
                                                    Atualizar Cargo
                                                </button>
                                            </td>
                                        </tr>
                                    )
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {screenSetCargo && 
            (
                <div className='fixed inset-0 bg-black/50 z-50 flex items-center justify-center'>
                    <div className='bg-darkDarti rounded-[20px] border border-darkDarti/80 shadow-md p-6 w-[400px]'>
                        <h2 className='text-lg font-semibold text-orangeDarti mb-4'>Atualizar Cargo</h2>
                    </div>
                </div>
            )}

            

            





        </main>
    )
}
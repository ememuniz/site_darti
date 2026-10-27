import { useState } from 'react';
import { updateUserDataAction } from '@/actions/setters.actions';
import { useActionState } from 'react';

interface PerfilModuleProps {
    userName: string;
    userNameSocial: string;
    userNameComplete?: string;
    userNameSocialComplete?: string;
    initials?: string;
    initialsSocial?: string;
    board?: string[];
    role?: string;
    club?: string[];
    email?: string;
    isActive?: boolean;
    dateOfBirth?: string;
    bio?: string;
}

export default function PerfilModule({ 
    userName, 
    userNameSocial, 
    userNameComplete, 
    userNameSocialComplete, 
    initials, 
    initialsSocial, 
    board, 
    role, 
    club, 
    email, 
    isActive, 
    dateOfBirth,
    bio
}: PerfilModuleProps) {
    const isSingleBoard = Array.isArray(board) && board.length === 1;
    const isFullBoard = Array.isArray(board) && board.length === 6;
    const isSingleClub = Array.isArray(club) && club.length === 1;
    const isFullClub = Array.isArray(club) && club.length === 19;
    const [dadosPessoais, setDadosPessoais] = useState(true);
    const [seguranca, setSeguranca] = useState(false);
    const [linksRedes, setLinksRedes] = useState(false);
    const [state, formUserData, isPending ] = useActionState(updateUserDataAction, null);
    const formattedDate = dateOfBirth ? new Date(dateOfBirth).toISOString().split('T')[0] : '';


    return (
        <main className="flex flex-col flex-9 bg-foreground p-5 text-background gap-5">
            <div className='flex flex-col p-2 h-fit justify-center gap-1 py-4'>
                <h1 className='text-[15pt] font-bold font-poppins text-orangeDarti '>Meu Perfil</h1>
                <p className='font-thin text-[10pt] '>Gerencie suas informações pessoais e credenciais de acesso</p>
            </div>
            <div className='flex flex-6 h-full gap-5'>
                <div className='flex flex-1 flex-col h-fit items-center justify-center bg-darkDarti rounded-3xl shadow-lg border border-darkDarti/80 py-7 gap-1.5'>
                    <div className='bg-orangeDarti text-foreground font-extrabold text-2xl p-3 rounded-full h-15 w-15 flex items-center justify-center'>
                        {userNameSocialComplete === '' ? initials : initialsSocial}
                    </div>
                    <div className='flex flex-col justify-center items-center h-fit pb-2'>
                        <div className='flex pb-0.1 text-[16pt] font-bold text-center'>
                            {userNameSocialComplete === '' ? userName : userNameSocial}
                        </div>
                        <div className="flex items-center justify-center w-fit h-fit py-0.5 px-3 rounded-full text-[9pt] bg-greenDarti font-bold ">
                            {role}
                        </div>
                        <div className='flex text-[8pt] pt-1 w-full justify-center items-center'>
                            { email }
                        </div>
                    </div>
                    <div className="flex flex-col w-full gap-0.5">
                        <div className="flex items-center justify-center text-center text-[12pt] px-4 pb-1">
                            {isSingleBoard ? 'Diretoria' : 'Diretorias'}
                        </div>

                        <div
                            className={
                                isSingleBoard || isFullBoard
                                    ? 'flex justify-center text-center w-full px-4'
                                    : 'grid grid-cols-3 gap-1.5 w-full px-4'
                            }
                        >
                            {!isFullBoard ? (board ?? []).map((b, index) => (
                                <div
                                    key={index}
                                    className="text-[7pt] font-light text-background capitalize flex items-center justify-center py-1.5 px-1 bg-orangeDarti/30 rounded-full text-center border border-orangeDarti/40 w-full"
                                >
                                    {b}
                                </div>
                            ))
                            : 
                            <div className='text-[8pt] text-background capitalize flex items-center justify-center border w-full py-1.5 px-1 bg-orangeDarti/30 rounded-full text-center border-orangeDarti/40'>
                                Todas as diretorias
                            </div>
                            }
                        </div>
                    </div>

                    <div className='flex flex-col w-full gap-0.5'>
                        <div className='flex pt-2 items-center justify-center text-center text-[12pt] px-4 pb-1'>
                            {isSingleClub ? 'Clube' : 'Clubes'}
                        </div>

                        <div
                            className={
                                isSingleClub || isFullClub
                                    ? 'flex justify-center text-center w-full px-4'
                                    : 'grid grid-cols-3 gap-1.5 w-full px-4'
                            }
                        >
                            {!isFullClub ? (club ?? []).map((b, index) => (
                                <div
                                    key={index}
                                    className="text-[7pt] text-background capitalize flex items-center justify-center py-1.5 px-1 bg-orangeDarti/30 rounded-full text-center border border-orangeDarti/40 w-full"
                                >
                                    {b}
                                </div>
                            ))
                            : 
                            <div className='text-[8pt] text-background capitalize flex items-center justify-center border w-full py-1.5 px-1 bg-orangeDarti/30 rounded-full text-center border-orangeDarti/40'>
                                
                            Todos os clubes
                            </div>}
                        </div>

                        <div className='flex borderw-full gap-0.5 justify-center items-center pt-6 w-full gap-2'>
                            <div className={
                                isActive
                                    ? "flex bg-greenDarti h-2 w-2 rounded-full"
                                    : "flex bg-redDarti h-2 w-2 rounded-full"
                                }>
                            </div>
                            <div 
                                className={
                                    isActive
                                        ? 'flex text-[10pt] text-greenDarti font-bold'
                                        : 'flex text-[10pt] text-redDarti font-bold'
                                }
                            >{isActive ? 'Ativo' : 'Inativo'} - DARTilab</div>
                        </div>


                    </div>
                </div>

                <div className='flex flex-col gap-2 flex-2 h-fit bg-darkDarti rounded-3xl shadow-lg border border-darkDarti/80 p-7'>
                    <div className='flex justify-around items-end w-full h-[60px] border-b-2 border-gray-400/30'>
                        <button 
                            className={
                                dadosPessoais
                                ? 'border-b-2 px-2 py-1.5 text-orangeDarti font-bold' 
                                : 'px-2 py-2 font-bold hover:text-orangeDarti'
                            }
                            onClick={() => {
                                setDadosPessoais(true);
                                setSeguranca(false);
                                setLinksRedes(false);
                            }
                            }
                        >
                            Dados Pessoais
                        </button>
                        <button 
                            className={
                                seguranca
                                ? 'border-b-2 px-2 py-1.5 text-orangeDarti font-bold' 
                                : 'px-2 py-2 font-bold hover:text-orangeDarti'
                            }
                            onClick={() => {
                                setDadosPessoais(false);
                                setSeguranca(true);
                                setLinksRedes(false);
                            }
                            }
                        >
                            Segurança
                        </button>
                        <button 
                            className={
                                linksRedes
                                ? 'border-b-2 px-2 py-1.5 text-orangeDarti font-bold' 
                                : 'px-2 py-2 font-bold hover:text-orangeDarti'
                            }
                            onClick={() => {
                                setDadosPessoais(false);
                                setSeguranca(false);
                                setLinksRedes(true);
                            }
                            }
                        >
                            Links e Redes
                        </button>
                    </div>
                    <div className='flex-1 w-full flex'>
                        {dadosPessoais && (
                            <form action={formUserData} className='flex flex-1 justify-center items-center pt-4'>
                                <div className='flex flex-col h-full w-full'>
                                    <div className='flex h-fit w-full pt-1 border-orangeDarti gap-6'>
                                        <div className='flex flex-col flex-1 h-[160px]'>
                                            <div className='flex flex-1 flex-col gap-1 w-full justify-center'>
                                                <label htmlFor="name" className='text-orangeDarti font-semibold'>Nome Completo</label>
                                                <input 
                                                    type="text"
                                                    name="name"
                                                    placeholder={userNameComplete ? userNameComplete : 'Escreva seu nome completo aqui...'}
                                                    className='bg-greyDarti/30 text-[9pt] border border-greyDarti/50 rounded-[10px] py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500'
                                                />
                                            </div>
                                            <div className='flex flex-1 flex-col gap-1 w-full justify-center'>
                                                <label htmlFor="email" className='text-orangeDarti font-semibold'>Email</label>
                                                <input 
                                                    type="email"
                                                    name="email"
                                                    placeholder={email ? email : 'Escreva seu email aqui...'}
                                                    className='bg-greyDarti/30 text-[9pt] border border-greyDarti/50 rounded-[10px] py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500'
                                                />
                                            </div>
                                        </div>
                                        <div className='flex flex-1 flex-col h-[160px]'>
                                            <div className='flex flex-1 flex-col gap-1 w-full justify-center'>
                                                <label htmlFor="socialName" className='text-orangeDarti font-semibold'>Nome Social</label>
                                                <input 
                                                    type="text"
                                                    name="socialName"
                                                    placeholder={ userNameSocialComplete ? userNameSocialComplete : 'Escreva seu nome social aqui...'}
                                                    className='bg-greyDarti/30 text-[9pt] border border-greyDarti/50 rounded-[10px] py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500'
                                                />
                                            </div>
                                            <div className='flex flex-1 flex-col gap-1 w-full justify-center'>
                                                <label htmlFor="dateOfBirth" className='text-orangeDarti font-semibold'>Data de Nascimento</label>
                                                <input
                                                    type="date"
                                                    name="dateOfBirth"
                                                    defaultValue={formattedDate}
                                                    className='bg-greyDarti/30 text-[9pt] border border-greyDarti/50 rounded-[10px] py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500'
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className='flex h-fit w-full pt-1 pb-4'>
                                        <div className='flex flex-1 flex-col h-[140px]'>
                                            <div className='flex flex-1 flex-col gap-1 w-full justify-center'>
                                                <label htmlFor="bio" className='text-orangeDarti font-semibold'>Biografia</label>
                                                <textarea
                                                    name="bio"
                                                    placeholder={bio ? bio : 'Escreva sua biografia aqui...'}
                                                    className='bg-greyDarti/30 text-[9pt] borderborder-greyDarti/50 h-full rounded-[10px] py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500'
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className='flex h-fit w-full justify-end items-start'>
                                        <button 
                                            type='submit'
                                            className='bg-orangeDarti text-white font-semibold py-2 px-4 rounded-[10px] hover:bg-orangeDarti/80 focus:outline-none focus:ring-2 focus:ring-blue-500'>
                                            Salvar Alterações
                                        </button>
                                    </div>
                                </div>
                            </form>
                        )}





                        {seguranca && (
                            <form action={formUserData} className='flex flex-1 justify-center items-center pt-6'>
                                <div className='flex flex-col h-full w-full'>
                                    <div className='flex h-fit w-full pt-1 border-orangeDarti gap-6'>
                                        <div className='flex flex-1 flex-col gap-1 w-full justify-center'>
                                            <label htmlFor="passwordAtual" className='text-orangeDarti font-semibold'>Senha Atual</label>
                                            <input 
                                                type="password"
                                                name="passwordAtual"
                                                placeholder={'Escreva sua senha atual aqui...'}
                                                className='bg-greyDarti/30 text-[9pt] border border-greyDarti/50 rounded-[10px] py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500'
                                            />
                                        </div>
                                    </div>
                                    <div className='flex h-fit w-full py-4 gap-6'>
                                        <div className='flex flex-1 flex-col gap-1 w-full justify-center'>
                                            <label htmlFor="passwordNova" className='text-orangeDarti font-semibold'>Nova Senha</label>
                                            <input 
                                                type="password"
                                                name="passwordNova"
                                                placeholder={'Escreva sua nova senha aqui...'}
                                                className='bg-greyDarti/30 text-[9pt] border border-greyDarti/50 rounded-[10px] py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500'
                                            />
                                        </div>

                                        <div className='flex flex-1 flex-col gap-1 w-full justify-center'>
                                            <label htmlFor="passwordConfirmacao" className='text-orangeDarti font-semibold'>Confirmar Nova Senha</label>
                                            <input 
                                                type="password"
                                                name="passwordConfirmacao"
                                                placeholder={'Confirme sua nova senha aqui...'}
                                                className='bg-greyDarti/30 text-[9pt] border border-greyDarti/50 rounded-[10px] py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500'
                                            />
                                        </div>
                                    </div>
                                    <div className='flex h-fit w-full justify-between items-center'>
                                        {state?.message ? (
                                            <p className={`text-[9pt] font-semibold pb-2 ${state?.isCorrect ? 'text-greenDarti' : 'text-redDarti'}`}>
                                                {state.message}{isPending && ' (Carregando...)'}
                                            </p>
                                        ) : (
                                            <p className={`text-[9pt] font-semibold pb-2 ${state?.isCorrect ? 'text-greenDarti' : 'text-redDarti'}`}>
                                            </p>
                                        )}
                                        <button 
                                            type='submit'
                                            className='bg-orangeDarti text-white font-semibold py-2 px-4 rounded-[10px] hover:bg-orangeDarti/80 focus:outline-none focus:ring-2 focus:ring-blue-500'
                                        >
                                            Atualizar Senha
                                        </button>
                                    </div>
                                </div>
                            </form>
                        )}

                        {linksRedes && (
                            <form action={formUserData} className='flex flex-1 justify-center items-center pt-7'>
                                <div className='flex flex-col h-full w-full gap-4'>
                                    <div className='flex flex-1 flex-col gap-1 w-full justify-center'>
                                        <label htmlFor="linkedin" className='text-orangeDarti font-semibold'>LinkedIn</label>
                                        <input 
                                            type="text"
                                            name="linkedin"
                                            placeholder={'Cole seu link do LinkedIn aqui...'}
                                            className='bg-greyDarti/30 text-[9pt] border border-greyDarti/50 rounded-[10px] py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500'
                                        />
                                    </div>
                                    <div className='flex flex-1 flex-col gap-1 w-full justify-center'>
                                        <label htmlFor="github" className='text-orangeDarti font-semibold'>GitHub</label>
                                        <input 
                                            type="text"
                                            name="github"
                                            placeholder={'Cole seu link do GitHub aqui...'}
                                            className='bg-greyDarti/30 text-[9pt] border border-greyDarti/50 rounded-[10px] py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500'
                                        />
                                    </div>
                                    <div className='flex h-fit w-full justify-end items-start'>
                                        <button 
                                            type='submit'
                                            className='bg-orangeDarti text-white font-semibold py-2 px-4 rounded-[10px] hover:bg-orangeDarti/80 focus:outline-none focus:ring-2 focus:ring-blue-500'>
                                            Salvar Links
                                        </button>
                                    </div>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </main>
    )
}
'use client';
import { 
    ChevronsRight, 
    ChevronsDown, 
    UserRound, 
    UsersRound, 
    Mails, 
    Pickaxe,
    UserRoundGroup, 
    Clock,
    FileText 
} from "lucide-react";
import { useState } from "react";


interface MenuAdmEquipeProps {
    setIsMeuPerfil: (isMeuPerfil: boolean) => void;
    setIsMembros: (isMembros: boolean) => void;
    setIsConvites: (isConvites: boolean) => void;
    setIscargos: (iscargos: boolean) => void;
    setIsgrupos: (isgrupos: boolean) => void;
    setIsatividades: (isatividades: boolean) => void;
    setIsrelatorios: (isrelatorios: boolean) => void;
    isMeuPerfil: boolean;
    isMembros: boolean;
    isConvites: boolean;
    iscargos: boolean;
    isgrupos: boolean;
    isatividades: boolean;
    isrelatorios: boolean;
}

export default function MenuAdmEquipe({ 
        setIsMeuPerfil,
        setIsMembros,
        setIsConvites,
        setIscargos,
        setIsgrupos,
        setIsatividades,
        setIsrelatorios,
        isMeuPerfil,
        isMembros,
        isConvites,
        iscargos,
        isgrupos,
        isatividades,
        isrelatorios
     }: MenuAdmEquipeProps){
    const [isOpen, setIsOpen] = useState(false);

    return(
        <div className='flex flex-col w-full'>
            <div className='flex justify-between w-full gap-1 items-center pb-1'>
                <h3 className='text-[11pt] flex-5 font-poppins'>EQUIPE</h3>
                <button  onClick={() => setIsOpen(!isOpen)} className='flex w-fit'>
                    {isOpen ? <ChevronsDown className='flex-1 w-[40px]' /> : <ChevronsRight className='flex-1 w-[40px]' />}
                </button>
            </div>
            {isOpen && (
                <div className='flex flex-col w-full'>

                    {isMeuPerfil ? (
                        <button 
                            onClick={() => {
                                setIsMeuPerfil(true); 
                                setIsMembros(false); 
                                setIsConvites(false); 
                                setIscargos(false); 
                                setIsgrupos(false); 
                                setIsatividades(false); 
                                setIsrelatorios(false);}} 
                            className='flex justify-start w-full gap-1 text-orangeDarti items-center px-3 text-[11pt] py-1 font-poppins gap-3'
                        >
                            <UserRound className='flex w-fit h-4.5'/>
                            Meu Perfil
                        </button>
                    ) : (
                        <button 
                            onClick={() => {
                                setIsMeuPerfil(true); 
                                setIsMembros(false); 
                                setIsConvites(false); 
                                setIscargos(false); 
                                setIsgrupos(false); 
                                setIsatividades(false); 
                                setIsrelatorios(false);}} 
                            className='flex justify-start w-full gap-3 items-center px-3 text-[11pt] py-1 font-poppins hover:text-orangeDarti'
                        >
                            <UserRound className='flex w-fit h-4.5'/>
                            Meu Perfil
                        </button>
                    )}

                    {isMembros ? (
                        <button 
                            onClick={() => {
                                setIsMeuPerfil(false); 
                                setIsMembros(true); 
                                setIsConvites(false); 
                                setIscargos(false); 
                                setIsgrupos(false); 
                                setIsatividades(false); 
                                setIsrelatorios(false);}} 
                            className='flex justify-start w-full gap-1 text-orangeDarti items-center px-3 text-[11pt] py-1 font-poppins gap-3'
                        >
                            <UsersRound className='flex w-fit h-4.5'/>
                            Membros
                        </button>
                    ) : (
                        <button 
                            onClick={() => {
                                setIsMeuPerfil(false); 
                                setIsMembros(true); 
                                setIsConvites(false); 
                                setIscargos(false); 
                                setIsgrupos(false); 
                                setIsatividades(false); 
                                setIsrelatorios(false);}} 
                            className='flex justify-start w-full gap-3 items-center px-3 text-[11pt] py-1 font-poppins hover:text-orangeDarti'
                        >
                            <UsersRound className='flex w-fit h-4.5'/>
                            Membros
                        </button>
                    )}

                    {isConvites ? (
                        <button 
                            onClick={() => {
                                setIsMeuPerfil(false); 
                                setIsMembros(false); 
                                setIsConvites(true); 
                                setIscargos(false); 
                                setIsgrupos(false); 
                                setIsatividades(false); 
                                setIsrelatorios(false);}} 
                            className='flex justify-start w-full gap-1 text-orangeDarti items-center px-3 text-[11pt] py-1 font-poppins gap-3'
                        >
                            <Mails className='flex w-fit h-4.5'/>
                            Convites
                        </button>
                    ) : (
                        <button 
                            onClick={() => {
                                setIsMeuPerfil(false); 
                                setIsMembros(false); 
                                setIsConvites(true); 
                                setIscargos(false); 
                                setIsgrupos(false); 
                                setIsatividades(false); 
                                setIsrelatorios(false);}} 
                            className='flex justify-start w-full gap-3 items-center px-3 text-[11pt] py-1 font-poppins hover:text-orangeDarti'
                        >
                            <Mails className='flex w-fit h-4.5'/>
                            Convites
                        </button>
                    )}

                    {iscargos ? (
                        <button 
                            onClick={() => {
                                setIsMeuPerfil(false); 
                                setIsMembros(false); 
                                setIsConvites(false); 
                                setIscargos(true); 
                                setIsgrupos(false); 
                                setIsatividades(false); 
                                setIsrelatorios(false);}} 
                            className='flex justify-start w-full gap-1 text-orangeDarti items-center px-3 text-[11pt] py-1 font-poppins gap-3'
                        >
                            <Pickaxe className='flex w-fit h-4.5'/>
                            Cargos
                        </button>
                    ) : (
                        <button 
                            onClick={() => {
                                setIsMeuPerfil(false); 
                                setIsMembros(false); 
                                setIsConvites(false); 
                                setIscargos(true); 
                                setIsgrupos(false); 
                                setIsatividades(false); 
                                setIsrelatorios(false);}} 
                            className='flex justify-start w-full gap-3 items-center px-3 text-[11pt] py-1 font-poppins hover:text-orangeDarti'
                        >
                            <Pickaxe className='flex w-fit h-4.5'/>
                            Cargos
                        </button>
                    )}

                    {isgrupos ? (
                        <button 
                            onClick={() => {
                                setIsMeuPerfil(false); 
                                setIsMembros(false); 
                                setIsConvites(false); 
                                setIscargos(false); 
                                setIsgrupos(true); 
                                setIsatividades(false); 
                                setIsrelatorios(false);}} 
                            className='flex justify-start w-full gap-1 text-orangeDarti items-center px-3 text-[11pt] py-1 font-poppins gap-3'
                        >
                            <UserRoundGroup className='flex w-fit h-4.5'/>
                            Grupos
                        </button>
                    ) : (
                        <button 
                            onClick={() => {
                                setIsMeuPerfil(false); 
                                setIsMembros(false); 
                                setIsConvites(false); 
                                setIscargos(false); 
                                setIsgrupos(true); 
                                setIsatividades(false); 
                                setIsrelatorios(false);}} 
                            className='flex justify-start w-full gap-3 items-center px-3 text-[11pt] py-1 font-poppins hover:text-orangeDarti'
                        >
                            <UserRoundGroup className='flex w-fit h-4.5'/>
                            Grupos
                        </button>
                    )}

                    {isatividades ? (
                        <button 
                            onClick={() => {
                                setIsMeuPerfil(false); 
                                setIsMembros(false); 
                                setIsConvites(false); 
                                setIscargos(false); 
                                setIsgrupos(false); 
                                setIsatividades(true); 
                                setIsrelatorios(false);}} 
                            className='flex justify-start w-full gap-1 text-orangeDarti items-center px-3 text-[11pt] py-1 font-poppins gap-3'
                        >
                            <Clock className='flex w-fit h-4.5'/>
                            Atividades
                        </button>
                    ) : (
                        <button 
                            onClick={() => {
                                setIsMeuPerfil(false); 
                                setIsMembros(false); 
                                setIsConvites(false); 
                                setIscargos(false); 
                                setIsgrupos(false); 
                                setIsatividades(true); 
                                setIsrelatorios(false);}} 
                            className='flex justify-start w-full gap-3 items-center px-3 text-[11pt] py-1 font-poppins hover:text-orangeDarti'
                        >
                            <Clock className='flex w-fit h-4.5'/>
                            Atividades
                        </button>
                    )}

                    {isrelatorios ? (
                        <button 
                            onClick={() => {
                                setIsMeuPerfil(false); 
                                setIsMembros(false); 
                                setIsConvites(false); 
                                setIscargos(false); 
                                setIsgrupos(false); 
                                setIsatividades(false); 
                                setIsrelatorios(true);}} 
                            className='flex justify-start w-full gap-1 text-orangeDarti items-center px-3 text-[11pt] py-1 font-poppins gap-3'
                        >
                            <FileText className='flex w-fit h-4.5'/>
                            Relatórios
                        </button>
                    ) : (
                        <button 
                            onClick={() => {
                                setIsMeuPerfil(false); 
                                setIsMembros(false); 
                                setIsConvites(false); 
                                setIscargos(false); 
                                setIsgrupos(false); 
                                setIsatividades(false); 
                                setIsrelatorios(true);}} 
                            className='flex justify-start w-full gap-3 items-center px-3 text-[11pt] py-1 font-poppins hover:text-orangeDarti'
                        >
                            <FileText className='flex w-fit h-4.5'/>
                            Relatórios
                        </button>
                    )}
                </div>
            )}
        </div>
    )
}
'use client';

import MenuAdmEquipe from "./MenuAdmEquipe";
import { useState } from "react";
import PerfilModule from "./PerfilModule";
import ConviteModule from "./ConviteModule";

interface MenuAdminProps {
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

export default function MenuAdmin({ 
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
}: MenuAdminProps) {
    const [meuPerfil, setMeuPerfil] = useState(false);
    const [membros , setMembros] = useState(false);
    const [Convites, setConvites] = useState(true);
    const [cargos, setcargos] = useState(false);
    const [grupos, setgrupos] = useState(false);
    const [atividades, setatividades] = useState(false);
    const [relatorios, setrelatorios] = useState(false);
    

    return (
        <div className="flex justify-between w-full min-h-screen h-fit bg-orangeDarti font-montserrat">
            <div className="flex flex-col flex-2 justify-start items-center bg-darkDarti text-white shadow-[-15px_0px_25px_-5px_rgba(0,0,0,0.1)] py-3 pr-3 pl-6">

                <div className='flex flex-col w-full flex-1 items-center justify-start gap-2 py-2 '>
                    <div className=" w-full text-center text-[clamp(10pt,15pt, 30pt)] whitespace-nowrap font-bold pt-2 pb-5 text-orangeDarti"> 
                        {userNameSocial}
                    </div>
                    <MenuAdmEquipe
                        setIsMeuPerfil={setMeuPerfil}
                        setIsMembros={setMembros}
                        setIsConvites={setConvites}
                        setIscargos={setcargos}
                        setIsgrupos={setgrupos}
                        setIsatividades={setatividades}
                        setIsrelatorios={setrelatorios}
                        isMeuPerfil={meuPerfil}
                        isMembros={membros}
                        isConvites={Convites}
                        iscargos={cargos}
                        isgrupos={grupos}
                        isatividades={atividades}
                        isrelatorios={relatorios}
                    />
                </div>                
            </div>

            {meuPerfil && (
                <PerfilModule 
                    userName={userName}
                    userNameSocial={userNameSocial} 
                    userNameComplete={userNameComplete} 
                    userNameSocialComplete={userNameSocialComplete}
                    initials={initials} 
                    initialsSocial={initialsSocial}
                    board={board} 
                    role={role} 
                    club={club} 
                    email={email} 
                    isActive={isActive} 
                    dateOfBirth={dateOfBirth}
                    bio={bio}
                />
            )}
            {membros && (
                <div className=" flex-9">Membros</div>
            )}
            {Convites && (
                <ConviteModule />
            )}
            {cargos && (
                <div className=" flex-9">Cargos</div>
            )}
            {grupos && (
                <div className=" flex-9">Grupos</div>
            )}
            {atividades && (
                <div className=" flex-9">Atividades</div>
            )}
            {relatorios && (
                <div className=" flex-9">Relatórios</div>
            )}
        </div>
    )
}
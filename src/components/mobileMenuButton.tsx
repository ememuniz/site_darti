"use client"

import { useState } from "react"
import { Menu, LogIn, LogOut } from "lucide-react"
import Link from "next/link"
import { logoutAction } from "@/actions/auth.actions"

// Definimos o que este componente vai receber da Navbar
interface MobileMenuButtonProps {
    showLogout: boolean;
    login?: boolean;
}

export default function MobileMenuButton({ showLogout, login }: MobileMenuButtonProps) {
    const [menuOpen, setMenuOpen] = useState(false)

    return (
        <>
            <button 
                onClick={() => setMenuOpen(!menuOpen)} 
                className='max-[925px]:flex hidden border h-full items-center justify-center w-[45px] cursor-pointer'
            >
                <Menu className="h-full w-full text-white" />
            </button>

            {menuOpen && (
                <div className="absolute top-[65px] left-0 w-full bg-blueDarti flex flex-col items-center py-4 gap-4 z-50 max-[925px]:flex hidden border-t border-orangeDarti shadow-lg">
                    <Link href="/inicio" className="text-white hover:text-orangeDarti font-bold" onClick={() => setMenuOpen(false)}>Início</Link>
                    <Link href="/sobre" className="text-white hover:text-orangeDarti font-bold" onClick={() => setMenuOpen(false)}>Sobre</Link>
                    <Link href="/integrantes" className="text-white hover:text-orangeDarti font-bold" onClick={() => setMenuOpen(false)}>Integrantes</Link>
                    <Link href="/pesquisas" className="text-white hover:text-orangeDarti font-bold" onClick={() => setMenuOpen(false)}>Pesquisas</Link>
                    <Link href="/projetos" className="text-white hover:text-orangeDarti font-bold" onClick={() => setMenuOpen(false)}>Projetos</Link>
                    <Link href="/portfolio" className="text-white hover:text-orangeDarti font-bold" onClick={() => setMenuOpen(false)}>Portfólio</Link>
                    
                    {/* Linha separadora e Botões de Login/Logout */}
                    <div className="w-[80%] flex justify-center mt-2 border-t border-orangeDarti/50 pt-6">
                        {showLogout ? (
                            <form action={logoutAction} onSubmit={() => setMenuOpen(false)}>
                                <button type="submit" className="px-6 py-2 rounded-[15px] flex justify-center items-center gap-2 bg-orangeDarti cursor-pointer hover:bg-orangeDarti/80 text-white">
                                    <p className="font-bold">Logout</p>
                                    <LogOut />
                                </button>
                            </form>
                        ) : login ? (
                            <Link href="/login" onClick={() => setMenuOpen(false)} className="px-6 py-2 rounded-[15px] flex justify-center items-center gap-2 bg-orangeDarti text-white">
                                <p className="font-bold">Login</p>
                                <LogIn />
                            </Link>
                        ) : (
                            <Link href="/login" onClick={() => setMenuOpen(false)} className="px-6 py-2 rounded-[15px] flex justify-center items-center gap-2 bg-greyDarti hover:bg-orangeDarti text-white">
                                <p className="font-bold">Login</p>
                                <LogIn />
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </>
    )
}
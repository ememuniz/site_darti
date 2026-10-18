import Image from "next/image"
import logo from "@/assets/DartiBrancoSimbol.png"
import { LogIn, LogOut } from "lucide-react"
import Link from "next/link"
import { logoutAction } from "@/actions/auth.actions"
import { decrypt } from '@/lib/session'
import { cookies } from 'next/headers'
import MobileMenuButton from "./mobileMenuButton"

interface NavbarProps {
    inicio?: boolean;
    sobre?: boolean;
    integrantes?: boolean;
    pesquisas?: boolean;
    projetos?: boolean;
    portfolio?: boolean;
    login?: boolean;
    logout?: boolean;
}


export default async function Navbar({
    inicio, 
    sobre,
    integrantes,
    pesquisas,
    projetos,
    portfolio,
    login,
    logout
}: NavbarProps
) {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session')?.value;

    const session = sessionCookie ? await decrypt(sessionCookie) : null;

    const showLogout = session ? true : false;

    const administrador = session?.role === 'ADMIN' ? '/admin' : (session?.role === 'STUDENT' ? '/aluno' : (session?.role === 'LEADER' ? '/lider' : (session?.role === 'MEMBER' ? '/membro' : '/login')));

    return (
        <div className="flex fixed top-0 left-0 w-full z-50 shadow-md bg-blueDarti h-[65px] px-[3vh] py-[6px] items-center justify-between gap-2">
            <div className="h-full justify-center items-center flex py-[5px] px-[15px]">
                <Image src={logo} alt="Logo Darti" className="h-full w-full object-contain" />               
            </div>

            <nav className="flex-8 h-full flex items-center gap-7 px-[2vw] max-[925px]:hidden text-greyLightDarti">
                {inicio ? 
                    <Link href="/inicio" className="font-bold text-orangeDarti">
                        Início
                    </Link>
                    :
                    <Link href="/inicio" className="hover:font-bold hover:text-orangeDarti">
                        Início
                    </Link>
                }

                {sobre ? 
                    <Link href="/sobre" className="font-bold text-orangeDarti">
                        Sobre
                    </Link>
                    :
                    <Link href="/sobre" className="hover:font-bold hover:text-orangeDarti">
                        Sobre
                    </Link>
                }

                {integrantes ? 
                    <Link href="/integrantes" className="font-bold text-orangeDarti">
                        Integrantes
                    </Link>
                    :
                    <Link href="/integrantes" className="hover:font-bold hover:text-orangeDarti">
                        Integrantes
                    </Link>
                }

                {pesquisas ? 
                    <Link href="/pesquisas" className="font-bold text-orangeDarti">
                        Pesquisas
                    </Link>
                    :
                    <Link href="/pesquisas" className="hover:font-bold hover:text-orangeDarti">
                        Pesquisas
                    </Link>
                }

                {projetos ? 
                    <Link href="/projetos" className="font-bold text-orangeDarti">
                        Projetos
                    </Link>
                    :
                    <Link href="/projetos" className="hover:font-bold hover:text-orangeDarti">
                        Projetos
                    </Link>
                }

                {portfolio ? 
                    <Link href="/portfolio" className="font-bold text-orangeDarti">
                        Portfólio
                    </Link>
                    :
                    <Link href="/portfolio" className="hover:font-bold hover:text-orangeDarti">
                        Portfólio
                    </Link>
                }
            </nav>


            {showLogout ?
                <form action={logoutAction} className="max-[925px]:hidden flex items-center gap-4">
                    {logout ?
                        <Link href={administrador} className="font-bold text-orangeDarti">Gerenciador</Link>
                        :
                        <Link href={administrador} className="font-bold text-greyLightDarti hover:text-orangeDarti">Gerenciador</Link>
                        
                    }
                    <button type="submit" className="px-4 py-2 rounded-[15px] flex justify-center items-center gap-2 bg-orangeDarti cursor-pointer hover:bg-orangeDarti/80">
                        <p className="font-bold">Logout</p>
                        <LogOut />
                    </button>
                </form>
                :
                (login ?
                    <Link href="/login" className="px-4 max-[925px]:hidden py-2 rounded-[15px]  flex justify-center items-center gap-2 bg-orangeDarti">
                        <p className="font-bold">Login</p>
                        <LogIn />
                    </Link>
                    :
                    <Link href="/login" className="px-4 max-[925px]:hidden py-2 rounded-[15px]  flex justify-center items-center gap-2 bg-greyDarti hover:bg-orangeDarti">
                        <p className="font-bold">Login</p>
                        <LogIn />
                    </Link>
                )
            }


            <MobileMenuButton showLogout={showLogout} login={login} />


        </div>
    )
}
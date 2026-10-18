import Navbar from "@/components/Navbar";
import { Suspense } from "react";

export default function LoginLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col gap-2 bg-greyLightDarti"> 
            <Suspense fallback={<div className="h-[60px] bg-blueDarti w-full" />}>
                {Navbar({
                    inicio: false,
                    sobre: false,
                    integrantes: false,
                    pesquisas: false,
                    projetos: false,
                    portfolio: false,
                    login: true,
                    logout: false
                })}
                {children}
            </Suspense>
        </div>
    )
}
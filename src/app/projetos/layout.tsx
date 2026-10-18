import Navbar from "@/components/Navbar";
import { Suspense } from "react";

export default function ProjetosLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col bg-orangeDarti gap-2"> 
            <Suspense fallback={<div className="h-[60px] bg-blueDarti w-full" />}>
                {Navbar({
                    inicio: false,
                    sobre: false,
                    integrantes: false,
                    pesquisas: false,
                    projetos: true,
                    portfolio: false,
                    login: false,
                    logout: false
                })}
                {children}
            </Suspense>
        </div>
    )
}
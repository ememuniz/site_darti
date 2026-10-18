import Navbar from "@/components/Navbar";
import { Suspense } from "react";

export default function SobreLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col bg-orangeDarti gap-2"> 
            <Suspense fallback={<div className="h-[60px] bg-blueDarti w-full" />}>
                {Navbar({
                    inicio: false,
                    sobre: true,
                    integrantes: false,
                    pesquisas: false,
                    projetos: false,
                    portfolio: false,
                    login: false,
                    logout: false
                })}
                {children}
            </Suspense>
        </div>
    )
}


import AdminModule from '@/components/AdminModule';
import { Suspense } from "react";



//#region LoginPage
export default function AdminPage() {

    return (
        <main className="flex bg-greyLightDarti mt-16 h-screen justify-between border">
            <Suspense fallback={<div>Carregando menu...</div>}>
                <AdminModule />
            </Suspense>
        </main>
    )
}

//#endregion
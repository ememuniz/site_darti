'use client';

//#region Importações
import { useActionState } from 'react';
import Link from 'next/link';
import { loginAction } from '@/actions/auth.actions';
//#endregion

//#region LoginPage
export default function LoginPage() {
    const [state, formAction, isPending] = useActionState(loginAction, null);
    return (
        <main>
            <h1>Login232e</h1>
        </main>
    )
}

//#endregion
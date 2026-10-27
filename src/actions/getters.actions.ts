'use server';

import { cookies } from 'next/headers';
import { decrypt } from '@/lib/session';
import { getter } from '@/services/get.service'


export async function getName() {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session')?.value;
    const session = sessionCookie ? await decrypt(sessionCookie) : null;

    const name = getter('name', session?.email);

    return name;
}

export async function getNameSocial() {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session')?.value;
    const session = sessionCookie ? await decrypt(sessionCookie) : null;

    const name = getter('nameSocial', session?.email);    

    return name;   
}

export async function getNameSocialComplete() {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session')?.value;
    const session = sessionCookie ? await decrypt(sessionCookie) : null;

    const nameSocial = getter('nameSocialComplete', session?.email);

    return nameSocial;
}

export async function getNameComplete() {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session')?.value;
    const session = sessionCookie ? await decrypt(sessionCookie) : null;

    const nameComplete = getter('nameComplete', session?.email);

    return nameComplete;
}

export async function getInitialsName() {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session')?.value;
    const session = sessionCookie ? await decrypt(sessionCookie) : null;

    const initials = getter('initials', session?.email);

    return initials;
}

export async function getInitialsSocial() {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session')?.value;
    const session = sessionCookie ? await decrypt(sessionCookie) : null;

    const initialsSocial = getter('initialsSocial', session?.email);

    return initialsSocial;
}

export async function getBoards() {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session')?.value;
    const session = sessionCookie ? await decrypt(sessionCookie) : null;

    const boards = await getter('board', session?.email);

    if (!boards || !Array.isArray(boards) || boards.length === 0) {
        return '';
    }

    const boardsLimpos = boards.map(item => item.replace(/_/g, ' ').toLowerCase())

    return boardsLimpos;
    //const formatador = new Intl.ListFormat('pt-BR', { style: 'long', type: 'conjunction' });

    //return formatador.format(boardsLimpos);
}

export async function getClubs() {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session')?.value;
    const session = sessionCookie ? await decrypt(sessionCookie) : null;

    const clubs = await getter('club', session?.email);

    if (!clubs || !Array.isArray(clubs) || clubs.length === 0) {
        return '';
    }

    return clubs;
}

export async function getRole() {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session')?.value;
    const session = sessionCookie ? await decrypt(sessionCookie) : null;

    const role = await getter('role', session?.email);

    return role;
}

export async function getEmail() {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session')?.value;
    const session = sessionCookie ? await decrypt(sessionCookie) : null;

    const email = getter('email', session?.email);

    return email;
}

export async function getIsActive() {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session')?.value;
    const session = sessionCookie ? await decrypt(sessionCookie) : null;

    const isActive = await getter('isActive', session?.email);

    return isActive;
}

export async function getDateOfBirth() {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session')?.value;
    const session = sessionCookie ? await decrypt(sessionCookie) : null;

    const dateOfBirth = await getter('dateOfBirth', session?.email);

    return dateOfBirth;
}

export async function getBio() {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session')?.value;
    const session = sessionCookie ? await decrypt(sessionCookie) : null;

    const bio = await getter('bio', session?.email);

    return bio;
}
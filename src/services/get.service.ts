
import { prisma } from '@/lib/prisma';



export async function getter(type: string, email?: string) {
    const user = await prisma.user.findUnique({
        where: { email },
    })

    if (!user) return null;

    if (type === 'initialsSocial') {
        return user.socialName ? (user.socialName.split(' ')[0] + ' ' + user.socialName.split(' ').at(-1)).split(' ').map(n => n[0]).join('') : null;
    }

    if (type === 'initials') {
        return user.name ? (user.name.split(' ')[0] + ' ' + user.name.split(' ').at(-1)).split(' ').map(n => n[0]).join('') : null;
    }

    if (type === 'name') {
        return user.name ? user.name.split(' ')[0] + ' ' + user.name.split(' ').at(-1) : null;
    }

    if (type === 'nameSocial') {
        return user.socialName ? user.socialName.split(' ')[0] + ' ' + user.socialName.split(' ').at(-1) : null;
    }

    if (type === 'nameSocialComplete') {
        return user.socialName;
    }

    if (type === 'nameComplete') {
        return user.name;
    }

    if (type === 'board') {
        return user.board;
        
    }

    if (type === 'role') {
        if (user.jobTitle === 'PRESIDENTE') {
            return 'Presidente';
        }
        if (user.jobTitle === 'VICE_PRESIDENTE') {
            return 'Vice-Presidente';
        }
        if (user.jobTitle === 'DIRETOR'){
            return 'Diretor';
        }
        if (user.jobTitle === 'LIDER') {
            return 'Líder';
        }
        return 'Membro';
    }

    if (type === 'club') {
        const clubs: string[] = []
        user.club.map((club) => {
            if (club === 'DES_WEB_1') {
                clubs.push('Dev Web 1');
            }
            if (club === 'DES_WEB_2') {
                clubs.push('Dev Web 2');
            }
            if (club === 'DES_WEB_3') {
                clubs.push('Dev Web 3');
            }
            if (club === 'HACKATHON') {
                clubs.push('Hackathon');
            }
            if (club === 'MIDIA') {
                clubs.push('Mídia');
            }
            if (club === 'ATUALIDADES') {
                clubs.push('Atualidades');
            }
            if (club === 'ROBOTICA_1') {
                clubs.push('Robótica 1');
            }
            if (club === 'ROBOTICA_2') {
                clubs.push('Robótica 2');
            }
            if (club === 'ROBOTICA_3') {
                clubs.push('Robótica 3');
            }
            if (club === 'VIS_COMPUTACIONAL_1') {
                clubs.push('Visão Computacional 1');
            }
            if (club === 'VIS_COMPUTACIONAL_2') {
                clubs.push('Visão Computacional 2');
            }
            if (club === 'TEC_EDUCACIONAL_1') {
                clubs.push('Tecnologia Educacional 1');
            }
            if (club === 'TEC_EDUCACIONAL_2') {
                clubs.push('Tecnologia Educacional 2');
            }
            if (club === 'AEROMODELISMO') {
                clubs.push('Aeromodelismo');
            }
            if (club === 'MUSICA') {
                clubs.push('Música');
            }
            if (club === 'ESCRITA_CRIATIVA') {
                clubs.push('Escrita Criativa');
            }
            if (club === 'DNA_EM_EVIDENCIA') {
                clubs.push('DNA em Evidência');
            }
            if (club === 'IDENTIDADE_E_TECNOLOGIA') {
                clubs.push('Identidade e Tecnologia');
            }
            if (club === 'PROCESSAMENTO_DE_SINAIS') {
                clubs.push('Processamento de Sinais');
            }
        })
        return clubs;
    }

    if (type === 'email') {
        return user.email;
    }

    if (type === 'isActive') {
        return user.isActive;
    }

    if (type === 'dateOfBirth') {
        return user.dateOfBirth;  
    }

    if (type === 'bio') {
        return user.bio;
    }

    switch (type) {
        case 'role':
            return user.role;
        case 'id':
            return user.id;
        default:
            return null;
    }

}


import { 
    getName, 
    getNameSocial, 
    getNameComplete, 
    getNameSocialComplete, 
    getInitialsName, 
    getInitialsSocial,
    getBoards, 
    getRole, 
    getClubs, 
    getEmail, 
    getIsActive,
    getDateOfBirth,
    getBio 
} from '@/actions/getters.actions';
import MenuAdmin from '@/components/MenuAdmin';



export default async function AdminModule() {
    const userName = await getName();
    const userNameSocial = await getNameSocial();
    const userNameComplete= await getNameComplete();
    const userNameSocialComplete = await getNameSocialComplete();
    const initials = await getInitialsName();
    const initialsSocial = await getInitialsSocial();
    const board = await getBoards();
    const role = await getRole();
    const club = await getClubs();
    const email = await getEmail();
    const isActive = await getIsActive();
    const dateOfBirth = await getDateOfBirth();
    const bio = await getBio();
    return (
        <MenuAdmin 
            userName={userName?.toString() ?? ''}
            userNameSocial={userNameSocial?.toString() ?? ''} 
            userNameComplete={userNameComplete?.toString() ?? ''}
            userNameSocialComplete={userNameSocialComplete?.toString() ?? ''}
            initials={initials?.toString()} 
            initialsSocial={initialsSocial?.toString()} 
            board={Array.isArray(board) ? board : board ? [board] : undefined}
            club={Array.isArray(club) ? club : club ? [club] : undefined}
            role={role?.toString() ?? ''}
            email={email?.toString() ?? ''}
            dateOfBirth={dateOfBirth?.toString() ?? ''}
            isActive={isActive?.toString() === 'true' ? true : false}
            bio={bio?.toString() ?? ''}
        />
    )
}
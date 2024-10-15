import { useState, ChangeEvent, useMemo } from 'react';
import { usePlayer } from '../../Providers/PlayerProvider/PlayerProvider';

export const useSearchLobby = () => {
    const [searchKeyword, setSearchKeyword] = useState<string>('');
    const { players, invites } = usePlayer();
  
    const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchKeyword(e.target.value.toLowerCase());
    };

    const searchPlayerResults = useMemo(() => {
        return players.filter(player => player.username.toLowerCase().startsWith(searchKeyword));
    }, [searchKeyword, players]);

    const searchInviteResults = useMemo(() => {
        return invites.filter(invite => invite.requestUsername.toLowerCase().startsWith(searchKeyword));
    }, [searchKeyword, invites]);

    return { handleSearchChange, searchPlayerResults, searchInviteResults };
};

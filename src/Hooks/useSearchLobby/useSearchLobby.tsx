import React, { useState, ChangeEvent, useMemo } from 'react';
import { usePlayer } from '../../Providers/PlayerProvider/PlayerProvider';

export const useSearchLobby = () => {
    const [searchKeyword, setSearchKeyword] = useState<string>('');
    const { players, invites, lobbySelection } = usePlayer();
  
    const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
      setSearchKeyword(e.target.value.toLowerCase());
    };
  
    const searchResults = useMemo(() => {
      if (!searchKeyword) return lobbySelection ? invites : players;
      return lobbySelection
        ? invites.filter(invite => invite.requestUsername.toLowerCase().startsWith(searchKeyword))
        : players.filter(player => player.username.toLowerCase().startsWith(searchKeyword));
    }, [searchKeyword, players, invites, lobbySelection]);
  
    return { handleSearchChange, searchResults };
};
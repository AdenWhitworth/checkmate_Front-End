import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { db } from '../../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useAuth } from '../AuthProvider/AuthProvider';
import { Player, PlayerContextType } from './PlayerProviderTypes';

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const PlayerProvider = ({ children }: { children: React.ReactNode }) => {
    const { currentUser } = useAuth();
    const [player, setPlayer] = useState<Player | null>(null);
    const [loadingPlayer, setLoadingPlayer] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchPlayerData = useCallback( async () => {
        if (!currentUser) return;

        setLoadingPlayer(true);
        setError(null);
        
        try {
        const q = query(collection(db, 'users'), where('uid', '==', currentUser.uid));
        const querySnapshot = await getDocs(q);

        querySnapshot.forEach((doc) => {
            setPlayer({
            playerId: doc.data().playerID,
            userId: doc.id,
            username: doc.data().username,
            win: doc.data().win,
            loss: doc.data().loss,
            });
        });
        } catch (err) {
        setError("Error fetching player data");
        } finally {
        setLoadingPlayer(false);
        }
    }, [currentUser]);
    
    useEffect(() => {
        fetchPlayerData();
    }, [currentUser, fetchPlayerData]);

    return (
        <PlayerContext.Provider value={{ player, loadingPlayer, error }}>
        {children}
        </PlayerContext.Provider>
    );
};

export const usePlayer = () => {
    const context = useContext(PlayerContext);
    if (!context) {
        throw new Error('usePlayer must be used within a PlayerProvider');
    }
    return context;
};

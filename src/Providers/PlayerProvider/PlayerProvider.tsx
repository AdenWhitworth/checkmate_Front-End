import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { db } from '../../firebase';
import { collection, query, where, getDocs, onSnapshot, doc } from 'firebase/firestore';
import { useAuth } from '../AuthProvider/AuthProvider';
import { Player, PlayerContextType, Invite } from './PlayerProviderTypes';
import { Room, SocketPlayer } from '../GameProvider/GameProviderTypes';

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

/**
 * Provides player data and invites using Firebase Firestore, including:
 * - Current player info
 * - Players list
 * - Invites list
 * - Loading and error states
 * 
 * @component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - The children elements to be wrapped by the provider.
 * @returns {JSX.Element} The PlayerContext.Provider with the state and context values.
 */
export const PlayerProvider = ({ children }: { children: React.ReactNode }): JSX.Element => {
    const { currentUser } = useAuth();
    const [player, setPlayer] = useState<Player | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const [players, setPlayers] = useState<Player[]>([]);
    const [invites, setInvites] = useState<Invite[]>([]);
    const [invitesCount, setInvitesCount] = useState<number>(0);
    const [lobbySelection, setLobbySelection] = useState<boolean>(false);

    const [playerLoaded, setPlayerLoaded] = useState<boolean>(false);
    const [playersLoaded, setPlayersLoaded] = useState<boolean>(false);
    const [invitesLoaded, setInvitesLoaded] = useState<boolean>(false);

    const invitesUserIDs = useMemo(() => invites.map(invite => invite.requestUserId).concat(player?.userId || ''), [invites, player]);

    /**
     * Checks if all loading states are complete and sets loading to false if so.
     */
    const checkAllLoaded = useCallback(() => {
        if (playerLoaded && playersLoaded && invitesLoaded) {
            setLoading(false);
        }
    }, [playerLoaded, playersLoaded, invitesLoaded]);

    /**
     * Fetches the current user's player data from Firestore.
     * Sets the player state and playerLoaded flag when successful.
     */
    const fetchPlayer = useCallback(async () => {
        if (!currentUser) return;
        
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
            setPlayerLoaded(true);
        } catch (err) {
            setError("Error fetching players and invites.");
        }
    }, [currentUser]);

    /**
     * Fetches a list of players from Firestore excluding those with user IDs in the invites list or current player.
     * Sets the players state and playersLoaded flag when successful.
     */
    const fetchPlayers = useCallback(() => {
        if (!player || !player.userId) return;

        if (invitesUserIDs.length > 10) {
            setError("Error fetching players and invites.");
            return;
        }

        const q = query(collection(db, "players"), where("userID", 'not-in', invitesUserIDs));

        return onSnapshot(q, (snapshot) => {
            try {
                const playersData = snapshot.docs.map((doc) => ({
                    playerId: doc.id,
                    userId: doc.data().userID,
                    username: doc.data().username,
                }));

                setPlayers(playersData);
                setPlayersLoaded(true);
            } catch (error) {
                setError("Error fetching players and invites.");
            }
        });
    }, [player, invitesUserIDs]);

    /**
     * Fetches a list of invites for the current user from Firestore.
     * Sets the invites state, invites count, and invitesLoaded flag when successful.
     */
    const fetchInvites = useCallback(() => {
        if (!player || !player.userId) return;

        const userCollection = collection(db, 'users');
        const DocRef = doc(userCollection, player.userId);
        const inviteCollection = collection(DocRef, 'invites');
        const q = query(inviteCollection);

        return onSnapshot(q, (snapshot) => {
            try {
                const invitesData: Invite[] = snapshot.docs.map((doc) => {
                    const roomData = doc.data().requestRoom;
                    const room: Room = {
                        roomId: roomData.roomId,
                        players: roomData.players.map((player: SocketPlayer) => ({
                            id: player.id,
                            username: player.username
                        })),
                    };

                    return {
                        inviteId: doc.id,
                        requestLoss: doc.data().requestLoss,
                        requestPlayerId: doc.data().requestPlayerID,
                        requestRoom: room,
                        requestUserId: doc.data().requestUserID,
                        requestUsername: doc.data().requestUserName,
                        requestWin: doc.data().requestWin,
                    };
                });

                setInvitesCount(snapshot.size);
                setInvites(invitesData);
                setInvitesLoaded(true);
            } catch (error) {
                setError("Error fetching players and invites.");
            }
        });
    }, [player]);

    /**
     * Checks if all required states (player, players, and invites) are loaded.
     * If all are loaded, it sets the loading state to false.
     */
    useEffect(() => {
        checkAllLoaded();
    }, [playerLoaded, playersLoaded, invitesLoaded, checkAllLoaded]);

    /**
     * Fetches the current user's player data if a current user is available.
     * Triggers the fetchPlayer function whenever the current user changes.
     */
    useEffect(() => {
        if (!currentUser) return;
        fetchPlayer();
    }, [currentUser, fetchPlayer]);

    /**
     * Subscribes to the players collection to fetch player data, excluding those already invited or the current user.
     * The fetchPlayers function is called whenever the invites change.
     */
    useEffect(() => {
        const unsubscribePlayers = fetchPlayers();
        return unsubscribePlayers;
    }, [invites, fetchPlayers]);

    /**
     * Subscribes to the invites collection to fetch invites for the current player.
     * The fetchInvites function is triggered initially when the component mounts.
     */
    useEffect(() => {
        const unsubscribeInvites = fetchInvites();
        return unsubscribeInvites;
    }, [fetchInvites]);

    return (
        <PlayerContext.Provider value={{ 
            player, 
            loading, 
            error, 
            players, 
            invites, 
            invitesCount,
            lobbySelection, 
            setLobbySelection
        }}>
            {children}
        </PlayerContext.Provider>
    );
};

/**
 * Custom hook to access the PlayerContext.
 * Throws an error if used outside of PlayerProvider.
 * 
 * @returns {PlayerContextType} The player context value.
 */
export const usePlayer = (): PlayerContextType => {
    const context = useContext(PlayerContext);
    if (!context) {
        throw new Error('usePlayer must be used within a PlayerProvider');
    }
    return context;
};
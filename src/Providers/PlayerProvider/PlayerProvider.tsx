import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { db } from '../../firebase';
import { collection, query, where, getDocs, onSnapshot, doc } from 'firebase/firestore';
import { useAuth } from '../AuthProvider/AuthProvider';
import { PlayerDynamic, PlayerList, PlayerContextType, Invite, PlayerStatic } from './PlayerProviderTypes';

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
    const [playerUserId, setPlayerUserId] = useState<string | null>(null);
    const [playerStatic, setPlayerStatic] = useState<PlayerStatic | null>(null);
    const [playerDynamic, setPlayerDynamic] = useState<PlayerDynamic | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const [players, setPlayers] = useState<PlayerList[]>([]);
    const [invites, setInvites] = useState<Invite[]>([]);
    const [invitesCount, setInvitesCount] = useState<number>(0);
    const [lobbySelection, setLobbySelection] = useState<boolean>(false);

    const [playerUserIdLoaded, setPlayerUserIdLoaded] = useState<boolean>(false);
    const [playerLoaded, setPlayerLoaded] = useState<boolean>(false);
    const [playersLoaded, setPlayersLoaded] = useState<boolean>(false);
    const [invitesLoaded, setInvitesLoaded] = useState<boolean>(false);

    const invitesUserIDs = useMemo(() => invites.map(invite => invite.requestUserId).concat(playerStatic?.userId || ''), [invites, playerStatic]);

    /**
     * Checks if all loading states are complete and sets loading to false if so.
     */
    const checkAllLoaded = useCallback(() => {
        if (playerUserIdLoaded && playerLoaded && playersLoaded && invitesLoaded) {
            setLoading(false);
        }
    }, [playerUserIdLoaded, playerLoaded, playersLoaded, invitesLoaded]);

    /**
     * Fetches the current user's userId from Firestore.
     * Sets the player userId state and setPlayerUserIdLoaded flag when successful.
     */
    const fetchPlayerUserId = useCallback(async () => {
        if (!currentUser || playerUserId) return;

        try {
            const q = query(collection(db, 'users'), where('uid', '==', currentUser.uid));
            const querySnapshot = await getDocs(q);

            if (querySnapshot.size > 1) throw new Error("Multiple users found with the same UID.");

            querySnapshot.forEach((doc) => {
                setPlayerUserId(doc.id);
            });

            setPlayerUserIdLoaded(true);
        } catch (error) {
            setError("Error fetching user ID.");
        }
    }, [currentUser, playerUserId]);

    /**
     * Fetches the current user's player data from Firestore.
     * Sets the player state and setPlayerLoaded flag when successful.
     */
    const fetchPlayer = useCallback(() => {
        if (!playerUserId) return;
    
        const userDocRef = doc(db, "users", playerUserId);
    
        return onSnapshot(userDocRef, (snapshot) => {
            try {
                if (!snapshot.exists()) throw new Error("No such user with this userId");
                const data = snapshot.data();
                if (!data) return;

                const newPlayerStatic: PlayerStatic = {
                    playerId: data.playerId,
                    userId: snapshot.id,
                    username: data.username,
                    createdAt: data.createdAt
                };

                const newPlayerDynamic: PlayerDynamic = {
                    win: data.win ?? 0,
                    loss: data.loss ?? 0,
                    draw: data.draw ?? 0,
                    elo: data.elo ?? 1200,
                    currentGameId: data.currentGameId ?? undefined,
                    email: data.email,
                    gamesPlayed: data.gamesPlayed ?? 0,
                };

                setPlayerStatic((prev) => {
                    const hasChanged =
                        prev?.playerId !== newPlayerStatic.playerId ||
                        prev?.userId !== newPlayerStatic.userId ||
                        prev?.username !== newPlayerStatic.username;
                    return hasChanged ? newPlayerStatic : prev;
                });

                setPlayerDynamic((prev) => {
                    const hasChanged = 
                        prev?.win !== newPlayerDynamic.win ||
                        prev?.loss !== newPlayerDynamic.loss ||
                        prev?.draw !== newPlayerDynamic.draw ||
                        prev?.elo !== newPlayerDynamic.elo ||
                        prev?.currentGameId !== newPlayerDynamic.currentGameId
                    return hasChanged? newPlayerDynamic : prev;
                });

                setPlayerLoaded(true);
            } catch (error) {
                setError("Error fetching players and invites.");
            }
        });
    }, [playerUserId, setPlayerDynamic, setPlayerStatic]);

    /**
     * Fetches a list of players from Firestore excluding those with user IDs in the invites list or current player.
     * Sets the players state and playersLoaded flag when successful.
     */
    const fetchPlayers = useCallback(() => {
        if (!playerStatic || !playerStatic.userId) return;

        if (invitesUserIDs.length > 10) {
            setError("Error fetching players and invites.");
            return;
        }

        const q = query(collection(db, "players"), where("userId", 'not-in', invitesUserIDs));

        return onSnapshot(q, (snapshot) => {
            try {
                const playersData = snapshot.docs.map((doc) => ({
                    playerId: doc.id,
                    userId: doc.data().userId,
                    username: doc.data().username,
                    elo: doc.data().elo,
                }));

                setPlayers(playersData);
                setPlayersLoaded(true);
            } catch (error) {
                setError("Error fetching players and invites.");
            }
        });
    }, [playerStatic, invitesUserIDs]);

    /**
     * Fetches a list of invites for the current user from Firestore.
     * Sets the invites state, invites count, and invitesLoaded flag when successful.
     */
    const fetchInvites = useCallback(() => {
        if (!playerStatic || !playerStatic.userId) return;

        const userCollection = collection(db, 'users');
        const DocRef = doc(userCollection, playerStatic.userId);
        const inviteCollection = collection(DocRef, 'invites');
        const q = query(inviteCollection);

        return onSnapshot(q, (snapshot) => {
            try {
                const invitesData: Invite[] = snapshot.docs.map((doc) => {
                    return {
                        inviteId: doc.id,
                        requestPlayerId: doc.data().requestPlayerId,
                        requestGameId: doc.data().requestGameId,
                        requestUserId: doc.data().requestUserId,
                        requestUsername: doc.data().requestUsername,
                        requestElo: doc.data().requestElo,
                    };
                });

                setInvitesCount(snapshot.size);
                setInvites(invitesData);
                setInvitesLoaded(true);
            } catch (error) {
                setError("Error fetching players and invites.");
            }
        });
    }, [playerStatic]);

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
        fetchPlayerUserId();
    }, [currentUser, fetchPlayerUserId]);

    /**
     * Subscribes to the users collection to fetch the player data.
     * The fetchPlayers function is called whenever the player userId changes.
     */
    useEffect(() => {
        const unsubscribePlayer = fetchPlayer();
        return unsubscribePlayer;
    }, [fetchPlayer]);

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
            playerStatic,
            playerDynamic,
            setPlayerDynamic, 
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
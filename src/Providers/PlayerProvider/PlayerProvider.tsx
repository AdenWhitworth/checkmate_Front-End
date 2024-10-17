import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { db } from '../../firebase';
import { collection, query, where, getDocs, onSnapshot, doc } from 'firebase/firestore';
import { useAuth } from '../AuthProvider/AuthProvider';
import { Player, PlayerContextType, Invite } from './PlayerProviderTypes';
import { Room, SocketPlayer } from '../GameProvider/GameProviderTypes';

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const PlayerProvider = ({ children }: { children: React.ReactNode }) => {
    const { currentUser } = useAuth();
    const [player, setPlayer] = useState<Player | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const [players, setPlayers] = useState<Player[]>([]);
    const [invites, setInvites] = useState<Invite[]>([]);
    const [invitesCount, setInvitesCount] = useState<number>(0);
    const [lobbySelection, setLobbySelection] = useState<boolean>(false);

    const [playerLoaded, setPlayerLoaded] = useState(false);
    const [playersLoaded, setPlayersLoaded] = useState(false);
    const [invitesLoaded, setInvitesLoaded] = useState(false);

    const checkAllLoaded = useCallback(() => {
        if (playerLoaded && playersLoaded && invitesLoaded) {
            setLoading(false);
        }
    }, [playerLoaded, playersLoaded, invitesLoaded]);

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

    const fetchPlayers = useCallback(() => {
        if (!player || !player.userId) return;

        const invitesUserIDs = Object.values(invites).map(invite => invite.requestUserId);
        invitesUserIDs.push(player.userId);

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
                setPlayersLoaded(true); // Set players loaded flag
            } catch (error) {
                setError("Error fetching players and invites.");
            }
        });
    }, [player, invites]);

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

    useEffect(() => {
        checkAllLoaded();
    }, [playerLoaded, playersLoaded, invitesLoaded, checkAllLoaded]);

    useEffect(() => {
        if (!currentUser) return;
        fetchPlayer();
    }, [currentUser, fetchPlayer]);

    useEffect(() => {
        const unsubscribePlayers = fetchPlayers();
        return unsubscribePlayers;
    }, [invites, fetchPlayers]);

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

export const usePlayer = () => {
    const context = useContext(PlayerContext);
    if (!context) {
        throw new Error('usePlayer must be used within a PlayerProvider');
    }
    return context;
};



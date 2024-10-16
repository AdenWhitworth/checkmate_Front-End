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
    const [loadingPlayer, setLoadingPlayer] = useState<boolean>(true);
    const [errorPlayer, setErrorPlayer] = useState<string | null>(null);

    const [players, setPlayers] = useState<Player[]>([]);
    const [loadingPlayers, setLoadingPlayers] = useState<boolean>(false);

    const [invites, setInvites] = useState<Invite[]>([]);
    const [invitesCount, setInvitesCount] = useState<number>(0);
    const [loadingInvites, setLoadingInvites] = useState<boolean>(false);

    const [lobbySelection, setLobbySelection] = useState<boolean>(false);

    const fetchPlayer = useCallback(async () => {
        if (!currentUser) return;

        setLoadingPlayer(true);
        setErrorPlayer(null);
        
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
            setErrorPlayer("Error fetching players and invites.");
        } finally {
            setLoadingPlayer(false);
        }
    }, [currentUser]);
    
    useEffect(() => {
        fetchPlayer();
    }, [currentUser, fetchPlayer]);

    const fetchPlayers = useCallback(() => {
        if (!player || !player.userId) return;
    
        const invitesUserIDs = Object.values(invites).map(invite => invite.requestUserId);
        invitesUserIDs.push(player.userId);
    
        if (invitesUserIDs.length > 10) {
            setErrorPlayer("Error fetching players and invites.");
            return;
        }

        setLoadingPlayers(true);
        setErrorPlayer(null);
    
        const q = query(collection(db, "players"), where("userID", 'not-in', invitesUserIDs));
    
        const unsubscribe = onSnapshot(q, (snapshot) => {
            try {
                const playersData = snapshot.docs.map((doc) => ({
                    playerId: doc.id,
                    userId: doc.data().userID,
                    username: doc.data().username,
                }));

                setPlayers(playersData);
            } catch (error) {
                setErrorPlayer("Error fetching players and invites.");
            } finally {
                setLoadingPlayers(false);
            }
        }, (error) => {
            setErrorPlayer("Error fetching players and invites.");
        });
    
        return () => unsubscribe();
    }, [player, invites]);

    useEffect(() => {
        const unsubscribe = fetchPlayers();
        return unsubscribe;
    }, [invites, fetchPlayers]);

    const fetchInvites = useCallback(() => {
        if (!player || !player.userId) return;
    
        setLoadingInvites(true);
        setErrorPlayer(null);
    
        const userCollection = collection(db, 'users');
        const DocRef = doc(userCollection, player.userId);
        const inviteCollection = collection(DocRef, 'invites');
        const q = query(inviteCollection);
    
        const unsubscribe = onSnapshot(q, (snapshot) => {
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
            } catch (error) {
                setErrorPlayer("Error fetching players and invites.");
            } finally {
                setLoadingInvites(false);
            }
        }, (error) => {
            setErrorPlayer("Error fetching players and invites.");
        });
    
        return () => unsubscribe();
    }, [player]);

    useEffect(() => {
        const unsubscribe = fetchInvites();
        return unsubscribe;
    }, [fetchInvites]);

    return (
        <PlayerContext.Provider value={{ 
            player, 
            loadingPlayer, 
            errorPlayer, 
            players, 
            loadingPlayers, 
            invites, 
            invitesCount,
            loadingInvites,
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

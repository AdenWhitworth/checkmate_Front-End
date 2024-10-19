import { Invite } from "../../../../../Providers/PlayerProvider/PlayerProviderTypes";

/**
 * Props for the InvitesItem component, representing an invite to join a game and its index in a list.
 *
 * @interface InvitesItemProps
 * 
 * @property {Invite} invite - The invite object containing details about the invitation.
 * @property {number} index - The index of the invite item in the list.
 */
export interface InvitesItemProps {
    invite: Invite;
    index: number;
}
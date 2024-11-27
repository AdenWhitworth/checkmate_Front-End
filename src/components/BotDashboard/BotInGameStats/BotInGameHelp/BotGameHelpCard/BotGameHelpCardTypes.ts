export interface BotInGameHelpCardProps {
    imgSrc: string;
    imgAlt: string;
    label: string;
    tallyCount?: number;
    onClick: () => void;
    disable: boolean;
}
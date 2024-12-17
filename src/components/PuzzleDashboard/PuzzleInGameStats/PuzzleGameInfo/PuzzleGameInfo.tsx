import './PuzzleGameInfo.css';
import stopwatch from "../../../../Images/stopwatch white.svg";
import { usePuzzle } from '../../../../Providers/PuzzleProvider/PuzzleProvider';
import PuzzleInfoItem from './PuzzleInfoItem/PuzzleInfoItem';

/**
 * PuzzleGameInfo Component
 *
 * This component displays information about the current puzzle game, including:
 * - Puzzle tag (ID)
 * - Puzzle rating
 * - Popularity description
 * - Difficulty level
 * - Elapsed timer in "MM:SS" format
 *
 * The data is retrieved from the PuzzleProvider context.
 *
 * @component
 * @returns {JSX.Element} The rendered PuzzleGameInfo component.
 */
export default function PuzzleGameInfo(): JSX.Element {
    
    const { puzzle, timer } = usePuzzle();

    /**
     * Formats the popularity score into descriptive terms.
     * @param {number | undefined} popularity - Popularity score ranging from -100 to 100.
     * @returns {string} Formatted popularity description.
     */
    const formatPopularity = (popularity: number | undefined): string => {
        if (popularity === undefined) return 'Unknown';
        if (popularity <= -75) return 'Terrible';
        if (popularity < -15) return 'Bad';
        if (popularity <= 15) return 'Neutral';
        if (popularity <= 75) return 'Good';
        return 'Excellent';
    };

    /**
     * Formats difficulty by capitalizing the first letter.
     * @param {string | undefined} difficulty - Difficulty level (easy, medium, hard).
     * @returns {string} Formatted difficulty string.
     */
    const formatDifficulty = (difficulty: string | undefined): string => {
        if (!difficulty) return 'Unknown';
        return difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
    };

    /**
     * Converts a time in seconds to a "MM:SS" formatted string.
     *
     * @param {number} timeInSeconds - The total time in seconds.
     * @returns {string} The formatted time string in "MM:SS" format.
     */
    const formatTimer = (timeInSeconds: number): string => {
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = timeInSeconds % 60;
        const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
        const formattedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;

        return `${formattedMinutes}:${formattedSeconds}`;
    };

    const puzzleTag = puzzle?.puzzleTag ? `#${puzzle.puzzleTag}` : '';
    const rating = `${puzzle?.rating ?? ''}`;
    const popularity = formatPopularity(puzzle?.popularity);
    const difficulty = formatDifficulty(puzzle?.difficulty);

    return (
        <>
            <div className="puzzle-info-header">
                <img 
                    className="puzzle-info-header-icon" 
                    src={stopwatch} 
                    alt="Stopwatch Icon for puzzle timer" 
                />
                <h3 className="puzzle-info-header-text">{formatTimer(timer)}</h3>
            </div>

            <div className="puzzle-info-card">
                <ul className="puzzle-info-list">
                    <PuzzleInfoItem index={0} title="Tag" statistic={puzzleTag} />
                    <PuzzleInfoItem index={1} title="Rating" statistic={rating} />
                    <PuzzleInfoItem index={2} title="Popularity" statistic={popularity} />
                    <PuzzleInfoItem index={3} title="Difficulty" statistic={difficulty} />
                </ul>
            </div>
        </>
    );
}

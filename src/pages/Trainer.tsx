import { useState } from 'react';
import { Chessboard } from '../components/Chessboard';
import { useChess, useShuffledLines } from '../helpers/hooks';
import type { Line } from '../types';
import styles from './trainer.module.css';

export function Trainer() {
    // TODO: Make a Trainer prop later
    const lines: Line[] = [
        { pgn: '1. e4 e5 2. Nc3 Nf6 3. f4 exf4 4. e5 Qe7', player: 'w' },
        { pgn: '1. e4 e5 2. Nc3 Nf6', player: 'b' },
        { pgn: '1. e4 e5 2. Nc3 Nf6', player: 'w' },
        { pgn: '1. e4 e6', player: 'w' },
        { pgn: '1. e4 a5 2. Nf3 Nf6', player: 'b' },
        { pgn: '1. d4 d5 2. Nc3 Nf6', player: 'w' },
    ];

    const { currentLine, toNextLine, progress } = useShuffledLines(lines);
    const { position, playMove, moveSuccess, lineSuccess } = useChess(
        currentLine,
        progress
    );
    const [shouldShowFeedback, setShouldShowFeedback] = useState(false);

    const hasLinesLeft = progress < lines.length;

    // TODO: Style me!
    return (
        <>
            {hasLinesLeft && <button onClick={toNextLine}>Next</button>}
            <Chessboard
                position={position}
                playerColour={currentLine.player}
                playMove={playMove}
                setShouldShowFeedback={setShouldShowFeedback}
            />

            {!moveSuccess && shouldShowFeedback && (
                <p className={styles.incorrect}>Incorrect</p>
            )}
            {lineSuccess && <p>Well done!</p>}
            {`${progress}/${lines.length}`}
        </>
    );
}

import { useState } from 'react';
import { Chessboard } from '../components/Chessboard';
import { useChess } from '../helpers/hooks';
import { Line } from '../types';
import styles from './trainer.module.css';

export function Trainer() {
    // TODO: Remove after testing
    const pgn = '1. e4 e5 2. Nc3 Nf6 3. f4 exf4 4. e5';
    const playerColour = 'w';

    const { position, playMove, moveSuccess, lineSuccess } = useChess(
        pgn,
        playerColour
    );
    const [shouldShowFeedback, setShouldShowFeedback] = useState(false);

    return (
        <>
            <Chessboard
                position={position}
                playerColour={playerColour}
                playMove={playMove}
                setShouldShowFeedback={setShouldShowFeedback}
            />

            {!moveSuccess && shouldShowFeedback && (
                <p className={styles.incorrect}>Incorrect</p>
            )}
            {lineSuccess && <p>Well done!</p>}
        </>
    );
}

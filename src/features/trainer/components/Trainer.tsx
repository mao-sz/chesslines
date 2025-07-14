import { useState } from 'react';
import { Chessboard } from '@/components/Chessboard';
import { useTrainerChessboard } from '@/hooks/useTrainerChessboard';
import type { Line } from '@/types/chessboard';
import styles from './trainer.module.css';
import boardStyles from '@/components/chessboard.module.css';

type TrainerProps = { line: Line };

export function Trainer({ line }: TrainerProps) {
    const { position, playMove, moveSuccess, lineSuccess } =
        useTrainerChessboard(line);
    const [shouldShowFeedback, setShouldShowFeedback] = useState(false);

    // TODO: Style me!
    return (
        <>
            <Chessboard
                boardSizeClass={boardStyles.boardSize}
                position={position}
                playerColour={line.player}
                orientation={line.player}
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

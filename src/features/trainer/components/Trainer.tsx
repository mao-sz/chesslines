import { useState } from 'react';
import { Chessboard } from '@/components/chessboard/Chessboard';
import { useTrainerChessboard } from '@/hooks/useTrainerChessboard';
import type { RepertoireLine } from '@/types/repertoire';
import styles from './trainer.module.css';

type TrainerProps = { line: RepertoireLine };

export function Trainer({ line }: TrainerProps) {
    const { position, playMove, getLegalMoves, moveSuccess, lineSuccess } =
        useTrainerChessboard(line);
    const [shouldShowFeedback, setShouldShowFeedback] = useState(false);

    // TODO: Style me!
    return (
        <>
            <Chessboard
                boardSizeClass={styles.boardSize}
                position={position}
                playerColour={line.player}
                orientation={line.player}
                playMove={playMove}
                getLegalMoves={getLegalMoves}
                setShouldShowFeedback={setShouldShowFeedback}
            />

            {!moveSuccess && shouldShowFeedback && (
                <p className={styles.incorrect}>Incorrect</p>
            )}
            {lineSuccess && <p>Well done!</p>}
        </>
    );
}

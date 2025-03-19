import { useChess } from '@/hooks/useChess';
import type { Line } from '@/types/types';
import { useState } from 'react';
import { Chessboard } from './Chessboard';

type TrainerProps = {
    line: Line;
    progress: number;
};

export function Trainer({
    line,
    progress,
}: TrainerProps) {
    const { position, playMove, moveSuccess, lineSuccess } = useChess(
        line,
        progress
    );
    const [shouldShowFeedback, setShouldShowFeedback] = useState(false);

    // TODO: Style me!
    return (
        <>
            <Chessboard
                position={position}
                playerColour={line.player}
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

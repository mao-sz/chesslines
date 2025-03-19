import { useState } from 'react';
import { Chessboard } from './components/Chessboard';
import { useChess } from '@/hooks/useChess';
import { useShuffledLines } from '@/hooks/useShuffledLines';
import type { Line } from '@/types/types';
import styles from './trainer.module.css';

type TrainerProps = { lines: Line[] };

export function Trainer({ lines }: TrainerProps) {
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
            {hasLinesLeft && (
                <button onClick={toNextLine} aria-label="next line">
                    Next
                </button>
            )}
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

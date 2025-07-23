import { useState } from 'react';
import { SidePanel } from './SidePanel';
import { Chessboard } from '@/components/chessboard/Chessboard';
import { useTrainerChessboard } from '@/hooks/useTrainerChessboard';
import type { TestLine } from '@/types/repertoire';
import styles from './trainer.module.css';

type TrainerProps = {
    progress: number;
    linesToTrain: TestLine[];
    testLine: TestLine;
    toNextLine: () => void;
};

export function Trainer({
    progress,
    linesToTrain,
    testLine,
    toNextLine,
}: TrainerProps) {
    const [lineID, line] = testLine;
    const {
        position,
        currentMoveIndex,
        playMove,
        getLegalMoves,
        hint,
        moveSuccess,
        lineSuccess,
    } = useTrainerChessboard(line);
    const [shouldShowFeedback, setShouldShowFeedback] = useState(false);

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
            <SidePanel
                key={currentMoveIndex}
                successFeedback={lineSuccess}
                errorFeedback={!moveSuccess && shouldShowFeedback}
                progress={progress}
                linesToTrain={linesToTrain}
                lineID={lineID}
                pieceHint={hint}
                noteHint={line.notes[currentMoveIndex]}
                toNextLine={toNextLine}
            />
        </>
    );
}

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
                progress={progress}
                linesToTrain={linesToTrain}
                lineID={lineID}
                noteHint={line.notes[currentMoveIndex]}
                toNextLine={toNextLine}
            />
        </>
    );
}

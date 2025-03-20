import { type MouseEvent, useState } from 'react';
import { Square } from './Square';
import { expandEmptySquares, reverse } from '@/util/util';
import type { Colour, MoveInfo, StateSetter } from '@/types/types';
import styles from './chessboard.module.css';

type ChessboardProps = {
    position: string;
    playerColour: Colour;
    playMove: (move: MoveInfo) => void;
    setShouldShowFeedback: StateSetter<boolean>;
};

const RANK = [8, 7, 6, 5, 4, 3, 2, 1, 0];
const FILE = 'abcdefgh';

export function Chessboard({
    position,
    playerColour,
    playMove,
    setShouldShowFeedback,
}: ChessboardProps) {
    const [fromSquare, setFromSquare] = useState<string | null>(null);
    const displayPosition = playerColour === 'w' ? position : reverse(position);

    function handleSquareClick(e: MouseEvent): void {
        const square = e.currentTarget as HTMLElement;
        const { rank, file, contains } = square.dataset;

        // clicking empty square but not moving piece
        if (!fromSquare && !contains) {
            setShouldShowFeedback(false);
            return;
        }

        const isOwnPiece =
            playerColour === 'w'
                ? contains && contains.toUpperCase() === contains
                : contains && contains.toLowerCase() === contains;

        if (fromSquare) {
            playMove({ from: fromSquare, to: `${file}${rank}` });
            setFromSquare(null);
            setShouldShowFeedback(true);
        } else if (isOwnPiece) {
            setFromSquare(`${file}${rank}`);
            setShouldShowFeedback(false);
        } else {
            // don't highlight if enemy piece selected to move
            return;
        }
    }

    function clearMove(e: MouseEvent): void {
        e.preventDefault();
        setFromSquare(null);
        setShouldShowFeedback(false);
    }

    return (
        <div className={styles.board}>
            {displayPosition
                .split('/')
                .map((row, rank) =>
                    expandEmptySquares(row).map((square, file) => (
                        <Square
                            key={`${file}${rank}`}
                            contains={square}
                            rank={playerColour === 'w' ? RANK[rank] : rank + 1}
                            file={
                                playerColour === 'w'
                                    ? FILE[file]
                                    : reverse(FILE)[file]
                            }
                            selectedSquare={fromSquare}
                            registerSquare={handleSquareClick}
                            clearMove={clearMove}
                        />
                    ))
                )}
        </div>
    );
}

import { MouseEvent, useState } from 'react';
import { useChess } from '../helpers/hooks';
import { expandEmptySquares, reverse } from '../helpers/util';
import { Square } from './Square';
import { Colour } from '../types';
import styles from './chessboard.module.css';

type ChessboardProps = { line: string; playerColour: Colour };

const RANK = [8, 7, 6, 5, 4, 3, 2, 1, 0];
const FILE = 'abcdefgh';

export function Chessboard({ line, playerColour }: ChessboardProps) {
    const { position, playMove, success } = useChess(line, playerColour);
    const [fromSquare, setFromSquare] = useState<string | null>(null);
    const [shouldShowFeedback, setShouldShowFeedback] = useState(false);

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

        if (!fromSquare || isOwnPiece) {
            setFromSquare(`${file}${rank}`);
            setShouldShowFeedback(false);
        } else {
            playMove({ from: fromSquare, to: `${file}${rank}` });
            setFromSquare(null);
            setShouldShowFeedback(true);
        }
    }

    function clearMove(e: MouseEvent): void {
        e.preventDefault();
        setFromSquare(null);
        setShouldShowFeedback(false);
    }

    return (
        <>
            <div className={styles.board}>
                {displayPosition.split('/').map((row, rank) => (
                    <div key={rank}>
                        {expandEmptySquares(row).map((square, file) => (
                            <Square
                                key={file}
                                contains={square}
                                rank={
                                    playerColour === 'w' ? RANK[rank] : rank + 1
                                }
                                file={
                                    playerColour === 'w'
                                        ? FILE[file]
                                        : reverse(FILE)[file]
                                }
                                selectedSquare={fromSquare}
                                registerSquare={handleSquareClick}
                                clearMove={clearMove}
                            />
                        ))}
                    </div>
                ))}
            </div>
            {!success && shouldShowFeedback && (
                <p className={styles.incorrect}>Incorrect</p>
            )}
        </>
    );
}

import { MouseEvent, useState } from 'react';
import { useChess } from '../helpers/hooks';
import { expandEmptySquares, reverse } from '../helpers/util';
import { Square } from './Square';
import styles from './chessboard.module.css';
import { Colour } from '../types';

type ChessboardProps = { line: string; playerColour: Colour };

const RANK = [8, 7, 6, 5, 4, 3, 2, 1, 0];
const FILE = 'abcdefgh';

export function Chessboard({ line, playerColour }: ChessboardProps) {
    // TODO: Handle success responses
    const { position, playMove, success } = useChess(line, playerColour);
    const [fromSquare, setFromSquare] = useState<string | null>(null);
    const displayPosition = playerColour === 'w' ? position : reverse(position);

    function handleSquareClick(e: MouseEvent): void {
        const square = e.currentTarget as HTMLDivElement;
        const { rank, file } = square.dataset;

        if (!fromSquare) {
            setFromSquare(`${file}${rank}`);
        } else {
            playMove({ from: fromSquare, to: `${file}${rank}` });
            setFromSquare(null);
        }
    }

    return (
        <div className={styles.board}>
            {displayPosition.split('/').map((row, rank) => (
                <div key={rank}>
                    {expandEmptySquares(row).map((square, file) => (
                        <Square
                            key={file}
                            contains={square}
                            rank={playerColour === 'w' ? RANK[rank] : rank + 1}
                            file={
                                playerColour === 'w'
                                    ? FILE[file]
                                    : reverse(FILE)[file]
                            }
                            registerSquare={handleSquareClick}
                        />
                    ))}
                </div>
            ))}
        </div>
    );
}

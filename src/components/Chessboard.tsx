import { MouseEvent, useState } from 'react';
import { useChess } from '../helpers/hooks';
import { expandEmptySquares } from '../helpers/util';
import { Square } from './Square';
import styles from './chessboard.module.css';

type ChessboardProps = { line: string };

const RANK = [8, 7, 6, 5, 4, 3, 2, 1, 0];
const FILE = 'abcdefgh';

export function Chessboard({ line }: ChessboardProps) {
    const { position, playMove } = useChess(line);
    const [fromSquare, setFromSquare] = useState<string | null>(null);

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
            {position.split('/').map((row, rank) => (
                <div key={rank}>
                    {expandEmptySquares(row).map((square, file) => (
                        <Square
                            key={file}
                            contains={square}
                            rank={RANK[rank]}
                            file={FILE[file]}
                            registerSquare={handleSquareClick}
                        />
                    ))}
                </div>
            ))}
        </div>
    );
}

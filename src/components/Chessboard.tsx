import styles from './chessboard.module.css';
import { Square } from './Square';

type ChessboardProps = { line: string };

const RANK = [8, 7, 6, 5, 4, 3, 2, 1, 0];
const FILE = 'abcdefgh';

const array8Long = Array(8).fill(null);

export function Chessboard({ line }: ChessboardProps) {
    return (
        <div className={styles.board}>
            {array8Long.map((row, rank) => (
                <div>
                    {array8Long.map((square, file) => (
                        <Square rank={RANK[rank]} file={FILE[file]} />
                    ))}
                </div>
            ))}
        </div>
    );
}

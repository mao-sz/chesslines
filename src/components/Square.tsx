import { MouseEvent } from 'react';
import styles from './chessboard.module.css';

type SquareProps = {
    contains: string | null;
    rank: number;
    file: string;
    registerSquare: (e: MouseEvent) => void;
    clearMove: (e: MouseEvent) => void;
};

export function Square({
    contains,
    rank,
    file,
    registerSquare,
    clearMove,
}: SquareProps) {
    return (
        <div
            className={styles.square}
            data-rank={rank}
            data-file={file}
            data-contains={contains}
            onClick={registerSquare}
            onContextMenu={clearMove}
        >
            {contains}
        </div>
    );
}

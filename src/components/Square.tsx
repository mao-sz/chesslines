import { MouseEvent } from 'react';
import styles from './chessboard.module.css';

type SquareProps = {
    contains: string | null;
    rank: number;
    file: string;
    registerSquare: (e: MouseEvent) => void;
};

export function Square({ contains, rank, file, registerSquare }: SquareProps) {
    return (
        <div
            className={styles.square}
            data-rank={rank}
            data-file={file}
            data-contains={contains}
            onClick={registerSquare}
        >
            {contains}
        </div>
    );
}

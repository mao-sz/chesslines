import { MouseEvent } from 'react';
import styles from './chessboard.module.css';

type SquareProps = {
    contains: string | null;
    rank: number;
    file: string;
    selectedSquare: string | null;
    registerSquare: (e: MouseEvent) => void;
    clearMove: (e: MouseEvent) => void;
};

export function Square({
    contains,
    rank,
    file,
    selectedSquare,
    registerSquare,
    clearMove,
}: SquareProps) {
    const isEvenRank = rank % 2 === 0;
    const isEvenFile = 'abcdefgh'.indexOf(file) % 2 === 0;

    const shade =
        (isEvenFile && isEvenRank) || (!isEvenFile && !isEvenRank)
            ? 'light'
            : 'dark';

    const classNames = [styles.square, styles[shade]];
    if (`${file}${rank}` === selectedSquare) {
        classNames.push(styles.selected);
    }

    return (
        <button
            className={classNames.join(' ')}
            data-rank={rank}
            data-file={file}
            data-contains={contains}
            onClick={registerSquare}
            onContextMenu={clearMove}
        >
            {contains}
        </button>
    );
}

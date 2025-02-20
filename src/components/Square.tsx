import styles from './chessboard.module.css';

type SquareProps = { rank: number; file: string };

export function Square({ rank, file }: SquareProps) {
    return (
        <div className={styles.square} data-rank={rank} data-file={file}></div>
    );
}

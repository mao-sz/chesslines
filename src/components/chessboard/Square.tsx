import { type MouseEvent as ReactMouseEvent, useState } from 'react';
import { Piece } from './Piece';
import { isSameColour, conditionallyPush } from '@/util/util';
import type { Colour } from '@/types/chessboard';
import styles from './chessboard.module.css';

type SquareProps = {
    selectedSquare: string | null;
    player: Colour;
    legalMovesShown?: string[];
    contains: string | null;
    rank: number;
    file: string;
    showsRankCoordinate: boolean;
    showsFileCoordinate: boolean;
    isPromotionOption?: boolean;
};

const PROMOTION_PIECE_NAMES: Record<string, string> = {
    Q: 'queen',
    N: 'knight',
    R: 'rook',
    B: 'bishop',
};

export function Square({
    player,
    legalMovesShown,
    contains,
    rank,
    file,
    selectedSquare,
    showsRankCoordinate,
    showsFileCoordinate,
    isPromotionOption = false,
}: SquareProps) {
    const isEvenRank = rank % 2 === 0;
    const isEvenFile = 'abcdefgh'.indexOf(file) % 2 === 0;

    const shade =
        (isEvenFile && isEvenRank) || (!isEvenFile && !isEvenRank)
            ? 'light'
            : 'dark';

    const coordinate = `${file}${rank}`;

    const classNames = [styles.square, styles[shade]];
    conditionallyPush(classNames, [
        [coordinate === selectedSquare, styles.selected],
        [legalMovesShown?.includes(coordinate), styles.legal],
    ]);

    const [isDragging, setIsDragging] = useState(false);
    const [mouseCoords, setMouseCoords] = useState({ x: 0, y: 0 });

    function centreImageOnPointer(e: ReactMouseEvent) {
        if (!isSameColour(player, contains)) {
            return;
        }

        setIsDragging(true);

        const img = e.currentTarget as HTMLImageElement;
        const imgSize = img.getBoundingClientRect();
        setMouseCoords({
            x: e.clientX - imgSize.width / 2,
            y: e.clientY - imgSize.height / 2,
        });

        function calculateMouseCoords(e: MouseEvent): void {
            setMouseCoords({
                x: e.clientX - imgSize.width / 2,
                y: e.clientY - imgSize.height / 2,
            });
        }

        window.addEventListener('mousemove', calculateMouseCoords);
        window.addEventListener(
            'mouseup',
            () => {
                setIsDragging(false);
                window.removeEventListener('mousemove', calculateMouseCoords);
            },
            { once: true }
        );
    }

    return (
        <button
            className={classNames.join(' ')}
            aria-label={
                isPromotionOption
                    ? `promote to ${PROMOTION_PIECE_NAMES[contains!]}`
                    : `${coordinate} square`
            }
            data-rank={rank}
            data-file={file}
            data-contains={contains}
            onPointerDown={centreImageOnPointer}
        >
            <Piece
                piece={contains}
                isBeingDragged={isDragging}
                mouseCoords={mouseCoords}
            />
            {showsRankCoordinate && (
                <span
                    className={[styles.coordinate, styles.rank].join(' ')}
                    aria-hidden
                >
                    {rank}
                </span>
            )}
            {showsFileCoordinate && (
                <span
                    className={[styles.coordinate, styles.file].join(' ')}
                    aria-hidden
                >
                    {file}
                </span>
            )}
        </button>
    );
}

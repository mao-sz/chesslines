import { Piece } from './Piece';
import { type MouseEvent as ReactMouseEvent, useState } from 'react';
import { isSameColour } from '@/util/util';
import type { Colour } from '@/types/types';
import styles from './chessboard.module.css';

type SquareProps = {
    player: Colour;
    contains: string | null;
    rank: number;
    file: string;
    selectedSquare: string | null;
};

export function Square({
    player,
    contains,
    rank,
    file,
    selectedSquare,
}: SquareProps) {
    const isEvenRank = rank % 2 === 0;
    const isEvenFile = 'abcdefgh'.indexOf(file) % 2 === 0;

    const shade =
        (isEvenFile && isEvenRank) || (!isEvenFile && !isEvenRank)
            ? 'light'
            : 'dark';

    const coordinate = `${file}${rank}`;

    const classNames = [styles.square, styles[shade]];
    if (coordinate === selectedSquare) {
        classNames.push(styles.selected);
    }

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
            aria-label={`${coordinate} square`}
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
        </button>
    );
}

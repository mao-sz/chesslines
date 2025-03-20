import { MouseEvent as ReactMouseEvent, useState } from 'react';
import styles from './chessboard.module.css';

type PieceProps = { piece: string | null };

const pieceNames: { [key: string]: string } = {
    P: 'pawn',
    R: 'rook',
    N: 'knight',
    B: 'bishop',
    Q: 'queen',
    K: 'king',
};

export function Piece({ piece }: PieceProps) {
    const pieceImageFile = new URL(
        `/src/assets/pieces/${piece}.svg`,
        import.meta.url
    ).href;

    const colour = piece === piece?.toUpperCase() ? 'white' : 'black';

    const [isDragging, setIsDragging] = useState(false);
    const [mouseCoords, setMouseCoords] = useState({ x: 0, y: 0 });

    function centreImageOnPointer(e: ReactMouseEvent) {
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
        piece && (
            <>
                <img
                    src={pieceImageFile}
                    alt={`${colour} ${pieceNames[piece.toUpperCase()]}`}
                    style={
                        isDragging
                            ? {
                                  position: 'fixed',
                                  top: `${mouseCoords.y}px`,
                                  left: `${mouseCoords.x}px`,
                              }
                            : undefined
                    }
                    onPointerDown={centreImageOnPointer}
                    draggable={false}
                />
                <img
                    className={styles.ghost}
                    src={pieceImageFile}
                    aria-hidden={true}
                    draggable={false}
                />
            </>
        )
    );
}
